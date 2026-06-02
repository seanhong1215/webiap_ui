<template>
    <div class="process-node-wrapper">
        <div class="step-title">
            <span class="step">Step {{ step }}.</span><span class="title">{{ title }}</span>
        </div>
        <fl-table :columnDefs="columnDefs" :rowList="rowList" class="process-node-table">
            <template v-for="tdSlot in tdSlots" v-slot:[tdSlot.slotName]="{ columnData, rowData }" :key="tdSlot.slotName">
                <component v-bind:is="tdTemplates[tdSlot.componentName]" :tdData="columnData" :rowData="rowData"></component>
            </template>
        </fl-table>
        <div class="flow-arrow">
            <div class="arrow-head"></div>
        </div>
    </div>
</template>
<script>
import nodeConfig from '@/components/Common/ProcessFlow/NodeMap.js';
import FlTable from '@/components/Basic/FlTable.vue';
export default {
    name: 'ProcessNode',
    components: { FlTable },
    props: {
        type: {
            type: String,
            default: 'sign', // root, sign, patternassign, roleassign, itemassign, csign; *notice: root type is only for simulate mode use.
        },
        rowList: {
            type: Array,
            default: () => {
                return [];
            },
        },
        step: {
            type: Number,
            default: 1,
        },
        title: {
            type: String,
            default: '',
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
            nodeConfig: {},
        };
    },
    created() {
        const that = this;
        const tmpConfig = nodeConfig(that.type, that.simulate, that);
        if (tmpConfig) {
            that.nodeConfig = tmpConfig;
            that.columnDefs = that.nodeConfig.columnDefs;
            that.tdSlots = that.nodeConfig.tdSlots(that.rowList);
            that.tdTemplates = that.nodeConfig.tdTemplates;
        }
    },
};
</script>
<style lang="scss" scoped>
.process-node-wrapper {
    margin-top: 6px;
    margin-bottom: 34px;
    padding: 16px;
    position: relative;
    background: #ffffff;
    border: 1px solid #c4c4c4;
    box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    .step-title {
        position: absolute;
        top: -5px;
        left: 22px;
        padding-left: 4px;
        padding-right: 4px;
        background: #ffffff;
        font-weight: 600;
        font-size: 14px;
        line-height: 12px;
        .step {
            color: #595fb7;
            font-size: 14px;
            margin-right: 4px;
        }
        .title {
            color: #262a2b;
            font-size: 16px;
        }
    }
    :deep(table.process-node-table) {
        thead {
            color: #5c6466;
            background-color: #efeff8;
            th {
                &:nth-child(1) {
                    border-top-left-radius: 8px;
                }
                &:nth-last-child(1) {
                    border-top-right-radius: 8px;
                }
            }
        }
        tbody {
            tr {
                td {
                    border-bottom: 0px;
                    &.template-row {
                        position: relative;
                    }
                    color: #262a2b;
                }
                & + tr {
                    td {
                        border-top: 1px solid rgba(196, 196, 196, 0.5);
                    }
                }
            }
        }
        .simulate-checked {
            color: #65bf73;
            font-size: 16px;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
        }
        .sign-dep,
        .sign-name-pass,
        .sign-name-fail {
            color: #919191;
            font-size: 12px;
            line-height: 20px;
        }
        .sign-name {
            font-size: 12px;
        }
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
