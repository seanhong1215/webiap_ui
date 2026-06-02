<template>
    <div class="proc-review">
        <fl-routing-back-button :text="title" class="btn-router-back" />
        <process-panel :process-info="getSpecMfpPanel" class="proc-info-panel" />
        <f-tabs class="proc-tabs">
            <!-- Tab 1: 表單預覽 -->
            <f-tab-pane key="1" :tab="$t('processReview.form')">
                <div class="mock-form-preview" v-if="formFields.length > 0">
                    <div class="mock-form-title">
                        <i class="fal fa-file-alt"></i>
                        {{ formTitle }}
                    </div>
                    <div class="mock-form-fields">
                        <div class="mock-form-field" v-for="field in formFields" :key="field.id">
                            <label class="field-label">{{ field.label }}</label>
                            <div class="field-input" :class="field.type">
                                <span class="field-type-hint">{{ field.typeName }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="mock-form-note">
                        <i class="fal fa-info-circle"></i> 此為表單欄位示意，實際表單由動態表單系統渲染
                    </div>
                </div>
                <div class="tab-state-empty" v-else>
                    <div>{{ $t('processReview.noFlowChart') }}</div>
                    <img :src="`${publicPath}img/background/workingBlock.png`" />
                </div>
            </f-tab-pane>

            <!-- Tab 2: 流程圖 -->
            <f-tab-pane key="2" :tab="$t('processReview.process')">
                <div class="tab-state-wrapper" v-for="(state, index) in stateList" :key="state.name + index">
                    <div class="state-title" @click="toggleState(index)">
                        <span class="state-name">{{ state.name }}：</span><span class="state-pattern">{{ state.pattern }}</span>
                    </div>
                    <div class="state-body" :ref="setItemRef">
                        <process-node-flow-chart :nodeList="state.nodeList" />
                    </div>
                </div>
                <div v-show="stateList.length == 0" class="tab-state-empty">
                    <div>{{ $t('processReview.noFlowChart') }}</div>
                    <img :src="`${publicPath}img/background/workingBlock.png`" />
                </div>
            </f-tab-pane>

            <!-- Tab 3: 規格 -->
            <f-tab-pane key="3" :tab="$t('processReview.spec')">
                <div class="tab-spec-desc-wrapper">
                    <fl-table :column-defs="tableOpts.columnDefs" :row-list="tableOpts.rowList" class="tab-spec-desc" />
                    <div class="spec-empty" v-if="tableOpts.rowList.length === 0">
                        <i class="fal fa-table"></i> 暫無規格資料
                    </div>
                </div>
            </f-tab-pane>

            <template #tabBarExtraContent>
                <f-button variant="primary-outline" @click="docDownload"><i class="fal fa-file-download"></i>{{ $t('processReview.download') }}</f-button>
            </template>
        </f-tabs>
    </div>
    <teleport to="#portal-target">
        <f-confirm v-model:visible="hintDialog" type="alert" variant="info" okText="好的">
            <template #content>
                <p>{{ $t('processReview.submitMessage.downloadNetworkError') }}</p>
            </template>
        </f-confirm>
    </teleport>
</template>
<script>
import FlButton from '@/components/Basic/FlButton.vue';
import FlRoutingBackButton from '@/components/Basic/FlRoutingBackButton.vue';
import ProcessPanel from '@/components/Common/ProcessPanel.vue';
import FlTable from '@/components/Basic/FlTable.vue';
import ProcessNodeFlowChart from '@/components/Common/ProcessFlow/ProcessNodeFlowChart.vue';
import { flowNodeList } from '@/utils/flowNodeList';
import { mapState, mapActions, mapGetters } from 'vuex';
import FlHeadIconTitle from '../components/Basic/FlHeadIconTitle.vue';

const FIELD_TYPE_MAP = {
    VARCHAR: { name: '文字', type: 'text' },
    NUMBER: { name: '數字', type: 'number' },
    DATE: { name: '日期', type: 'date' },
    BOOLEAN: { name: '布林', type: 'bool' },
};

export default {
    components: {
        FlButton,
        FlRoutingBackButton,
        ProcessPanel,
        FlTable,
        ProcessNodeFlowChart,
        FlHeadIconTitle,
    },
    data() {
        const that = this;
        return {
            publicPath: process.env.BASE_URL,
            title: that.$t('router.ProcessReview'),
            formTitle: '',
            formFields: [],
            tableOpts: {
                columnDefs: [
                    { title: 'System Id', dataKey: 'itemId' },
                    { title: 'Access Name', dataKey: 'name' },
                    { title: 'Type', dataKey: 'type' },
                    { title: 'Label', dataKey: 'label' },
                    { title: 'Description', dataKey: 'desc' },
                ],
                rowList: [],
            },
            stateList: [],
            itemRefs: [],
            hintDialog: false,
        };
    },
    created() {
        const that = this;
        let loader = this.$loading.show();
        const proId = that.selectedSpecProId;
        that.getMfpManagerByProId(proId).then(async (res) => {
            try {
                const artifact = res.data.data.artifact;
                const artFormItemList = artifact?.artFormItemList || [];

                // Tab 3: 規格表
                that.tableOpts.rowList = artFormItemList.map((data) => ({
                    itemId: data.id,
                    name: data.name,
                    type: data.dbtype || '',
                    label: data.properties?.labelText || data.name,
                    desc: data.synopsis || '',
                }));

                // Tab 1: mock 表單欄位預覽
                that.formTitle = res.data.data.process?.name || '申請單';
                that.formFields = artFormItemList.map((data) => {
                    const typeInfo = FIELD_TYPE_MAP[data.dbtype] || { name: data.dbtype, type: 'text' };
                    return {
                        id: data.id,
                        label: data.properties?.labelText || data.name,
                        typeName: typeInfo.name,
                        type: typeInfo.type,
                    };
                });

                // Tab 2: 流程狀態圖
                const subProcessList = res.data.data.process?.subProcessList || [];
                const firstProcess = subProcessList[0];
                const outProcessList = firstProcess?.outProcessList || [];

                const statePromises = outProcessList.map(async (item) => {
                    const artState = item.linkTerm?.artStateList?.[0];
                    if (!artState) return null;
                    return {
                        name: artState.name,
                        pattern: artState.condition || '',
                        nodeList: flowNodeList([]),
                    };
                });
                that.stateList = (await Promise.all(statePromises)).filter(Boolean);
            } catch (err) {
                console.log('ProcessReview created error:', err);
            }
            loader.hide();
        });
    },
    computed: {
        ...mapState('process', ['flow', 'selectedSpecProId']),
        ...mapGetters('process', ['getProcessByProId', 'getSpecMfpPanel']),
    },
    methods: {
        ...mapActions('process', ['getMfpManagerByProId']),
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
        docDownload() {
            this.hintDialog = true;
        },
    },
    beforeUpdate() {
        this.itemRefs = [];
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
        :deep(.ant-tabs-nav .ant-tabs-tab) {
            padding: 8px 16px;
        }
        :deep(.ant-tabs-nav .ant-tabs-tab-active) {
            color: #6e5faf;
        }

        // ── Tab 1: Mock Form Preview ──────────────────
        .mock-form-preview {
            background: #fff;
            border-radius: 12px;
            padding: 28px 32px;
            max-width: 720px;
            margin: 0 auto;

            .mock-form-title {
                font-size: 18px;
                font-weight: 700;
                color: #333;
                margin-bottom: 28px;
                display: flex;
                align-items: center;
                gap: 10px;
                padding-bottom: 16px;
                border-bottom: 2px solid #ede9f7;

                i {
                    color: #6e5faf;
                    font-size: 20px;
                }
            }

            .mock-form-fields {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 24px;
            }

            .mock-form-field {
                display: flex;
                flex-direction: column;
                gap: 6px;

                .field-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #555;
                }

                .field-input {
                    height: 38px;
                    border: 1.5px dashed #c9c2e8;
                    border-radius: 6px;
                    background: #faf9fd;
                    display: flex;
                    align-items: center;
                    padding: 0 12px;

                    .field-type-hint {
                        font-size: 12px;
                        color: #a99de0;
                    }
                }
            }

            .mock-form-note {
                font-size: 12px;
                color: #aaa;
                display: flex;
                align-items: center;
                gap: 5px;
                padding-top: 16px;
                border-top: 1px solid #f0eeff;
            }
        }

        // ── Tab 2: Flow States ────────────────────────
        .tab-state-wrapper {
            background: linear-gradient(0deg, rgba(237, 233, 247, 0.3), rgba(237, 233, 247, 0.3)), #ffffff;
            box-shadow: 0px 4px 8px rgba(72, 62, 114, 0.08);
            border-radius: 8px;
            height: 640px;
            transition: height 0.5s;
            &.shrink-up {
                height: 41px;
            }
            & + .tab-state-wrapper {
                margin-top: 16px;
            }
            .state-title {
                background: #efeff8;
                text-align: center;
                font-size: 16px;
                line-height: 125%;
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
                padding: 32px 120px;
                height: calc(100% - 50px);
                transition: padding 0.2s;
                &.shrink-up {
                    padding: 0;
                }
            }
        }

        .tab-state-empty {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            width: 100%;
            padding-top: 30px;
            gap: 12px;
            div {
                font-size: 16px;
                line-height: 24px;
                color: #77838e;
            }
        }

        // ── Tab 3: Spec Table ─────────────────────────
        .tab-spec-desc-wrapper {
            background: #ffffff;
            border-radius: 16px;
            padding: 20px;

            .spec-empty {
                text-align: center;
                color: #aaa;
                padding: 32px;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            :deep(table.tab-spec-desc) {
                border: 1px solid rgba(196, 196, 196, 0.5);
                border-radius: 4px;
                text-align: left;
                thead {
                    background: #efeff8;
                    tr th {
                        padding: 10px 16px;
                        font-weight: 600;
                        font-size: 14px;
                        border-bottom: 1px solid rgba(196, 196, 196, 0.5);
                        & + th { border-left: 1px solid rgba(196, 196, 196, 0.5); }
                    }
                }
                tbody tr td {
                    padding: 8px 16px;
                    font-size: 14px;
                    & + td { border-left: 1px solid rgba(196, 196, 196, 0.5); }
                }
            }
        }
    }
}
:deep .f-btn-large {
    padding: 0 8px;
    display: flex;
}
:deep .ant-tabs-nav-wrap {
    border-bottom: 1px solid #dbdbdb;
    margin-right: 20px;
    .ant-tabs-nav-list .ant-tabs-tab {
        margin: 0;
        font-size: 18px;
        font-weight: 400;
    }
}
:deep .ant-tabs-nav .ant-tabs-tab:hover,
.ant-tabs-tab-btn:active,
.ant-tabs-nav .ant-tabs-tab-active {
    color: #6e5faf;
}
</style>
