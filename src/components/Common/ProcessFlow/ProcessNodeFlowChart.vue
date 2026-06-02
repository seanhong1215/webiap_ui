<template>
    <div class="process-bundle-wrapper start-node">
        <span>{{ $t('common.start') }}</span>
        <div class="flow-arrow">
            <div class="arrow-head"></div>
        </div>
    </div>
    <template v-for="node of nodeList" :key="node">
        <process-node :type="node.type" :rowList="node.rowList" :step="node.step" :title="node.title" :simulate="simulate" />
    </template>
    <div class="process-bundle-wrapper end-node">
        <span>{{ $t('common.end') }}</span>
    </div>
</template>
<script>
import ProcessNode from '@/components/Common/ProcessFlow/ProcessNode.vue';
export default {
    name: 'ProcessNodeFlowChart',
    components: { ProcessNode },
    props: {
        nodeList: {
            type: Array,
            default: () => {
                return [];
            },
        },
        simulate: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            columnDefs: [],
            tdSlots: [],
            tdTemplates: {},
        };
    },
};
</script>
<style lang="scss" scoped>
.process-bundle-wrapper {
    margin-bottom: 34px;
    padding: 8px 28px;
    position: relative;
    background: #595fb7;
    border: 1px solid #595fb7;
    box-sizing: border-box;
    box-shadow: 0px 4px 0px #4e5289;
    border-radius: 16px;
    width: 124px;
    height: 48px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    span {
        font-weight: 500;
        font-size: 17px;
        color: #ffffff;
    }
    .flow-arrow {
        position: absolute;
        bottom: -34px;
        left: calc(50% - 1px);
        height: 34px;
        border-left: 1px solid #595fb7;
        .arrow-head {
            border-right: 4px solid white;
            border-left: 4px solid white;
            border-top: 10px solid #595fb7;
            position: absolute;
            bottom: -1px;
            left: -4px;
        }
    }
}
</style>
