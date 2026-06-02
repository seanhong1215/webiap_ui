<template>
    <div>
        <div ref="popper" class="popper" v-show="!disabled && showPopper">
            <div>
                <input class="duration-value" type="number" :min="isPositive ? 0 : ''" v-model.number="days" />
                <span>{{ $t('duration.day') }}</span>
            </div>
            <div>
                <input class="duration-value" type="number" :min="isPositive ? 0 : ''" v-model.number="hours" />
                <span>{{ $t('duration.hour') }}</span>
            </div>
            <div>
                <input class="duration-value" type="number" :min="isPositive ? 0 : ''" v-model.number="minutes" />
                <span>{{ $t('duration.minute') }}</span>
            </div>
        </div>
        <div ref="reference" class="duration-picker">
            <span class="duration-icon" :class="iconName"></span>
            <div class="duration-content">
                <input type="text" :placeholder="$t('duration.placeholder.chooseTime')" v-model="durationContent" disabled />
                <div class="fuck-ff-dummy" v-if="$browserDectect().isFirefox" />
            </div>
        </div>
    </div>
</template>
<script>
import Popper from 'popper.js';
import global from '@/utils/global';
function on(element, event, handler) {
    if (element && event && handler) {
        document.addEventListener ? element.addEventListener(event, handler, false) : element.attachEvent('on' + event, handler);
    }
}
function off(element, event, handler) {
    if (element && event) {
        document.removeEventListener ? element.removeEventListener(event, handler, false) : element.detachEvent('on' + event, handler);
    }
}
export default {
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        forceShow: {
            type: Boolean,
            default: false,
        },
        dataValue: {
            type: Array,
            default: [0, 0, 0],
        },
        appendToBody: {
            type: Boolean,
            default: false,
        },
        visibleArrow: {
            type: Boolean,
            default: true,
        },
        days: {
            type: Number,
            default: 0,
        },
        hours: {
            type: Number,
            default: 0,
        },
        minutes: {
            type: Number,
            default: 0,
        },
        isPositive: {
            type: Boolean,
            default: false,
        },
        iconName: {
            type: String,
            default: 'fal fa-clock',
        },
    },
    emits: ['show', 'hide', 'documentClick', 'updateTime'],
    data() {
        return {
            referenceElm: null,
            popperJS: null,
            showPopper: false,
            currentPlacement: '',
            popperOptions: {
                placement: 'bottom',
                computeStyle: {
                    gpuAcceleration: false,
                },
            },
            innerDays: this.days,
            innerHours: this.hours,
            innerMinutes: this.minutes,
        };
    },
    watch: {
        showPopper(value) {
            if (value) {
                this.$emit('show', this);
                if (this.popperJS) {
                    this.popperJS.enableEventListeners();
                }
                this.updatePopper();
            } else {
                if (this.popperJS) {
                    this.popperJS.disableEventListeners();
                }
                this.$emit('hide', this);
            }
        },
        forceShow: {
            handler(value) {
                this[value ? 'doShow' : 'doClose']();
            },
            immediate: true,
        },
        disabled(value) {
            if (value) {
                this.showPopper = false;
            }
        },
        days(value) {
            this.innerDays = value;
            this.timeConvert();
            this.$emit('updateTime', [this.innerDays, this.innerHours, this.innerMinutes]);
        },
        hours(value) {
            this.innerHours = value;
            this.timeConvert();
            this.$emit('updateTime', [this.innerDays, this.innerHours, this.innerMinutes]);
        },
        minutes(value) {
            this.innerMinutes = value;
            this.timeConvert();
            this.$emit('updateTime', [this.innerDays, this.innerHours, this.innerMinutes]);
        },
    },
    created() {
        this.appendedArrow = false;
        this.appendedToBody = false;
    },
    mounted() {
        this.referenceElm = this.reference || this.$refs.reference;
        this.popper = this.$refs.popper;
        on(this.referenceElm, 'click', this.doToggle);
        on(document, 'click', this.handleDocumentClick);
    },
    computed: {
        durationContent: {
            get() {
                let returnValue = '';
                if (this.innerDays !== 0 || this.innerHours !== 0 || this.innerMinutes !== 0) {
                    returnValue = `${this.innerDays} ${this.$t('duration.day')} ${this.innerHours} ${this.$t('duration.hour')} ${this.innerMinutes} ${this.$t('duration.minute')} `;
                }
                return returnValue;
            },
            set(value) {},
        },
    },
    methods: {
        timeConvert() {
            const time = this.innerDays * 24 * 60 + this.innerHours * 60 + this.innerMinutes;
            const timeObj = global.convertMinuteToDuration(time);
            this.innerDays = timeObj.days;
            this.innerHours = timeObj.hours;
            this.innerMinutes = timeObj.minutes;
        },
        doToggle(event) {
            if (this.stopPropagation) {
                event.stopPropagation();
            }
            if (this.preventDefault) {
                event.preventDefault();
            }
            if (!this.forceShow) {
                this.showPopper = !this.showPopper;
            }
        },
        doClose() {
            this.showPopper = false;
        },
        doDestroy() {
            if (this.showPopper) {
                return;
            }
            if (this.popperJS) {
                this.popperJS.destroy();
                this.popperJS = null;
            }
            if (this.appendedToBody) {
                this.appendedToBody = false;
                document.body.removeChild(this.popper.parentElement);
            }
        },
        createPopper() {
            this.$nextTick(() => {
                if (this.visibleArrow) {
                    this.appendArrow(this.popper);
                }
                if (this.appendToBody && !this.appendedToBody) {
                    this.appendedToBody = true;
                    document.body.appendChild(this.popper.parentElement);
                }
                if (this.popperJS && this.popperJS.destroy) {
                    this.popperJS.destroy();
                }
                this.popperOptions.onCreate = () => {
                    // this.$emit('created', this);
                    this.$nextTick(this.updatePopper);
                };
                this.popperJS = new Popper(this.referenceElm, this.popper, this.popperOptions);
            });
        },
        destroyPopper() {
            off(this.referenceElm, 'click', this.doToggle);
            off(document, 'click', this.handleDocumentClick);
            this.showPopper = false;
            this.doDestroy();
        },
        appendArrow(element) {
            if (this.appendedArrow) {
                return;
            }
            this.appendedArrow = true;
            const arrow = document.createElement('div');
            arrow.setAttribute('x-arrow', '');
            arrow.className = 'popper__arrow';
            element.appendChild(arrow);
        },
        updatePopper() {
            this.popperJS ? this.popperJS.scheduleUpdate() : this.createPopper();
        },
        handleDocumentClick(e) {
            if (
                !this.$el ||
                !this.referenceElm ||
                this.elementContains(this.$el, e.target) ||
                this.elementContains(this.referenceElm, e.target) ||
                !this.popper ||
                this.elementContains(this.popper, e.target)
            ) {
                return;
            }
            this.$emit('documentClick', this);
            if (this.forceShow) {
                return;
            }
            this.showPopper = false;
        },
        elementContains(elm, otherElm) {
            if (typeof elm.contains === 'function') {
                return elm.contains(otherElm);
            }
            return false;
        },
    },
};
</script>
<style lang="scss" scoped>
.duration-value {
    height: 32px;
    margin: 10px 10px 10px 50px;
    border: 1px solid #dadce0;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 2px 8px;
    color: rgba(51, 51, 51, 0.87);
    &:focus-visible {
        outline: none;
        border: 1px solid #1890ff;
        box-shadow: 0px 0px 0px 2px rgba(24, 144, 255, 0.2);
    }
    + span {
        margin-right: 50px;
    }
}
.duration-picker {
    display: flex;
    align-items: center;
    background: #ffffff;
    border: 1px solid #dadce0;
    box-sizing: border-box;
    box-shadow: 0px 2px 0px rgb(0 0 0 / 2%);
    border-radius: 4px;
    max-width: 220px;
    cursor: pointer;
    .duration-icon {
        margin-left: 10px;
        margin-right: 10px;
        width: 10%;
    }
    .duration-content {
        position: relative;
        padding: 5px 0px;
        width: 90%;
        input {
            margin-right: 10px;
            border: 0;
            background-color: #ffffff;
            cursor: pointer;
            width: 100%;
        }
        .fuck-ff-dummy {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
        }
    }
}
.popper {
    width: auto;
    background-color: #fafafa;
    color: #212121;
    text-align: center;
    padding: 2px;
    display: inline-block;
    border-radius: 3px;
    position: absolute;
    font-size: 14px;
    font-weight: normal;
    border: 1px #ebebeb solid;
    z-index: 200000;
    -moz-box-shadow: rgb(58, 58, 58) 0 0 6px 0;
    -webkit-box-shadow: rgb(58, 58, 58) 0 0 6px 0;
    box-shadow: rgb(58, 58, 58) 0 0 6px 0;
    :deep(.popper__arrow) {
        width: 0;
        height: 0;
        border-style: solid;
        position: absolute;
        margin: 5px;
    }
    > div {
        text-align: left;
    }
}
:deep(.popper[x-placement^='bottom']) {
    margin-top: 10px;
    background: #ffffff;
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    .popper__arrow {
        border-width: 0 10px 10px 10px;
        border-color: transparent transparent #ffffff transparent;
        top: -10px;
        left: calc(50% - 5px);
        margin-top: 0;
        margin-bottom: 0;
    }
}
:deep(.popper[x-placement^='top']) {
    margin-bottom: 10px;
    background: #ffffff;
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    .popper__arrow {
        border-width: 10px 10px 0 10px;
        border-color: #ffffff transparent transparent transparent;
        bottom: -10px;
        left: calc(50% - 5px);
        margin-top: 0;
        margin-bottom: 0;
    }
}
</style>
