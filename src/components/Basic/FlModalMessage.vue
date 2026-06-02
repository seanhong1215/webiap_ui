<template>
    <transition name="fade">
        <div class="fl-modal" v-if="showModal">
            <div class="fl-modal-backdrop" />
            <div :class="`fl-modal-container ${lg ? 'lg' : ''}`" :style="containerWidth">
                <div class="fl-modal-bg">
                    <div class="fl-modal-header">
                        <div class="fl-modal-header-close" @click="hide">
                            <i class="fas fa-times"></i>
                        </div>
                    </div>
                    <div class="fl-modal-body">
                        <div class="fl-modal-content-wrapper">
                            <div class="fl-modal-content">
                                <div>
                                    <img :src="`${publicPath}img/modal/${type}.svg`" />
                                </div>
                                <div v-if="type === 'dialog'" class="dialog-title">{{ dialogTitle }}</div>
                                <div :class="`${type}-message`">
                                    {{ message }}
                                </div>
                            </div>
                            <div class="fl-modal-footer">
                                <FlButton v-if="type === 'dialog'" type="confirm" :text="$t('common.ok')" @click="hide" />
                                <template v-else>
                                    <FlButton class="fl-modal-footer-button" type="abort" :text="$t('common.abort')" @click="hide" />
                                    <FlButton type="confirm" :text="$t('common.confirm')" @click="submit" />
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import FlButton from '../Basic/FlButton.vue';
export default {
    name: 'FlModalMessage',
    components: { FlButton },
    props: {
        type: {
            type: String,
            default: 'confirm',
        },
        dialogTitle: {
            type: String,
            default: '',
        },
        message: {
            type: String,
            default: '',
        },
        width: {
            type: String,
            default: '',
        },
        lg: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['onModalSubmit', 'onModalHide'],
    data() {
        return {
            showModal: false,
            publicPath: process.env.BASE_URL,
        };
    },
    methods: {
        show() {
            this.showModal = true;
        },
        hide() {
            const that = this;
            that.showModal = false;
            that.contentData = {};
            that.$emit('onModalHide', that);
        },
        submit() {
            const that = this;
            that.$emit('onModalSubmit', that);
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
    },
};
</script>
<style lang="scss" scoped>
.fl-modal {
    z-index: 9998;
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
        transform: translate(-50%, -50%);
        width: 360px;
        transition: all 0.3s ease;
        background: linear-gradient(227.39deg, #ffffff 0%, rgba(255, 255, 255, 0.3) 102.24%);
        backdrop-filter: blur(50px);
        border-radius: 8px;
        border: solid 2px rgba(255, 255, 255, 0.7);
        overflow: hidden;
        max-height: 95vh;
        &.lg {
            width: 504px;
        }
        .fl-modal-bg {
            background: linear-gradient(227.39deg, #ffffff 0%, rgba(255, 255, 255, 0.3) 102.24%);
            border-radius: 8px;
            .fl-modal-header {
                height: 32px;
                position: relative;
                .fl-modal-header-close {
                    position: absolute;
                    display: flex;
                    cursor: pointer;
                    align-items: center;
                    justify-content: center;
                    top: 16.44px;
                    right: 16.48px;
                    text-align: center;
                    font-size: 20px;
                }
            }
            .fl-modal-body {
                text-align: center;
                padding: 0 36px 24px 36px;
                .fl-modal-content-wrapper {
                    .fl-modal-content {
                        max-height: 70vh;
                        overflow: auto;
                        .dialog-title {
                            font-weight: 500;
                            font-size: 18px;
                            line-height: 30px;
                            color: rgba(39, 174, 96, 0.87);
                            margin-bottom: 9px;
                        }
                        .dialog-message {
                            font-weight: normal;
                            font-size: 16px;
                            line-height: 140%;
                            color: rgba(51, 51, 51, 0.87);
                        }
                        .confirm-message {
                            font-weight: 500;
                            font-size: 18px;
                            line-height: 24px;
                            color: rgba(100, 87, 76, 0.87);
                        }
                    }
                    .fl-modal-footer {
                        margin-top: 20px;
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
