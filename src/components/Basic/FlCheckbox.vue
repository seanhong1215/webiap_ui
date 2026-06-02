<template>
    <div class="fl-checkbox-wrapper">
        <div v-if="iconClass !== ''" style="width: 32px;justify-content: center;"><i class="af-icon" :class="iconClass" :style="allStyle.iconStyle" /></div>
        <label ref="checkbox" class="fl-checkbox-container">
            <input type="checkbox" v-model="valueInner" :style="allStyle.checkStyle" :disabled="disableCheckBox" @click="check" />
            <span class="checkmark"></span>
        </label>
        <span class="fl-checkbox-text" :style="allStyle.textStyle" v-if="text != ''" @click="doClickSync()">{{ text }}</span>
    </div>
</template>
<script>
export default {
    name: 'FlCheckbox',
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        allStyle: {
            type: Object,
            default: () => {
                return { iconStyle: {}, textStyle: {}, checkStyle: {} };
            },
        },
        iconClass: {
            type: String,
            default: '',
        },
        text: {
            type: String,
            default: '',
        },
        disableCheckBox: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['updateCheckbox'],
    data() {
        return {
            valueInner: this.value,
            triggerByClickEvent: false,
        };
    },
    methods: {
        check() {
            this.triggerByClickEvent = true;
        },
        updateState(value) {
            this.$emit('updateCheckbox', value, this.triggerByClickEvent);
            this.triggerByClickEvent = false;
        },
        doClickSync() {
            const that = this;
            that.$refs.checkbox.click();
        }
    },
    watch: {
        value: {
            handler() {
                this.valueInner = this.value;
            },
        },
        valueInner: {
            handler() {
                this.updateState(this.valueInner);
            },
        },
    },
};
</script>
<style scoped lang="scss">
div.fl-checkbox-wrapper {
    display: flex;
    align-items: center;
    label.fl-checkbox-container {
        display: block;
        position: relative;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        height: 20px;
        width: 20px;
        margin: unset;
        /* Hide the browser's default checkbox */
        input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
        }
        .checkmark {
            position: absolute;
            top: 0;
            left: 0;
            height: 20px;
            width: 20px;
            background: #ffffff;
            border: 2px solid #dadce0;
            border-radius: 4px;
        }
        /* On mouse-over, add a grey background color */
        /*
        &:hover input ~ .checkmark {
            background-color: #ccc;
        }
        */
        /* When the checkbox is checked, add a blue background */
        input:checked ~ .checkmark {
            background-color: #1484e5;
            border: 0px;
        }

        input:disabled ~ .checkmark {
            background: linear-gradient(0deg, rgba(102, 102, 102, 0.38), rgba(102, 102, 102, 0.38)), #ffffff;
        }
        /* Create the checkmark/indicator (hidden when not checked) */
        .checkmark:after {
            content: '';
            position: absolute;
            display: none;
        }
        /* Show the checkmark when checked */
        input:checked ~ .checkmark:after {
            display: block;
        }

        /* Style the checkmark/indicator */
        .checkmark:after {
            left: 50%;
            top: 50%;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: translate(-50%, -50%) rotate(45deg);
            border-radius: 0 1px 0 1px;
        }
    }
    span.fl-checkbox-text {
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        color: #333333;
        margin-left: 12px;
        cursor: pointer;
        white-space: nowrap;
    }
}
</style>
