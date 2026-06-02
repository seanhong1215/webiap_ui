<template>
    <div class="fl-label-wrapper" :class="{ 'fl-menu': isMenu }">
        <i v-if="iconClass !== ''" :class="iconClass" />
        <span class="fl-label" :class="labelClass">{{ text }}</span>
    </div>
</template>
<script>
export default {
    name: 'FlLabel',
    props: {
        iconClass: {
            type: String,
            default: '',
        },
        text: {
            type: String,
            default: 'Show Lable Information',
        },
        labelClass: {
            type: String,
            default: '',
        },
        isMenu: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
<style lang="scss" scoped>
.fl-label-wrapper {
    font-weight: 500;
    font-size: 16px;
    color: #5c6466;
    i {
        margin-left: 8px;
        margin-right: 8px;
    }
}
.fl-menu {
    &:hover {
        transition: 0.3s;
        color: #fff;
    }
    &:active {
        transition: 0.3s;
    }
}
</style>
