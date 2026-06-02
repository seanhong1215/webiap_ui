<template>
    <button class="fl-btn" :class="btnClass" :disabled="disabled">
        <template v-if="isShowIcon()">
            <div class="icon-block">
                <i :class="btnIconClass" />
            </div>
        </template>
        <span v-if="isShowText()">{{ text }}</span>
    </button>
</template>
<script>
const buttonTypes = {
    default: {
        btnClass: 'btn-default',
        iconClass: '',
    },
    small: {
        btnClass: 'btn-small',
        iconClass: '',
    },
    confirm: {
        btnClass: 'btn-confirm',
        iconClass: 'fal fa-check',
        color: 'blue',
    },
    abort: {
        btnClass: 'btn-abort',
        iconClass: 'fal fa-times',
        color: 'gray',
    },
    icon: {
        btnClass: 'btn-circle',
        iconClass: 'fal fa-question',
    },
};
export default {
    name: 'FlButton',
    props: {
        buttonClass: {
            type: String,
            default: '',
        },
        iconClass: {
            type: String,
            default: '',
        },
        text: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'default',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        color: {
            type: String,
            default: 'gray', //gray,blue
        },
    },
    methods: {
        isShowText() {
            const that = this;
            return that.type !== 'icon';
        },
        isShowIcon() {
            const that = this;
            return that.btnIconClass !== '';
        },
    },
    computed: {
        btnIconClass() {
            const that = this;
            if (buttonTypes[that.type]) {
                if (that.type === 'confirm' || that.type === 'abort') {
                    return buttonTypes[that.type].iconClass;
                } else {
                    return that.iconClass === '' ? buttonTypes[that.type].iconClass : that.iconClass;
                }
            }
            return that.iconClass;
        },
        btnClass() {
            const that = this;
            const isDiabled = that.disabled ? 'disabled' : '';
            let thisColor = that.color;
            if (buttonTypes[that.type] && buttonTypes[that.type].color) {
                thisColor = buttonTypes[that.type].color;
            }
            thisColor = that.disabled ? '' : thisColor;
            if (buttonTypes[that.type] && that.buttonClass === '') {
                return `${buttonTypes[that.type].btnClass} ${isDiabled} ${thisColor}`;
            } else if (buttonTypes[that.type]) {
                return `${buttonTypes[that.type].btnClass} ${that.buttonClass} ${isDiabled} ${thisColor}`;
            }
            return `${that.buttonClass} ${isDiabled} ${thisColor}`;
        },
    },
};
</script>
<style lang="scss" scoped>
button.fl-btn {
    background-color: unset;
    border-radius: 4px;
    padding: 8px 10.5px 8px 10.5px;
    font-size: 16px;
    line-height: 24px;
    background: rgba(255, 255, 255, 0);
    &.btn-small {
        height: 24px;
        padding: 4px 8px;
        font-size: 12px;
        .icon-block {
            width: 16px;
            height: 22px;
            margin-right: 6px;
        }
    }
    &.disabled {
        border: 1px solid rgba(51, 51, 51, 0.38);
        color: rgba(51, 51, 51, 0.38);
        cursor: not-allowed;
        &:hover {
            background: rgba(255, 255, 255, 0);
            color: rgba(51, 51, 51, 0.38);
            border: 1px solid rgba(51, 51, 51, 0.38);
        }
        &:active {
            background: rgba(255, 255, 255, 0);
            color: rgba(51, 51, 51, 0.38);
            border: 1px solid rgba(51, 51, 51, 0.38);
        }
    }
    &.blue {
        color: #1484e5;
        background: rgba(255, 255, 255, 0);
        border: 1px solid #1484e5;
        &:hover {
            color: #1484e5;
            background: rgba(237, 246, 255, 0.5);
            border: 1px solid #1484e5;
        }
        &:active {
            color: #174ea6;
            background: #d7eafb;
            border: 1px solid #0070d1;
        }
    }
    &.light-blue {
        color: #1484e5;
        background: #ffffff;
        border: 1px solid rgba(20, 132, 229, 0.38);
        &:hover {
            color: #1484e5;
            background: rgba(237, 246, 255, 0.5);
            border: 1px solid #1484e5;
            box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.016);
        }
        &:active {
            color: #174ea6;
            background: #d7eafb;
            border: 1px solid #0070d1;
            box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.016);
        }
    }
    &.gray {
        color: rgba(51, 51, 51, 0.87);
        background: rgba(255, 255, 255, 0);
        border: 1px solid #c4c4c4;
        &:hover {
            color: rgba(51, 51, 51, 0.87);
            background: #f5f5f5;
            border: 1px solid #c4c4c4;
        }
        &:active {
            color: rgba(51, 51, 51, 0.87);
            background: #f0efef;
            border: 1px solid #c4c4c4;
        }
    }
    &.btn-circle {
        border-radius: 50%;
        padding: 0;
        width: 40px;
        height: 40px;
        border: 0px;
        line-height: 38px;
        &.blue {
            &:hover {
                border: 0px;
                background: #ffffff;
            }
            &:active {
                border: 0px;
                color: #6E5FAF;
                background: rgba(255, 255, 255, 0.8);
                box-shadow: 0px 2px 4px rgba(182, 174, 214, 0.16);
            }
        }
        &.gray {
            &:hover {
                border: 0px;
                background: #ffffff;
            }
            &:active {
                border: 0px;
                color: #6E5FAF;
                background: rgba(0, 112, 209, 0.1);
            }
        }
        &.light-blue {
            &:hover {
                border: 0px;
                background: #ffffff;
            }
            &:active {
                border: 0px;
                color: #0070d1;
                background: rgba(0, 112, 209, 0.1);
            }
        }
        &.disabled:hover {
            border: 0px;
        }
        .icon-block {
            width: inherit;
            height: inherit;
        }
    }
    &.btn-abort,
    &.btn-confirm {
        padding-left: 28.75px;
        padding-right: 28px;
    }
    &.btn-abort {
        border: 1px solid #c4c4c4;
        color: rgba(51, 51, 51, 0.87);
        &:hover {
            background: #f5f5f5;
        }
        &:active {
            background: #f0efef;
        }
        &.disabled {
            color: rgba(51, 51, 51, 0.38);
        }
    }
    .icon-block {
        width: 16px;
        height: 24px;
        display: inline-block;
        text-align: center;
        vertical-align: bottom;
        margin-right: 8px;
        line-height: inherit;
    }
}
</style>
