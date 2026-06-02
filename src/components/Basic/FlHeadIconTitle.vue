<template>
    <div class="head-title-wrapper">
        <div class="icon-wrapper" :style="iconWrapperWidth">
            <div class="center" ref="iconTitle">
                <i :class="iconClass" />
            </div>
        </div>
        <div class="head-text-wrapper" v-html="headerTitle"></div>
    </div>
</template>
<script>
export default {
    name: 'FlHeadIconTitle',
    props: {
        iconClass: {
            type: String,
            default: 'fas fa-th-large',
        },
        iconWidth: {
            type: Number,
            default: 19,
        },
        text: {
            type: String,
            default: '',
        },
        headerTagNumber: {
            type: Number,
            default: 1,
        },
    },
    computed: {
        headerTitle() {
            const that = this;
            return `<h${that.headerTagNumber} style="margin: 0;">${that.text}</h${that.headerTagNumber}>`;
        },
        iconWrapperWidth() {
            const that = this;
            return `width: ${that.iconWidth}px`;
        },
    },
};
</script>
<style lang="scss" scoped>
$primary-color: #6e5faf;
div.head-title-wrapper {
    display: flex;
    div.icon-wrapper {
        position: relative;
        div.center {
            color: $primary-color;
            margin: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            -ms-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            i {
                font-size: 1.5rem;
            }
        }
    }
    div.head-text-wrapper {
        margin-left: 12px;
        :deep(h4) {
            font-size: 20px;
        }
    }
}
</style>
