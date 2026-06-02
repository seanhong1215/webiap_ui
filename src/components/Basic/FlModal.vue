<template>
    <transition name="fade">
        <div class="fl-modal" v-if="showModal" :style="cssFactors">
            <div class="fl-modal-backdrop" @click="enableBackDropClickHide ? hide() : ''" />
            <div class="fl-modal-container" :style="containerWidth" ref="elContainer">
                <div class="fl-modal-header" ref="elHeader">
                    <div class="fl-modal-header-title">
                        {{ header }}
                    </div>
                    <div class="fl-modal-header-close" @click="hide">
                        <i class="fal fa-times"></i>
                    </div>
                </div>
                <div class="fl-modal-body" ref="elBody">
                    <div class="fl-modal-content-wrapper" ref="elContent">
                        <div class="fl-modal-content" :class="isFillHeight ? 'fill-in' : ''">
                            <slot name="body" :contentData="contentData" :events="{ updateConfirmStatus, updateContentData, onContentRendered }"> default body </slot>
                        </div>
                        <div class="fl-modal-footer" ref="elFooter">
                            <fl-button class="fl-modal-footer-button" type="abort" :text="$t('common.abort')" @click="hide" />
                            <fl-button type="confirm" :text="$t('common.confirm')" @click="submit" :disabled="confirmBtnDisable" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import { nextTick } from '@vue/runtime-core';
import FlButton from '../Basic/FlButton.vue';
export default {
    name: 'FlModal',
    components: { FlButton },
    props: {
        header: {
            type: String,
            default: 'Header Title Text',
        },
        width: {
            type: String,
            default: '',
        },
        enableBackDropClickHide: {
            type: Boolean,
            default: false,
        },
        disableConfrimBtnBeforeCustomCheck: {
            type: Boolean,
            default: false,
        },
        isFillHeight: {
            type: Boolean,
            default: false,
        },
        isContentRenderedByEvent: {
            type: Boolean,
            default: false,
        }
    },
    emits: ['onModalHide', 'onModalSubmit'],
    data() {
        return {
            showModal: false,
            contentData: {},
            isValidToConfirm: false,
            headerHeight: '',
            bodyPaddingHeight: '',
            bodyContentPaddingHeight: '',
            footerHeight: '',
            containerTransferX: '-50%',
            containerTransferY: '-50%',
        };
    },
    created() {
        window.addEventListener('resize', this.doContainerTransformFactorsCalculate);
    },
    unmounted() {
        window.removeEventListener('resize', this.doContainerTransformFactorsCalculate);
    },
    methods: {
        show() {
            const that = this;
            that.showModal = true;
            nextTick(() => {
                document.body.classList.add('fl-modal-show');
            });
            if (!that.isContentRenderedByEvent) {
                that.onContentRendered();
            }
        },
        hide() {
            const that = this;
            that.contentData = {};
            that.$emit('onModalHide', that);
            that.showModal = false;
            document.body.classList.remove('fl-modal-show');
        },
        submit() {
            const that = this;
            that.$emit('onModalSubmit', that, that.contentData);
        },
        updateConfirmStatus(isValid) {
            const that = this;
            that.isValidToConfirm = isValid;
        },
        updateContentData(data) {
            const that = this;
            that.contentData = data;
        },
        onContentRendered() {
            const that = this;
            nextTick(() => {
                that.doContentHeightFactorsCalculate();
                nextTick(() => {
                    that.doContainerTransformFactorsCalculate();
                });
            });
        },
        doContentHeightFactorsCalculate() {
            const that = this;
            const _computePaddingHeight = (style) => {
                const topPx = style.paddingTop;
                const bottomPx = style.paddingBottom;
                const top = Number(topPx.substring(0, topPx.indexOf('px')));
                const bottom = Number(bottomPx.substring(0, bottomPx.indexOf('px')));
                return `${top + bottom}px`;
            };
            const headerComputedStyle = getComputedStyle(that.$refs.elHeader);
            const bodyComputedStyle = getComputedStyle(that.$refs.elBody);
            const contentComputedStyle = getComputedStyle(that.$refs.elContent);
            const footerComputedStyle = getComputedStyle(that.$refs.elFooter);
            that.headerHeight = headerComputedStyle.height;
            that.bodyPaddingHeight = _computePaddingHeight(bodyComputedStyle);
            that.bodyContentPaddingHeight = _computePaddingHeight(contentComputedStyle);
            that.footerHeight = footerComputedStyle.height;
        },
        doContainerTransformFactorsCalculate() {
            const that = this;
            if (that.$refs.elContainer) {
                const containerComputedStyle = getComputedStyle(that.$refs.elContainer);
                let height = containerComputedStyle.height;
                let width = containerComputedStyle.width;
                height = Number(height.substring(0, height.indexOf('px')));
                width = Number(width.substring(0, width.indexOf('px')));
                height = Math.ceil(height / 2);
                width = Math.ceil(width / 2);
                that.containerTransferX = `-${width}px`;
                that.containerTransferY = `-${height}px`;
            }
        },
    },
    computed: {
        containerWidth() {
            const that = this;
            if (that.width !== '') {
                return { width: that.width };
            }
            return {};
        },
        confirmBtnDisable() {
            const that = this;
            console.log('confirmBtnDisable++');
            if (that.disableConfrimBtnBeforeCustomCheck) {
                return !that.isValidToConfirm;
            } else {
                return false;
            }
        },
        cssFactors() {
            const that = this;
            return {
                '--headerHeight': that.headerHeight,
                '--bodyPaddingHeight': that.bodyPaddingHeight,
                '--bodyContentPaddingHeight': that.bodyContentPaddingHeight,
                '--footerHeight': that.footerHeight,
                '--containerTransferX': that.containerTransferX,
                '--containerTransferY': that.containerTransferY,
            };
        },
    },
};
</script>
<style>
body.fl-modal-show {
    overflow: hidden;
}
</style>
<style lang="scss" scoped>
.fl-modal {
    z-index: 999;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    .fl-modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(51, 51, 51, 0.3);
    }
    .fl-modal-container {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(var(--containerTransferX), var(--containerTransferY));
        width: 80%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
        transition: all 0.3s ease;
        background: #f7f7f7;
        border-radius: 16px;
        overflow: hidden;
        max-height: 95vh;
        .fl-modal-header {
            height: 60px;
            background: #ffffff;
            box-shadow: 0px 1px 1px #ececec;
            display: flex;
            align-items: center;
            position: relative;
            .fl-modal-header-title {
                position: absolute;
                left: 0;
                right: 0;
                text-align: center;
                font-style: normal;
                font-weight: 500;
                font-size: 20px;
                color: #333333;
            }
            .fl-modal-header-close {
                position: absolute;
                display: flex;
                cursor: pointer;
                align-items: center;
                justify-content: center;
                right: 35.16px;
                text-align: center;
                top: 50%;
                transform: translate(0, -50%);
                font-size: 20px;
            }
        }
        .fl-modal-body {
            padding: 20px;
            background: #f7f7f7;
            .fl-modal-content-wrapper {
                padding: 20px;
                border-radius: 4px;
                background: #ffffff;
                box-shadow: 0px 0px 4px rgba(51, 51, 51, 0.08);
                .fl-modal-content {
                    max-height: 70vh;
                    overflow: auto;
                    &.fill-in {
                        height: calc(90vh - var(--headerHeight) - var(--bodyPaddingHeight) - var(--bodyContentPaddingHeight) - var(--footerHeight));
                    }
                }
                .fl-modal-footer {
                    padding-top: 20px;
                    display: flex;
                    justify-content: center;
                    .fl-modal-footer-button {
                        margin-right: 30px;
                    }
                }
            }
        }
    }
}
@media only screen and (max-height: 700px) {
    .fl-modal {
        .fl-modal-container {
            max-height: 100vh;
            .fl-modal-body {
                .fl-modal-content-wrapper {
                    position: relative;
                    .fl-modal-content {
                        max-height: 60vh;
                        &.fill-in {
                            height: calc(98vh - var(--headerHeight) - var(--bodyPaddingHeight) - var(--bodyContentPaddingHeight) - var(--footerHeight));
                        }
                    }
                }
            }
        }
    }
}
@media only screen and (max-height: 499px) {
    .fl-modal {
        display: none;
    }
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
