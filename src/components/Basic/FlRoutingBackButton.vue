<template>
    <div>
        <FlButton :type="'icon'" :iconClass="'fas fa-arrow-left'" :buttonClass="'btn-back-to'" @click="goBack" />
        <span>{{ text }}</span>
    </div>
    <teleport to="#portal-target">
        <fl-modal-message ref="confirmModal" :message="$t('validator.notSaving')" @onModalSubmit="onModalSubmit" />
    </teleport>
</template>
<script>
import FlButton from './FlButton';
import FlModalMessage from './FlModalMessage';
export default {
    name: 'FlRoutingBackButton',
    components: { FlButton, FlModalMessage },
    props: {
        text: {
            type: String,
            default: 'Click To Back',
        },
        needConfirm: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            innerNeedConfirm: this.needConfirm,
        };
    },
    methods: {
        goBack() {
            const that = this;
            if (that.innerNeedConfirm) {
                that.$refs.confirmModal.show();
            } else {
                const breadcrumbs = that.$router.currentRoute._value.meta?.breadcrumbs;
                if (breadcrumbs && breadcrumbs.length >= 2) {
                    that.$router.push(breadcrumbs[breadcrumbs.length - 2].link);
                } else {
                    that.$router.go(-1);
                }
            }
        },
        onModalSubmit() {
            this.innerNeedConfirm = false;
            this.goBack();
        },
    },
    watch: {
        needConfirm: {
            immediate: true,
            handler() {
                const that = this;
                that.innerNeedConfirm = that.needConfirm;
            },
        },
    },
};
</script>
<style lang="scss" scoped>
.btn-back-to {
    background: rgba(255, 255, 255, 0.7) !important;
    border: 1px solid rgba(196, 196, 196, 0.5) !important;
    box-sizing: border-box !important;
    box-shadow: 80px 120px 100px rgba(0, 112, 209, 0.08) !important;
    backdrop-filter: blur(80px) !important;
}
span {
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 125%;
    margin-left: 12px;
}
</style>
