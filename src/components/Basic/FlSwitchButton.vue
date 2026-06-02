<template>
    <div class="fl-switch-wrapper">
        <div class="fl-switch">
            <template v-for="(icon, index) in iconList" :key="icon">
                <div class="fl-switch-icon" :class="icon.isActive ? 'active' : ''" @click="doClick(icon)">
                    <i :class="icon.class"></i>
                </div>
                <div v-if="index != icons.length - 1" class="fl-switch-line" />
            </template>
        </div>
    </div>
</template>
<script>
const iconDefaultSetting = {
    class: '',
    triggerId: '',
    isActive: false,
};
export default {
    name: 'FlSwitchButton',
    props: {
        icons: {
            type: Array,
            default: [],
        },
    },
    data() {
        const that = this;
        return {
            iconList: that.icons,
        };
    },
    created() {
        const that = this;
        that.iconList.forEach((icon) => {
            icon = { ...iconDefaultSetting, ...icon };
        });
        const hasActiveLength = that.iconList.filter((icon) => {
            return icon.isActive === true;
        }).length;
        if (that.iconList[0] && hasActiveLength === 0) {
            that.iconList[0].isActive = true;
        }
    },
    emits: ['click'],
    methods: {
        doClick(icon) {
            const that = this;
            that.iconList.forEach((iconObj) => {
                iconObj.isActive = false;
            });
            icon.isActive = true;
            that.$emit('click', icon.triggerId);
        },
    },
};
</script>
<style lang="scss" scoped>
.fl-switch {
    display: flex;
    height: 36px;
    width: fit-content;
    border: 1px solid #6E5FAF;
    box-sizing: border-box;
    border-radius: 4px;
    .fl-switch-icon {
        width: 35px;
        text-align: center;
        line-height: 26px;
        position: relative;
        color: #6E5FAF;
        cursor: pointer;
        &.active {
            background-color: #6E5FAF;
            color: #fff;
        }
        i {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
    .fl-switch-line {
        position: relative;
        width: 1px;
        height: 34px;
        background: rgba(196, 196, 196, 0.5);
        flex: none;
        flex-grow: 0;
    }
}
</style>
