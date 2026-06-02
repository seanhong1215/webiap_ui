<template>
    <div class="fl-panel">
        <div class="fl-panel-container" :style="containerStyle">
            <div class="fl-panel-header" :style="headerStyle">
                <slot name="header" :headerData="headerData"> default header </slot>
            </div>
            <div class="fl-panel-body">
                <slot name="body" :contentData="contentData"> default body </slot>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'FlPanel',
    props: {
        containerStyle: {
            type: Object,
        },
        headerStyle: {
            type: Object,
        },
    },
    data() {
        return {
            headerData: {},
            contentData: {},
        };
    },
    methods: {},
    computed: {},
};
</script>
<style lang="scss" scoped>
.fl-panel-container {
    background: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 36, 179, 0.16);
    border-radius: 8px;
    min-height: 300px;
    margin-top: 15px;
    .fl-panel-header {
        display: flex;
        flex-wrap: wrap;

        padding: 16px;
        background: #e6f1ff;
        border-radius: 8px 8px 0px 0px;
        height: 64px;
    }
}
</style>
