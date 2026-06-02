<template>
    <div :class="`label-group ${options.isInline ? 'label-inline' : 'label-block'}`">
        <div class="label-wrapper">
            <label>
                {{ options.labelMsg }}
                <sup v-if="options.required">*</sup>
                <a-tooltip v-if="options.tips" placement="bottom" :color="'WHITE'">
                    <template #title>
                        <div class="toolTips">
                            <span>{{ options.tips }}</span>
                        </div>
                    </template>
                    <i class="far fa-question-circle question"></i>
                </a-tooltip>
            </label>
            <template v-if="!options.isInline">
                <span class="left-words">{{ leftsWords }}</span>
            </template>
        </div>
        <div class="content-wrapper" :class="contentWrapperClass" @click="onClick($event)">
            <template v-if="options.type === 'text'">
                <input
                    ref="target"
                    :type="options.inputType"
                    :required="options.required"
                    :placeholder="options.placeholderMsg"
                    v-model="value"
                    :disabled="options.readOnly || isDisabled"
                    :maxlength="options.maxInputLength"
                    @blur="onFocusout"
                    :class="{ large: options.inputSizeClass === 'large', 'error-value': !isValueValid }"
                />
                <span v-if="options.iconClass !== ''" class="prefix-icon">
                    <i :class="options.iconClass" />
                </span>
                <fl-button
                    v-if="options.enableClear"
                    :iconClass="'fas fa-times'"
                    :type="'icon'"
                    class="input-clear"
                    @click="clearInput"
                    @mouseover="isOnClearButton = true"
                    @mouseleave="isOnClearButton = false"
                />
            </template>
            <template v-else-if="options.type === 'textarea'">
                <textarea
                    class="fl-textarea"
                    :class="{ 'fl-textarea-locked': options.enableResizeTextArea, 'error-value': !isValueValid }"
                    :rows="options.textareaRows"
                    :required="options.required"
                    :placeholder="options.placeholderMsg"
                    v-model="value"
                    :disabled="options.readOnly || isDisabled"
                    :maxlength="maxTextareaInputLength"
                ></textarea>
            </template>
            <template v-else-if="options.type === 'select'">
                <!--
                <FlSelector
                    class="fl-select"
                    :class="{ 'error-value': !isValueValid }"
                    :value="value"
                    :options="options.selectOptions"
                    :placeholder="options.placeholderMsg"
                    @updateSelector="updateSelectorValue($event)"
                    :disabled="options.readOnly"
                    :iconClass="options.iconClass"
                />-->
                <fl-multiselect
                    class="fl-select"
                    :class="{ 'error-value': !isValueValid }"
                    :show-labels="false"
                    :searchable="options.isUsingSearch"
                    :allow-empty="options.allowEmpty"
                    v-model="value"
                    :options="options.selectOptions"
                    :iconName="options.iconClass"
                    :disabled="options.readOnly || isDisabled"
                    :placeholder="options.placeholderMsg"
                    track-by="name"
                    label="name"
                />
            </template>
            <template v-else-if="options.type === 'slot'">
                <slot name="inputSlot" />
            </template>
            <div class="fuck-ff-dummy" v-if="$browserDectect().isFirefox && options.readOnly" />
        </div>
        <div v-if="!isValueValid" class="require-valid-msg"><i class="fas fa-exclamation-circle"></i>{{ invalidMessage }}</div>
    </div>
</template>
<script>
import FlSelector from './FlSelector.vue';
import FlButton from './FlButton.vue';
import FlMultiselect from './FlMultiselect.vue';
const validMap = {
    isValid: true,
    message: '',
};
export default {
    name: 'FlLabelInput',
    components: {
        FlSelector,
        FlButton,
        FlMultiselect,
    },
    props: {
        /**
         * Set Label Input all relative info.
         * The val props will do v-bind.
         * The options can be refers to data.options, the details as follow:
         * - labelMsg: {String} Label show text.
         * - placeholderMsg: {String} The input/textarea/select's placeholder.
         * - iconClass: {String} Using fontawsome icon, if set any, the icon will be show on the prefix of input field.
         * - type: {String} The input type, text/textarea/select/slot.
         * - enableClear: {Boolean} Only work with input type as text, to clear input value.
         * - isInline: {Boolean} Control label and input's display is inline or block.
         * - readOnly: {Boolean} Is read only.
         * - required: {Boolean} Is input required. Control if '*' symbol next to label is show or not.
         * - validator: {Function} If required has been set to true, then you can custom this function to control weahter is valid or not.
         *   Defalut will passing the input value, then you should return a valid map that contain keys isValid and message after value has been valided.
         *   ex: The returning map should be like this => { isValid: true, message: 'The input text cannot be blank' }
         * - selectOptions: {Array} The selector's options, ex: [{ id: id, text: text }].
         * - maxInputLength: {Number} Limited max input length.
         * - textareaRows: {Number} Set textarea show rows.
         * - inputSizeClass: {String} Set the size of input; Now only 'large' can be bigger size otherwise default size.
         * - isInputPointer: {Boolean} Set if input field show curosr as pointer while mouse over.
         * - enableResizeTextArea: {Boolean} Set if textarea can be resizeable.
         * - isUsingSearch: {Boolean} For Select Using text filter option or not.
         * - tips: {String} For Show tips icon after label.
         * - inputType: {String} The input type, text/number, default is text.
         *
         * @type Object
         */
        itemProps: {
            type: Object,
            default: () => {
                return {
                    val: '',
                    options: {},
                };
            },
        },
        isDisabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['onInputClick', 'onSelectChange', 'onValUpdate', 'onFocusout'],
    data() {
        return {
            innerValue: '',
            options: {
                labelMsg: 'Default lable message',
                placeholderMsg: '',
                iconClass: '',
                type: 'text',
                enableClear: true,
                isInline: true,
                readOnly: false,
                required: false,
                validator: function(value) {
                    return { isValid: true, message: '' };
                },
                selectOptions: [],
                maxInputLength: -1,
                textareaRows: 3,
                inputSizeClass: '', // large
                isInputPointer: false,
                enableResizeTextArea: true,
                isUsingSearch: false,
                allowEmpty: false,
                focusOnUpdate: false,
                inputType: 'text',
            },
            isValueValid: true,
            invalidMessage: '',
            isOnClearButton: false,
        };
    },
    created() {
        const that = this;
        that.options = { ...that.options, ...that.itemProps.options };
        that.innerValue = that.itemProps.val;
    },
    updated() {
        const that = this;
        if (that.options.focusOnUpdate) {
            that.setFocus();
        }
    },
    methods: {
        clearInput() {
            const that = this;
            that.value = '';
            that.setFocus();
        },
        onClick(e) {
            const that = this;
            const children = Array.from(e.currentTarget.children);
            const currentTarget = children.find((el) => {
                return el.tagName == 'INPUT' || el.tageName == 'SELECT';
            });
            that.$emit('onInputClick', that, e, currentTarget);
        },
        onChange(e) {
            const that = this;
            that.$emit('onSelectChange', that, e);
        },
        updateSelectorValue: function(val) {
            this.value = val;
        },
        onFocusout() {
            const that = this;
            if (that.isOnClearButton) {
                that.setFocus();
            } else {
                that.$emit('onFocusout');
            }
        },
        setFocus() {
            const that = this;
            if (that.$refs.target) {
                that.$refs.target.focus();
            }
        },
    },
    computed: {
        contentWrapperClass() {
            const that = this;
            const iconClass = that.options.iconClass !== '' ? 'input-with-icon' : 'input-without-icon';
            const inputClearClass = that.options.enableClear ? 'input-with-clear' : '';
            const inputCurosrPointerClass = that.options.isInputPointer && !that.isDisabled ? 'input-cursor-pointer' : '';
            const isDisabledCSS = that.isDisabled ? 'disabled' : '';
            return `${iconClass} ${inputClearClass} ${inputCurosrPointerClass} ${isDisabledCSS} `;
        },
        totalLengthWithNewLinesSymbol() {
            const that = this;
            return that.value.length;
        },
        totalLengthWithoutNewLinesSymbol() {
            const that = this;
            return that.value.replace(/(?:\\[rn]|[\r\n]+)+/g, '').length;
        },
        leftsWords() {
            const that = this;
            if (that.options.maxInputLength === -1) return '';
            return that.options.maxInputLength - that.totalLengthWithoutNewLinesSymbol;
        },
        maxTextareaInputLength() {
            const that = this;
            if (that.totalLengthWithNewLinesSymbol === that.totalLengthWithoutNewLinesSymbol) {
                return that.options.maxInputLength;
            } else {
                return that.options.maxInputLength + (that.totalLengthWithNewLinesSymbol - that.totalLengthWithoutNewLinesSymbol);
            }
        },
        value: {
            get() {
                const that = this;
                return that.innerValue;
            },
            set(value) {
                const that = this;
                that.innerValue = value;
                if (that.options.required) {
                    const validator = { ...validMap, ...that.options.validator(value) };
                    that.isValueValid = validator.isValid;
                    that.invalidMessage = validator.message;
                }
                that.$emit('onValUpdate', value, that.isValueValid);
            },
        },
    },
    watch: {
        'itemProps.val': function(newValue) {
            this.innerValue = newValue;
        },
        'itemProps.options.readOnly': function(newValue) {
            this.options.readOnly = newValue;
        },
        'itemProps.options.selectOptions': function(newValue) {
            const that = this;
            that.options.selectOptions = newValue;
        },
        // //外部改變 itemProps.val 時 , validator 無法偵測到,所以加 watch innerValue
        // innerValue: function(newValue) {
        //     this.value = newValue;
        // },
    },
};
</script>
<style lang="scss" scoped>
.label-group {
    display: flex;
    div.label-wrapper {
        position: relative;
        label {
            font-size: 16px;
            line-height: 140%;
            color: rgba(51, 51, 51, 0.87);
            margin: unset;
            sup {
                font-size: 12px;
                color: #e86460;
            }
            .question {
                line-height: 32px;
                margin-left: 8px;
                color: #0070d1;
            }
        }
        .left-words {
            position: absolute;
            color: rgba(51, 51, 51, 0.38);
            font-size: 14px;
            line-height: 140%;
            top: 0;
            right: 16px;
        }
    }
    div.content-wrapper {
        position: relative;
        padding: 4px;
        &:focus-within {
            button.input-clear {
                display: block;
            }
        }
        input,
        textarea {
            width: 100%;
            background: #ffffff;
            border: 1px solid rgba(196, 196, 196, 0.87);
            box-sizing: border-box;
            box-shadow: 0px 4px 8px rgba(196, 196, 196, 0.16);
            border-radius: 8px;
            &:focus-visible {
                outline: none;
                border-color: rgba(134, 199, 255, 0.5);
                box-shadow: 0px 0px 0px 4px rgba(215, 233, 250, 0.5);
            }
            &.error-value:focus-visible {
                outline: none;
                border-color: rgba(232, 100, 96, 0.5);
                box-shadow: 0px 0px 0px 4px rgba(255, 236, 233, 0.5);
            }
            
            
        }
        :deep(.fl-select) {
            /* fl-multiselect 修改範例 */
            width: 100%;
            &.multiselect {
                min-height: 0;
                height: 100%;
                &--disabled {
                    .multiselect__select {
                        background: unset;
                    }
                }
                // 下拉箭頭的位置
                .multiselect__select {
                    height: 100%;
                    min-height: 0;
                    &::before {
                        top: 70%;
                    }
                }
                // 下拉的外框
                .multiselect__tags {
                    padding: 0px 40px 0 8px;
                    min-height: 0;
                    height: 100%;
                    border-radius: 8px;
                    border-color: rgba(196, 196, 196, 0.87);
                    box-shadow: 0px 4px 8px rgba(196, 196, 196, 0.16);
                    &:hover {
                        border-color: #6E5FAF;
                    }
                    // 被選擇的文字, placeholder 的文字置中
                    .multiselect__single,
                    .multiselect__placeholder,
                    .multiselect__input {
                        margin: 0;
                        padding: 8px;
                    }
                }
            }
        }
        input {
            padding: 5px 16px;
            &.large {
                padding: 13px 16px;
            }
        }
        textarea {
            padding: 16px;
            &.fl-textarea-locked {
                resize: none;
            }
        }
        :deep(button.input-clear) {
            display: none;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 30px;
            cursor: pointer;
            font-size: 10px;
            color: #666666;
            width: 14px;
            height: 14px;
            line-height: 14px;
            border: 1px solid #666666;
            &:hover {
                border: 1px solid #666666;
            }
            i {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
        span.prefix-icon {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 14px;
            font-size: 14px;
            color: #666666;
        }
        &.input-with-clear {
            input {
                padding-right: 56px;
            }
        }
        &.input-with-icon {
            input {
                padding-left: 44px;
            }
        }
        &.input-cursor-pointer {
            cursor: pointer;
            input {
                cursor: pointer;
            }
        }
        .fuck-ff-dummy {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
        }
        &.disabled {
            color: #999;
            border-color: rgba(196, 196, 196, 0.87);
            :hover {
                border-color: rgba(196, 196, 196, 0.87);
            }
            
        }
        :hover {
            border-color: #6E5FAF;
            cursor: pointer;
        }
        :deep(.ant-picker-range) {
            padding: 8px;
        }
    }
    &.label-inline {
        div.label-wrapper {
            label {
                position: relative;
                top: 50%;
                transform: translateY(-50%);
                white-space: nowrap;
                margin-right: 8px;
            }
        }
        div.content-wrapper {
            display: block;
            width: 100%;
        }
    }
    &.label-block {
        flex-direction: column;
        div.label-wrapper {
            label {
                padding-left: 20px;
            }
        }
    }
    .require-valid-msg {
        color: #da1414;
        font-size: 14px;
        line-height: 20px;
        padding-left: 20px;
        i {
            margin-right: 5.33px;
        }
    }
}
.toolTips {
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 21px;
    color: #333333;
    white-space: pre-line;
}
</style>
