<template>
    <div style="position: relative;">
        <div ref="selector-div" class="af-selector-div" :class="{ 'af-selector-focus': isHaveFocus }" :tabindex="0" @blur="deactivate()">
            <div style="width: 18px" />
            <div style="width: calc(100% - 18px)" class="fl-row" @mouseover="isMouseInInput = true" @mouseleave="isMouseInInput = false">
                <div style="width: calc(100% - 32px)" v-show="!isOpen && isDisabledEditRuleByUPProcess">
                    <a-tooltip placement="top">
                        <template #title>
                            <span style="white-space: pre-line;">{{ getOptionValue }}</span>
                        </template>
                        <div style="width: 100%;">
                            <input class="af-data-show" style="width: 100%;" :placeholder="placeholder" :value="getNameNotTooLong(getOptionValue, '')" disabled="true" />
                        </div>
                    </a-tooltip>
                </div>
                <div style="width: calc(100% - 32px)" @click="openLevelList" v-show="!isOpen && !isDisabledEditRuleByUPProcess">
                    <a-tooltip placement="top">
                        <template #title>
                            <span style="white-space: pre-line;">{{ getOptionValue }}</span>
                        </template>
                        <div style="width: 100%;">
                            <input class="af-data-show" style="width: 100%;" :placeholder="placeholder" :value="getNameNotTooLong(getOptionValue, '')" disabled="true" />
                        </div>
                    </a-tooltip>
                </div>
                <div style="width: calc(100% - 32px)" v-show="isOpen  && !isDisabledEditRuleByUPProcess">
                    <input
                        ref="search"
                        style="width: 100%;"
                        :placeholder="getNameNotTooLong(showObj.name, '')"
                        v-model="searchingText"
                        :tabindex="0"
                        @focus="isHaveFocus = true"
                        @blur.prevent="deactivate()"
                    />
                </div>
                <div class="af-icon-state-div">
                    <i class="fal fa-times-circle af-icon-click" v-show="getStateIcon == 'del'" @click="resetShowObj" />
                    <i class="fas fa-sort-down af-icon-state af-icon-click" style="color: rgb(153, 153, 153);" v-show="getStateIcon == 'open'" @click="openLevelList" />
                    <i class="fas fa-search af-icon-state" v-show="getStateIcon == 'search'" />
                </div>
            </div>
        </div>
        <div v-show="isOpen" class="af-list-div" style="position: absolute; width: 100%;" @mouseover="isMouseInList = true" @mouseleave="isMouseInList = false">
            <!-- search list-->
            <div v-show="searchingText">
                <ul :style="{ height: getUlHeight, width: '100%' }">
                    <li>搜尋結果</li>
                    <div v-show="filteredSearchingOptions.length == 0" class="af-search-none-div" :style="{ height: '100%', width: '100%' }">
                        <span>查無結果</span>
                    </div>
                    <li v-for="option in filteredSearchingOptions" :key="option.id" @click="clickOption(option, -1)">
                        <a-tooltip placement="top">
                            <template #title>
                                <span style="white-space: pre-line;">{{ option.fullName }}</span>
                            </template>
                            <span>{{ getNameNotTooLong(option.fullName, '') }} </span>
                        </a-tooltip>
                    </li>
                </ul>
            </div>
            <!-- level list-->
            <div v-show="!searchingText" class="fl-row">
                <!-- level 1-->
                <div :style="{ height: getUlHeight, width: '50%' }">
                    <ul :style="{ height: getUlHeight, width: '50%' }" v-show="isExpandedPerLevel[0]">
                        <li>{{ titleLevel[0] }}</li>
                        <li v-for="option in options" :key="option.id" @click="clickOption(option, 0)" :class="{ 'af-li-selected': isThisOptionSelected(option.id, 0) }">
                            <a-tooltip placement="top">
                                <template #title>
                                    <span style="white-space: pre-line;">{{ option.name }}</span>
                                </template>
                                <span>{{ getNameNotTooLong(option.name, 'levelList') }} </span>
                            </a-tooltip>
                            <div class="af-icon-state-div">
                                <i class="fas fa-chevron-right af-icon-state"></i>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- level 2-->
                <div :style="{ height: getUlHeight, width: '50%' }">
                    <ul :style="{ height: getUlHeight, width: '50%' }" v-show="isExpandedPerLevel[1]">
                        <li>{{ titleLevel[1] }}</li>
                        <li v-for="option in getChildrenInSelectedLevel(0)" :key="option.id" @click="clickOption(option, 1)" :class="{ 'af-li-selected': isThisOptionSelected(option.id, 1) }">
                            <a-tooltip placement="top">
                                <template #title>
                                    <span style="white-space: pre-line;">{{ option.name }}</span>
                                </template>
                                <span>{{ getNameNotTooLong(option.name, 'levelList') }} </span>
                            </a-tooltip>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'FlCascaderL2', //Cascader, level 2
    components: {},
    emits: ['updateSelector'],
    data: function() {
        const lastLevel = 1; //base 0
        return {
            valueInner: this.value, //level 2 id
            showObj: { name: '', id: '' }, //顯示用的物件
            searchingText: '', //搜尋文字
            isExpandedPerLevel: [false, false], //level list 是否展開
            selectedOptionsPerLevel: [{}, {}], //紀錄 level list 點選的物件
            isOpening: false, //判斷 deactivate 條件使用
            isMouseInList: false, //判斷 deactivate 條件使用
            isMouseInInput: false, //判斷移除按鈕顯示
            isHaveFocus: false, //判斷物件是否還在使用中,CSS 用
            lastLevel: lastLevel,
        };
    },
    props: {
        options: { default: [] },
        value: {}, //level 2 id
        placeholder: { default: '請選擇欲觸發的流程' },
        titleLevel: { default: ['所屬分類', '流程名稱'] },
        itemCount: { default: 5 }, //顯示筆數-對應下拉列表高度
        disabled: {
            type: Boolean,
            default: false,
        },
        isDisabledEditRuleByUPProcess: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        emitSelectOption: function(value) {
            const that = this;
            that.$emit('updateSelector', value);
        },
        openLevelList() {
            const that = this;

            that.isOpening = true;
            that.isHaveFocus = true;
            that.isExpandedPerLevel[0] = true;
            that.searchingText = '';

            if (that.valueInner != '') {
                let expendOption = that.findIdMatchOption(that.valueInner);
                if (expendOption) {
                    let path = expendOption.path;
                    let idLevel1 = path[0];
                    let optionLevel1 = that.findIdMatchOption(idLevel1);

                    if (optionLevel1) {
                        that.selectedOptionsPerLevel[0] = optionLevel1;
                        that.selectedOptionsPerLevel[1] = expendOption;
                        that.isExpandedPerLevel[1] = true;
                    }
                }
            }
            that.setFocusToSearch();
        },
        setFocusToSearch() {
            console.log('setFocusToSearch');
            const that = this;
            if (that.$refs.search) {
                that.$nextTick(() => {
                    that.$refs.search.focus();
                    that.isOpening = false;
                });
            }
        },
        clickOption(option, level) {
            const that = this;
            if (level == -1) {
                //from search list
                that.setShowObj(option);
                that.hideAllExpanded();
            } else {
                //from level list
                that.selectedOptionsPerLevel[level] = option;
                that.isExpandedPerLevel[level + 1] = true;
                if (level == that.lastLevel) {
                    let matchOption = that.findIdMatchOption(option.id);
                    that.setShowObj(matchOption);
                    that.hideAllExpanded();
                } else {
                    that.setFocusToSearch();
                }
            }
        },

        findIdMatchOption(id) {
            const that = this;
            let list = that.getAllOptionList;
            let matchIdOptions = list.filter((listOption) => {
                return listOption.id == id;
            });
            if (matchIdOptions.length > 0) {
                return matchIdOptions[0];
            }

            return null;
        },
        getChildrenInSelectedLevel(level) {
            const that = this;
            let option = that.selectedOptionsPerLevel[level];
            if (option && option.children) {
                return option.children;
            } else {
                return [];
            }
        },
        resetShowObj() {
            const that = this;
            that.showObj = { name: '', id: '' };
            that.valueInner = '';
            that.hideAllExpanded();
        },
        setShowObj(option) {
            const that = this;
            that.showObj.name = option.fullName;
            that.showObj.id = option.id;
            that.valueInner = option.id;
            that.emitSelectOption(that.valueInner);
        },
        hideAllExpanded() {
            const that = this;
            that.searchingText = '';
            that.isHaveFocus = false;
            that.isExpandedPerLevel = that.isExpandedPerLevel.map((x) => false);
        },
        deactivate() {
            const that = this;
            if (!that.isOpen) return;
            if (that.isOpening) return;

            if (!that.isMouseInList) {
                that.hideAllExpanded();
            }
        },
        getNameNotTooLong(value, refName) {
            const that = this;
            if (that.$refs['selector-div']) {
                let maxLen = that.$refs['selector-div'].clientWidth / 14;
                if (refName == 'levelList') {
                    maxLen = maxLen / 2;
                }
                if (value.length > maxLen) {
                    return `${value.substring(0, maxLen - 1)}...`;
                }
            }
            return value;
        },
        isThisOptionSelected(id, level) {
            const that = this;
            if (that.selectedOptionsPerLevel[level].id == id) {
                return true;
            } else false;
        },
    },
    computed: {
        getOptionValue: function() {
            const that = this;
            let res = '';
            if (that.options !== undefined) {
                Array.from(that.getAllOptionList).forEach((option) => {
                    if (option.id == that.valueInner) {
                        res = option.fullName;
                    }
                });
            }
            return res;
        },
        getAllOptionList: function() {
            const that = this;
            if (!that.options) {
                return [];
            }
            let res = [];
            that.options.forEach((option) => {
                option.fullName = option.name + '';
                option.path = [option.id];
                res.push(option);

                if (option.children) {
                    option.children.forEach((child) => {
                        child.fullName = option.name + ' / ' + child.name;
                        child.path = [option.id, child.id];
                        res.push(child);
                    });
                }
            });
            return res;
        },
        filteredSearchingOptions: function() {
            const that = this;
            let list = that.getAllOptionList;
            let res = list.filter((option) => {
                //only get level 2
                if (option.path.length != 2) {
                    return false;
                }

                if (that.searchingText == '') {
                    return true;
                }
                return option.fullName.indexOf(that.searchingText) > -1;
            });
            return res;
        },
        getUlHeight: function() {
            const that = this;
            let min = this.itemCount + 1; // +1 for title
            if (that.options.length < that.itemCount) {
                min = that.options.size;
            }
            return min * 32 + 'px';
        },
        isOpen: function() {
            const that = this;
            if (that.searchingText) {
                return true;
            } else if (that.isExpandedPerLevel[0]) {
                return true;
            }
            return false;
        },
        getStateIcon() {
            const that = this;
            if (that.isMouseInInput && that.showObj.id != '') {
                return 'del';
            } else if (that.isOpen) {
                return 'search';
            } else {
                return 'open';
            }
        },
    },

    watch: {
        value: {
            immediate: true,
            handler() {
                this.valueInner = this.value;
            },
        },
    },
};
</script>
<style scoped lang="scss">
.fl-row {
    display: flex;
    flex-direction: row;
}
.af-selector-div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    border: 1px solid #dadce0;
    box-sizing: border-box;
    box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.016);
    border-radius: 4px;
    height: 32px;
    font-family: Noto Sans TC;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 22px;

    .af-icon-state-div {
        height: 32px;
        width: 32px;
        float: right;
        border: none;
        background: transparent;

        .af-icon-state {
            font-size: 16px;
            background: transparent;
            border: none;
        }
    }

    .af-data-show {
        color: rgba(51, 51, 51, 0.6);
        &:hover {
            cursor: text;
            color: rgba(51, 51, 51, 0.87);
        }
    }

    div {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    input {
        background: white;
        border: none;
        border-color: transparent;
        border-width: 0px;
        outline: 0; /* I have also tried outline:none */
        -webkit-appearance: none;
        box-shadow: none;
        -moz-box-shadow: none;
        -webkit-box-shadow: none;
    }

    &:hover {
        border-color: #40a9ff;
    }
}

.af-selector-div.af-selector-focus {
    border-color: #40a9ff;
}

.af-list-div {
    font-family: Noto Sans TC;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 22px;
    background: WHITE;
    ul {
        background: WHITE;
        position: absolute;
        top: 5px;
        list-style-type: none;
        padding-inline-start: 0px;
        margin-top: 32px;
        box-shadow: 0px 4px 8px rgb(0 36 179 / 10%);
        z-index: 100;
        width: calc(100% + 25px);
        overflow: auto;

        li {
            //width: 100%;
            height: 32px;
            padding-left: 16px;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            &:hover {
                background: #f5f5f5;
            }

            .af-icon-state-div {
                height: 32px;
                width: 32px;
                float: right;
                border: none;
                background: transparent;

                display: flex;
                justify-content: center;
                align-items: center;

                .af-icon-state {
                    font-size: 16px;
                    background: transparent;
                    border: none;
                }
            }
        }
        li:first-child {
            position: fixed;
            margin-top: -32px;
            font-family: Noto Sans TC;
            font-style: normal;
            font-weight: 500;
            font-size: 12px;
            line-height: 24px;
            color: #0070d1;
            background: WHITE;
            &:hover {
                color: #0070d1;
                background: WHITE;
            }
        }

        li.af-li-selected {
            background: #e6f7ff !important;
            &:hover {
                background: #e6f7ff !important;
            }
        }
    }

    .af-search-none-div {
        color: #77838e;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.af-icon-click {
    &:hover {
        cursor: pointer;
    }
}
</style>
