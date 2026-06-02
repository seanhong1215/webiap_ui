<template>
    <div class="form-wrap">
        <f-input v-model="titleItemProps.val" validateMsg="請輸入文字" @change="(...args) => onValueUpdate('proName', ...args)" :validateFn="(newVal) => newVal !== ''" :maxlength="50">
            <template #label>
                <span class="label-msg">
                    {{ titleItemProps.options.labelMsg }}
                </span>
                <span class="label-word">{{ leftsWordsInputLength }}</span>
            </template>
        </f-input>
        <f-textarea
            v-model="descItemProps.val"
            validateMsg="請輸入文字"
            @change="(...args) => onValueUpdate('desc', ...args)"
            :validateFn="(newVal) => newVal !== ''"
            :maxlength="20"
            :width="100 + '%'"
        >
            <template #label>
                <span class="label-msg">
                    {{ descItemProps.options.labelMsg }}
                </span>
                <span class="label-word">{{ leftsWordsTextareaLength }}</span>
            </template>
        </f-textarea>
    </div>
</template>
<script>
export default {
    name: 'ProcessCardEditDialog',
    components: {},
    props: {
        id: {
            type: String,
            default: '',
        },
        proName: {
            type: String,
            default: '',
        },
        desc: {
            type: String,
            default: '',
        },
        modalData: {
            type: Object,
        },
    },
    data() {
        const that = this;
        return {
            innerData: {
                id: that.id,
                proName: that.proName,
                desc: that.desc,
            },
            titleItemProps: {
                val: that.proName,
                options: {
                    labelMsg: that.$t('processInfo.proName'),
                    maxInputLength: 50,
                },
                isValid: true,
            },
            descItemProps: {
                val: that.desc,
                options: {
                    labelMsg: that.$t('processInfo.desc'),
                    maxInputLength: 20,
                },
                isValid: true,
            },
        };
    },
    emits: ['updateValidStatus', 'update'],
    created() {
        const that = this;
        that.$emit('updateValidStatus', true); // 因為這邊是修改值，所以理論上原本都是合法的，因此要將確認按鈕打開
        that.$emit('update', that.innerData); // 將初始資料給 modal 的 contentData
    },
    methods: {
        onValueUpdate(keyName, value) {
            const that = this;
            if (keyName === 'proName') {
                that.titleItemProps.val = value;
                that.titleItemProps.isValid = true;
            }
            that.innerData[keyName] = value;
            that.$emit('update', that.innerData);
            const isAllValid = that.titleItemProps.isValid ? true : false;
            that.$emit('updateValidStatus', isAllValid);
        },
    },
    computed: {
        //inputVal
        leftsWordsInputLength() {
            const that = this;
            if (that.titleItemProps.options.maxInputLength === -1) return '';
            return that.titleItemProps.options.maxInputLength - that.inputLengthWithoutNewLinesSymbol;
        },
        inputLengthWithoutNewLinesSymbol() {
            const that = this;
            return that.titleItemProps.val.replace(/(?:\\[rn]|[\r\n]+)+/g, '').length;
        },
        //textareaVal
        leftsWordsTextareaLength() {
            const that = this;
            if (that.descItemProps.options.maxInputLength === -1) return '';
            return that.descItemProps.options.maxInputLength - that.textareaLengthWithoutNewLinesSymbol;
        },
        textareaLengthWithNewLinesSymbol() {
            const that = this;
            return that.descItemProps.val.length;
        },
        textareaLengthWithoutNewLinesSymbol() {
            const that = this;
            return that.descItemProps.val.replace(/(?:\\[rn]|[\r\n]+)+/g, '').length;
        },
        maxTextareaInputLength() {
            const that = this;
            if (that.textareaLengthWithoutNewLinesSymbol === that.textareaLengthWithNewLinesSymbol) {
                return that.descItemProps.options.maxInputLength;
            } else {
                return that.descItemProps.options.maxInputLength + (that.textareaLengthWithoutNewLinesSymbol - that.textareaLengthWithNewLinesSymbol);
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.edit-dialog-desc {
    margin-top: 16px;
}
.form-wrap {
    div.f-input-wrap,
    div.f-textarea-wrap {
        margin-bottom: 16px;
        :deep(.f-input-label) {
            display: flex;
            justify-content: space-between;
            .label-msg {
                color: #5c6466;
            }
            .label-word {
                color: #a7afb2;
            }
        }
        :deep(.f-textarea-label) {
            display: flex;
            justify-content: space-between;
            .label-msg {
                color: #5c6466;
            }
            .label-word {
                color: #a7afb2;
            }
        }
    }
    div.f-textarea-wrap {
        margin-bottom: 20px;
    }
}
</style>
