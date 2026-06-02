<template>
    <div v-if="loadFinish" class="loadFinish">
        loadFinish
    </div>
    <div class="proc-review">
        <div class="proc-tabs">
            <div class="tab-state-wrapper" v-for="(state, index) in stateList" :key="state">
                <div class="state-title" @click="toggleState(index)">
                    <span class="state-name">{{ state.name }}：</span><span class="state-pattern">{{ state.pattern }}</span>
                </div>
                <div class="state-body" :ref="setItemRef">
                    <process-node-flow-chart :nodeList="state.nodeList" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import ProcessNodeFlowChart from '@/components/Common/ProcessFlow/ProcessNodeFlowChart.vue';
import { apiRulePattern } from '@/utils/api';
import { flowNodeList } from '@/utils/flowNodeList';
export default {
    components: {
        ProcessNodeFlowChart,
    },
    data() {
        return {
            proId: '',
            stateList: [],
            itemRefs: [],
            loadFinish: false,
        };
    },
    methods: {
        ...mapActions('process', ['getMfpManagerByProId']),
        getProcess(proId) {
            const that = this;
            console.log(proId);
        },
        toggleState(index) {
            const that = this;
            that.itemRefs[index].parentNode.classList.toggle('shrink-up');
            that.itemRefs[index].classList.toggle('shrink-up');
        },
        setItemRef(el) {
            const that = this;
            if (el) {
                that.itemRefs.push(el);
            }
        },
    },
    computed: {
        ...mapState('process', ['flow', 'specMfp']),
        ...mapGetters('process', ['getProcessByProId', 'getSpecMfpPanel']),
    },
    created() {
        const that = this;
        that.proId = this.$route.query.proid || that.$store?.state?.process?.selectedProId || '';
        that.getMfpManagerByProId(that.proId).then(async () => {
            try {
                const process = that.specMfp.process;
                const subProcessList = process?.subProcessList || [];
                const firstProcess = subProcessList[0];
                const mfpProcessList = firstProcess?.extCond || [];
                const statePromises = mfpProcessList.map(async (item, index) => {
                    const mfpId = firstProcess.toLinkList?.[index]?.toProcessID;
                    const artState = item.artStateList[0];
                    const nodeList = mfpId ? flowNodeList([]) : [];
                    return { name: artState.name, pattern: artState.condition, nodeList };
                });
                that.stateList = await Promise.all(statePromises);
            } catch (err) {
                console.log('ProcessFlowView created error:', err);
            }
            that.loadFinish = true;
        });
    },
};
</script>
<style lang="scss" scoped>
.btn-router-back {
    margin-left: 10px;
}
.proc-info-panel {
    margin-top: 12px;
}
.proc-review {
    .proc-tabs {
        margin-top: 24px;
        .ant-tabs-nav .ant-tabs-tab:hover {
            background: #f5f5f5;
            color: rgba(51, 51, 51, 0.87);
        }
        .tab-state-wrapper {
            background: linear-gradient(0deg, rgba(237, 246, 255, 0.3), rgba(237, 246, 255, 0.3)), #ffffff;
            box-shadow: 0px 4px 8px rgba(0, 36, 179, 0.08);
            border-radius: 8px;
            //height: 640px;
            transition: height 0.5s;
            &.shrink-up {
                height: 41px;
            }
            & + .tab-state-wrapper {
                margin-top: 16px;
            }
            .state-title {
                background: #e6f1ff;
                text-align: center;
                font-size: 16px;
                line-height: 125%;
                border-bottom: 1px dashed #77838e;
                padding-top: 10px;
                padding-bottom: 10px;
                border-top-right-radius: 8px;
                border-top-left-radius: 8px;
                cursor: pointer;
                .state-name {
                    font-weight: 500;
                    color: #333333;
                }
                .state-pattern {
                    color: #77838e;
                }
            }
            .state-body {
                overflow-y: auto;
                padding: 32.79px 152px;
                height: calc(100% - 50px);
                transition: padding 0.2s;
                &.shrink-up {
                    padding: 0;
                }
            }
        }
        .tab-spec-desc-wrapper {
            background: #ffffff;
            border-radius: 16px;
            padding: 20px;
            :deep(table.tab-spec-desc) {
                border: 1px solid rgba(196, 196, 196, 0.5);
                border-radius: 4px;
                text-align: left;
                thead {
                    background: #e6f1ff;
                    tr {
                        th {
                            padding-top: 4px;
                            padding-bottom: 4px;
                            padding-left: 16px;
                            box-shadow: 0px 2px 0px rgba(196, 196, 196, 0.5);
                            border-bottom: 1px solid rgba(196, 196, 196, 0.5);
                            font-weight: 600;
                            font-size: 14px;
                            line-height: 22px;
                            & + th {
                                border-left: 1px solid rgba(196, 196, 196, 0.5);
                            }
                        }
                    }
                }
                tbody {
                    tr {
                        td {
                            padding-top: 5px;
                            padding-bottom: 5px;
                            padding-left: 16px;
                            font-size: 14px;
                            line-height: 22px;
                            & + td {
                                border-left: 1px solid rgba(196, 196, 196, 0.5);
                            }
                        }
                        &:nth-last-child(1) {
                            td {
                                border-bottom: 0;
                                &:nth-child(1) {
                                    border-bottom-left-radius: 4px;
                                }
                                &:nth-last-child(1) {
                                    border-bottom-right-radius: 4px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
