<template>
    <div class="fl-radio-wrap">
        <label ref="radio" :for="options.id" class="fl-radio-label">
            <input type="radio" class="fl-radio" :id="options.id" :name="options.name" :value="options.value" v-model="pkd" :disabled="disabled" />
            <span class="checkmark"></span>
        </label>
        <span class="fl-radio-msg" v-if="options.labelMsg != ''" @click="doClickSync()">{{ options.labelMsg }}</span>
        <div class="fl-radio-slot" v-if="isShowSlot" @click="doClickSync()">
            <slot name="component"> </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FlRadioButton',
    props: {
        itemProps: {
            type: Object,
            default: () => {
                return {};
            },
        },
        picked: {
            type: String,
            default: '',
        },
        isAlwaysShowSlotContent: {
            type: Boolean,
            default: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['onValPicked'],
    data() {
        return {
            options: {
                id: '',
                labelMsg: '',
                name: '',
                value: '',
            },
            innerPicked: '',
        };
    },
    created() {
        const that = this;
        that.options = { ...that.options, ...that.itemProps };
        that.innerPicked = that.picked;
    },
    watch: {
        picked: {
            immediate: true,
            handler() {
                this.innerPicked = this.picked;
            },
        },
    },
    methods: {
        doClickSync() {
            const that = this;
            that.$refs.radio.click();
        }
    },
    computed: {
        pkd: {
            get() {
                return this.innerPicked;
            },
            set(value) {
                this.innerPicked = value;
                this.$emit('onValPicked', this.innerPicked);
            },
        },
        isShowSlot() {
            const that = this;
            if (that.isAlwaysShowSlotContent) {
                return true;
            } else {
                return that.innerPicked === that.options.value;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.fl-radio-wrap {
    display: flex;
    align-items: center;
    margin-bottom: 0px;
    .fl-radio-label {
        display: block;
        position: relative;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        height: 16px;
        width: 16px;
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
            height: 16px;
            width: 16px;
            background: #ffffff;
            border: 1px solid #d9d9d9;
            border-radius: 100%;
        }
        /* On mouse-over, add a grey background color */
        /*
        &:hover input ~ .checkmark {
            background-color: #ccc;
        }
        */
        /* When the checkbox is checked, add a blue background */
        input:checked ~ .checkmark {
            background-color: rgba(215, 233, 250, 0.6);
        }

        input:disabled ~ .checkmark {
            background: #f5f5f5;
            &:after {
                background-color: #f5f5f5;
            }
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
            width: 10px;
            height: 10px;
            transform: translate(-50%, -50%);
            border-radius: 100%;
            background-color: #1484e5;
        }
    }
    span.fl-radio-msg {
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 16px;
        color: #333333;
        margin-left: 12px;
        cursor: pointer;
        white-space: nowrap;
    }
    .fl-radio-slot {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding-left: 8px;
        cursor: pointer;
    }
}
</style>
