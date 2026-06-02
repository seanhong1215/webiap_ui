<template>
    <div class="fl-at">
        <div class="fl-at-div">
            <div class="fl-at-show-div" v-html="htmlText" @click="openEditBlock"></div>
            <div
                contenteditable="true"
                ref="edit"
                :style="{ width: editWidth, top: adjustEditTop }"
                class="fl-at-edit-div"
                v-show="isShowEditBlock"
                v-html="htmlText"
                v-on:keyup="keymonitor"
                @keydown.enter="exitEdit"
                @keydown.esc="exitEdit"
                @blur="exitEdit"
                @click="
                    saveEditCaret();
                    checkEditPostion();
                "
            />
            <div
                class="fl-at-button-div"
                v-show="isShowEditBlock"
                :style="{ top: `calc(${adjustEditTop} + 100px)` }"
                @click="openList('button')"
                @mouseover="isMouseInList = true"
                @mouseleave="isMouseInList = false"
            >
                {{ atKey }}
            </div>
        </div>
        <div
            ref="selector-div"
            class="fl-at-list-div"
            :style="{ top: listPositionInner.y, left: listPositionInner.x }"
            v-show="isShowList"
            @mouseover="isMouseInList = true"
            @mouseleave="isMouseInList = false"
            v-click-outside="onClickOutside"
        >
            <li>
                <div class="fl-list-search-div fl-row">
                    <div class="fl-list-search-icon-div">
                        <i class="fas fa-search" />
                    </div>
                    <div style="width: calc(100% - 32px)" class="fl-list-search-text-div">
                        <input ref="search" style="width: 100%;" :placeholder="$t('flAt.search')" v-model="searchingText" />
                    </div>
                </div>
            </li>
            <ul :style="{ height: getUlHeight, width: '100%' }">
                <li v-for="option in filteredSearchingOptions" :key="option.id" @click="clickOption(option)" class="fl-list-li">
                    <a-tooltip placement="top">
                        <template #title>
                            <span style="white-space: pre-line;">{{ option.synopsis }}</span>
                        </template>
                        <span class="fl-list-li-name">{{ option.synopsis }}</span>
                    </a-tooltip>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FlAt',
    emits: ['updateValue'],
    props: {
        //ART ITEMS
        list: {
            type: Array,
            default: [], //[{id,showName,synopsis}] synopsis for search list
        },
        //DST 對應
        text: {
            type: String,
            default: '',
        },
        //編輯框的寬度
        editWidth: {
            type: String,
            default: '100px',
        },
        //AT列表的位置
        listPosition: {
            type: Object,
            default: () => {
                return {
                    x: '0px',
                    y: '0px',
                };
            },
        },
        //功能字元
        atKey: {
            type: String,
            default: '$',
        },
        //編輯框的上下位移
        adjustEditTop: {
            type: String,
            default: '0px',
        },
        //可編輯
        isEditable: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            htmlText: '', //顯示用的HTML內容
            isShowEditBlock: false, //顯示 EDIT Block
            isShowList: false, //顯示AT列表
            searchingText: '', //AT列表的搜尋過濾文字
            listOpenBy: 'key', //key,button AT列表怎麼開的,需不需要倒退刪除
            listPositionInner: this.listPosition, //AT列表的絕對定位
            isMouseInList: false, //滑鼠在AT列表中的時候不處理 EDIT 失焦事件
            editCaret: 0, //EDIT Block 的輸入游標位移
            isMoveCaretByCode: false, //點擊到SPAN上的話要移動游標位置到後面
        };
    },
    methods: {
        //顯示編輯區塊
        openEditBlock() {
            const that = this;
            if (!that.isEditable) {
                return;
            }
            that.isShowEditBlock = true;
            if (that.$refs.edit) {
                that.$nextTick(() => {
                    //wait edit v-show open
                    that.$refs.edit.focus();
                });
            }
        },
        //把 showName 轉成 AT 方塊
        replaceTextToHtmlByList(text, list) {
            if (text == '') {
                return '';
            }
            const that = this;
            list.forEach((item) => {
                let htmlBlock = that.createHtmlBlock(item.id, item.showName);
                text = text.replaceAll(item.id, htmlBlock);
            });

            return text;
        },
        //把 showName 轉成 AT 方塊
        createHtmlBlock(id, text) {
            return `<span class="fl-at-block" ansid="${id}" contenteditable="false" > ${text} </span>`;
        },
        //EDIT 失焦,ESC,ENTER
        exitEdit(e) {
            const that = this;
            if (that.isMouseInList) {
                return;
            }
            that.htmlText = e.target.innerHTML;
            that.isShowEditBlock = false;
            that.closeShowList();
        },
        //點擊SPAN的話,位置要跑到SPAN後面
        checkEditPostion() {
            const that = this;

            let tempHtmlText = that.$refs.edit.innerHTML;
            let tempStr = tempHtmlText.substring(0, that.editCaret);
            const spanStart = '<span class="fl-at-block" ansid=';
            const spanEnd = '</span>';
            let needDoMove = false;

            let findSpanStartNumber = tempStr.lastIndexOf(spanStart);
            let findSpanEndNumber = tempStr.lastIndexOf(spanEnd);

            if (findSpanStartNumber >= 0 && findSpanEndNumber < 0) {
                needDoMove = true;
            } else if (findSpanStartNumber >= 0 && findSpanEndNumber >= 0) {
                if (findSpanStartNumber > findSpanEndNumber) {
                    needDoMove = true;
                }
            }

            if (needDoMove) {
                let spanEndBeforeCaret = tempHtmlText.indexOf(spanEnd, findSpanStartNumber);
                that.editCaret = spanEndBeforeCaret + spanEnd.length;
                //console.log('checkEditPostion:' + that.editCaret);
                that.isMoveCaretByCode = true;
            } else {
                that.isMoveCaretByCode = false;
            }
        },
        //偵測鍵盤輸入
        keymonitor: function(event) {
            const that = this;

            if (event.key == that.atKey) {
                that.openList('key');
                if (!that.isMoveCaretByCode) {
                    that.saveEditCaret();
                }
            } else {
                that.saveEditCaret();
            }
            that.isMoveCaretByCode = false;
        },
        //開啟AT列表
        openList(openBy) {
            const that = this;
            that.isShowList = true;
            that.listOpenBy = openBy;
        },
        //儲存輸入框游標位置
        saveEditCaret() {
            const that = this;
            that.editCaret = that.getCaretPosition();
            console.log('saveEditCaret:' + that.editCaret);
        },
        //取得輸入框游標 XY
        getSelectionCoords(win) {
            win = win || window;
            var doc = win.document;
            var sel = doc.selection,
                range,
                rects,
                rect;
            var x = 0,
                y = 0;
            if (sel) {
                if (sel.type != 'Control') {
                    range = sel.createRange();
                    range.collapse(true);
                    x = range.boundingLeft;
                    y = range.boundingTop;
                }
            } else if (win.getSelection) {
                sel = win.getSelection();
                if (sel.rangeCount) {
                    range = sel.getRangeAt(0).cloneRange();
                    if (range.getClientRects) {
                        range.collapse(true);
                        rects = range.getClientRects();
                        if (rects.length > 0) {
                            rect = rects[0];
                        }
                        x = rect.left;
                        y = rect.top;
                    }
                    // Fall back to inserting a temporary element
                    if (x == 0 && y == 0) {
                        var span = doc.createElement('span');
                        if (span.getClientRects) {
                            // Ensure span has dimensions and position by
                            // adding a zero-width space character
                            span.appendChild(doc.createTextNode('\u200b'));
                            range.insertNode(span);
                            rect = span.getClientRects()[0];
                            x = rect.left;
                            y = rect.top;
                            var spanParent = span.parentNode;
                            spanParent.removeChild(span);

                            // Glue any broken text nodes back together
                            spanParent.normalize();
                        }
                    }
                }
            }
            return { x: x, y: y };
        },
        //省略過長文字//用不到
        getNameNotTooLong(value, refName) {
            const that = this;
            if (that.$refs['selector-div']) {
                let maxLen = that.$refs['selector-div'].clientWidth / 12;
                if (value.length > maxLen) {
                    return `${value.substring(0, maxLen - 1)}...`;
                }
            }
            return value;
        },
        //點擊 AT LIST 選項
        clickOption(option) {
            const that = this;
            that.setHtmlTextFromEditBlock();
            that.appendHtmlBlock(option);
            that.closeShowList();
        },
        //從選項插入 AT 方塊
        appendHtmlBlock(item) {
            const that = this;
            let htmlBlock = that.createHtmlBlock(item.id, item.showName);
            let tempHtmpText = that.$refs.edit.innerHTML;

            if (that.listOpenBy == 'key' && tempHtmpText.charAt(that.editCaret - 1) == that.atKey) {
                //移除前一個$
                that.htmlText = tempHtmpText.slice(0, that.editCaret - 1) + htmlBlock + tempHtmpText.slice(that.editCaret);
            } else {
                that.htmlText = tempHtmpText.slice(0, that.editCaret) + htmlBlock + tempHtmpText.slice(that.editCaret);
            }
        },
        //取得輸入框游標位移 //用不到了
        getCaretCharacterOffsetWithin() {
            const that = this;
            let element = that.$refs.edit;
            var caretOffset = 0;
            var doc = element.ownerDocument || element.document;
            var win = doc.defaultView || doc.parentWindow;
            var sel;
            if (typeof win.getSelection != 'undefined') {
                sel = win.getSelection();
                if (sel.rangeCount > 0) {
                    var range = win.getSelection().getRangeAt(0);
                    var preCaretRange = range.cloneRange();
                    preCaretRange.selectNodeContents(element);
                    preCaretRange.setEnd(range.endContainer, range.endOffset);
                    caretOffset = preCaretRange.toString().length;
                }
            } else if ((sel = doc.selection) && sel.type != 'Control') {
                var textRange = sel.createRange();
                var preCaretTextRange = doc.body.createTextRange();
                preCaretTextRange.moveToElementText(element);
                preCaretTextRange.setEndPoint('EndToEnd', textRange);
                caretOffset = preCaretTextRange.text.length;
            }
            return caretOffset;
        },
        //取得輸入框游標位移，包含 TAG(會把 </span> 先算進來)
        getCaretPosition() {
            const that = this;
            let node = that.$refs.edit;
            var range = window.getSelection().getRangeAt(0),
                preCaretRange = range.cloneRange(),
                caretPosition,
                tmp = document.createElement('div');

            preCaretRange.selectNodeContents(node);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            tmp.appendChild(preCaretRange.cloneContents());
            caretPosition = tmp.innerHTML.length;
            return caretPosition;
        },
        //處理 AT 列表失焦
        onClickOutside(event) {
            const that = this;
            if (that.isMouseInList) {
                return;
            }
            that.closeShowList();
        },
        //關閉AT列表
        closeShowList() {
            const that = this;
            that.isShowList = false;
            that.searchingText = '';
        },
        //從 EDIT BLOCK 更新 HTML TEXT
        setHtmlTextFromEditBlock() {
            const that = this;
            let node = that.$refs.edit;
            that.htmlText = node.innerHTML;
        },
        //把 htmlText 轉成 DB 格式
        getDBStringFromHtmlText(htmlText) {
            const that = this;
            const spanStart = '<span class="fl-at-block" ansid=';
            const spanEnd = '</span>';
            const ansKey = '$ans';
            let remainStr = htmlText;
            let res = '';
            let findSpanStartIndex = remainStr.indexOf(spanStart);
            let findSpanEndIndex = remainStr.indexOf(spanEnd);

            while (findSpanStartIndex >= 0) {
                res += remainStr.substring(0, findSpanStartIndex);
                let spanStr = remainStr.substring(findSpanStartIndex, findSpanEndIndex);
                //ansid="$ans(Artifact1.ComboBox1)"
                let temp = spanStr.substring(spanStr.indexOf(ansKey));
                let ansid = temp.substring(0, temp.indexOf('"'));
                res += ansid;
                remainStr = remainStr.substring(findSpanEndIndex + spanEnd.length);

                findSpanStartIndex = remainStr.indexOf(spanStart);
                findSpanEndIndex = remainStr.indexOf(spanEnd);
            }

            res += remainStr;
            res = that.replaceHtmlEntites(res);
            return res;
        },
        //把 Html 特殊格式的字元換掉
        replaceHtmlEntites(text) {
            let res = ''
                .concat(text)
                .replaceAll('&nbsp;', ' ')
                .replaceAll('&amp;', '&')
                .replaceAll('&quot;', '"')
                .replaceAll('&lt;', '<')
                .replaceAll('&gt;', '>')
                .replaceAll('&#39;', "'");

            return res;
        },
    },
    computed: {
        //過濾AT列表選項
        filteredSearchingOptions: function() {
            const that = this;
            if (that.searchingText == '') {
                return that.list;
            }
            let res = that.list.filter((option) => {
                return option.synopsis.indexOf(that.searchingText) > -1;
            });
            return res;
        },
        //計算AT列表的高度
        getUlHeight: function() {
            const that = this;
            let max = 5; // +1 for search
            let length = that.filteredSearchingOptions.length;
            if (length < max) {
                return length * 38 + 'px';
            }
            return max * 38 + 'px';
        },
    },
    watch: {
        listPosition: {
            immediate: true,
            handler() {
                this.listPositionInner = this.listPosition;
            },
        },
        htmlText: {
            immediate: true,
            handler() {
                const that = this;
                let res = that.getDBStringFromHtmlText(that.htmlText);
                this.$emit('updateValue', res);
            },
        },
        text: {
            immediate: true,
            handler() {
                const that = this;
                that.htmlText = that.replaceTextToHtmlByList(that.text, that.list);
            },
        },
    },
    created() {
        const that = this;
        that.htmlText = that.replaceTextToHtmlByList(that.text, that.list);
    },
};
</script>
<style lang="scss">
.fl-at {
    .fl-at-edit-div {
        position: absolute;
        z-index: 1002;
        top: 0px;
    }
    .fl-at-button-div {
        position: absolute;
        z-index: 1003;
        top: 100px;
        right: 15px;
    }
    .fl-at-list-div {
        position: fixed;
        z-index: 1003;
    }
}
.fl-at-block {
    background: #f3f6fc;
    border: 0.5px solid #b1bac1;
    box-sizing: border-box;
    border-radius: 2px;
    font-family: Noto Sans TC;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    color: #676c78;
    margin-left: 4px;
    margin-right: 4px;
}
</style>
<style lang="scss" scoped>
.fl-row {
    display: flex;
    flex-direction: row;
}
.fl-at {
    width: 100%;
    height: 100%;
    .fl-at-div {
        width: 100%;
        height: 100%;

        .fl-at-show-div {
            width: 100%;
            height: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;

            line-height: 32px;

            span {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            &:hover {
                cursor: text;
            }
        }
        .fl-at-edit-div {
            white-space: pre-wrap;
            height: 125px;
            background: #ffffff;
            border: 2px solid #1484e5;
            box-sizing: border-box;
            box-shadow: inset 0px 0px 0px 6px rgba(215, 233, 250, 0.5);
            border-radius: 2px;
            padding: 4px;
            &:focus {
                outline: 0px solid transparent;
            }
        }
        .fl-at-button-div {
            &:hover {
                cursor: pointer;
            }
        }
    }
    .fl-at-list-div {
        width: 240px;
        padding: 8px;
        font-family: Noto Sans TC;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 22px;
        background: #ffffff;
        box-shadow: 0px 8px 28px rgba(0, 36, 179, 0.08);
        border-radius: 2px;

        .fl-list-search-div {
            background: #ffffff;
            border: 1px solid #dadce0;
            box-sizing: border-box;
            box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.016);
            border-radius: 4px;
            align-items: center;
            .fl-list-search-icon-div {
                width: 32px;
                height: 32px;
                color: #666666;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .fl-list-search-text-div {
                display: flex;
                align-items: center;
                height: 32px;
                input {
                    outline: none;
                    border: none;
                }
            }
        }
        li {
            list-style-type: none;
            padding-inline-start: 0px;
        }
        .fl-list-li {
            height: 38px;
            color: #333333;
            padding-left: 16px;
            display: flex;
            align-items: center;

            &:hover {
                background: #f5f5f5;
                cursor: pointer;
            }

            .fl-list-li-name {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        ul {
            overflow: auto;
            padding: 0;
            width: 100%;
            list-style-type: none;
            padding-inline-start: 0px;
        }
    }
}
</style>
