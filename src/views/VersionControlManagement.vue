<template>
    <div class="version-control">
        <fl-routing-back-button :text="title" />
        <div class="version-control-wrapper">
            <div class="d-flex justify-content-between align-items-center">
                <fl-head-icon-title :text="$t('router.VersionControlManagementTitle')" :headerTagNumber="4" iconClass="fal fa-layer-group" />
                <f-button ref="deleteVersionCheck" v-if="displayValue" variant="primary-outline" :disabled="isDeletable" @click="deleteProcess">
                    <i class="fal fa-trash-alt"></i>{{ $t('common.deleteVersion') }}
                </f-button>
                <div ref="deleteVersionMode" v-if="!displayValue">
                    <f-button variant="secondary-outline" @click="deleteVersionMode"> <i class="fal fa-times"></i>{{ $t('common.abort') }} </f-button>
                    <f-button variant="primary" :disabled="!isDeletable" @click="deletionModalShow = true"> <i class="fal fa-trash-alt"></i>{{ $t('common.delete') }} </f-button>
                </div>
            </div>
            <div class="tool-bar">
                <a-tooltip :title="isEditable ? '修改此草稿版本的條件設定並發布' : '請選擇狀態為「就緒」的版本才能修改發布'" placement="top">
                    <span>
                        <f-button variant="primary-outline" :disabled="!isEditable" @click="$refs.processModal.show()">
                            <i class="fal fa-rocket"></i>{{ $t('versionControl.modifyAndAnnounce') }}
                        </f-button>
                    </span>
                </a-tooltip>
                <a-tooltip :title="isShowable ? '查看此版本的流程圖與表單規格' : '請先選擇一個版本'" placement="top">
                    <span>
                        <f-button variant="primary-outline" :disabled="!isShowable" @click="goTo('VersionProcessReview')">
                            <i class="fal fa-eye"></i>{{ $t('router.ProcessReview') }}
                        </f-button>
                    </span>
                </a-tooltip>
            </div>
            <fl-table
                ref="versionListTable"
                :enableCheck="tableOpts.enableCheck"
                :enableRowSelect="tableOpts.enableRowSelect"
                :columnDefs="tableOpts.columnDefs"
                :rowList="rowList"
                @on-row-select-update="onRowSelect"
                @on-check-selected-update="onCheckSelect"
            >
                <template v-for="tdTypeSlot in tdTypeSlots" v-slot:[tdTypeSlot]="{ columnData }" :key="tdTypeSlot">
                    <div class="table-status-wrapper">
                        <status-badge :status="columnData" />
                    </div>
                </template>
            </fl-table>
        </div>
    </div>
    <f-pagination
        v-show="!displayValue"
        :page-size-menu="[10, 20, 30, 40, 50]"
        :show-all-page-number="paginOpts.showAllPageNumber"
        :is-enable-first-page-btn="paginOpts.isEnableFirstPageBtn"
        :is-enable-last-page-btn="paginOpts.isEnableLastPageBtn"
        :data-array="rowList"
        @after-data-src-update="onDataCallackLoad"
        @after-data-update="onPageDataCallackLoad"
    />
    <on-off-line-dialog ref="processModal" :itemProps="selectedRowItemProps" :rootProId="selectedRowProId" :type="type" @after-submit="afterSubmit" />
    <teleport to="#portal-target">
        <f-confirm v-model:visible="deletionModalShow" title="刪除" variant="error" :onOk="confirmDelete">
            <template #content>
                <p class="text-center" style="white-space: pre-line">{{ $t('versionControl.submitMessage.deleteConfirmMessage') }}</p>
            </template>
        </f-confirm>
    </teleport>
</template>
<script>
import FlCheckbox from '@/components/Basic/FlCheckbox.vue';
import FlButton from '@/components/Basic/FlButton.vue';
import FlTable from '@/components/Basic/FlTable.vue';
import FlRoutingBackButton from '@/components/Basic/FlRoutingBackButton.vue';
import FlModalMessage from '@/components/Basic/FlModalMessage.vue';
import StatusBadge from '@/components/Common/StatusBadge.vue';
import OnOffLineDialog from '@/components/Common/OnOffLineDialog/OnOffLineDialog.vue';
import FlHeadIconTitle from '../components/Basic/FlHeadIconTitle.vue';
import { apiVersion, apiDeleteProcess } from '@/utils/api';
import global from '@/utils/global';
import { mapState, mapActions } from 'vuex';
import { version } from '@vue/runtime-core';
import moment from 'moment';
export default {
    name: 'VersionControlManagement',
    components: {
        FlCheckbox,
        FlButton,
        FlTable,
        FlRoutingBackButton,
        StatusBadge,
        OnOffLineDialog,
        FlModalMessage,
        FlHeadIconTitle,
    },
    data() {
        const that = this;
        return {
            title: that.$t('router.VersionControlManagement'),
            selectedIndexList: [],
            tableOpts: {
                enableCheck: false,
                enableRowSelect: true,
                columnDefs: [
                    {
                        title: that.$t('processInfo.version'),
                        dataKey: 'version',
                        visible: true,
                        defaultContent: '',
                    },
                    {
                        title: that.$t('processInfo.proName'),
                        dataKey: 'procName',
                        visible: true,
                        defaultContent: '',
                    },
                    {
                        title: that.$t('processInfo.limited'),
                        dataKey: 'limited',
                        visible: true,
                        defaultContent: '',
                    },
                    {
                        title: that.$t('processInfo.category'),
                        dataKey: 'category',
                        visible: true,
                        defaultContent: '',
                    },
                    {
                        title: that.$t('processInfo.managerDep'),
                        dataKey: 'managerDep',
                        visible: true,
                        defaultContent: '',
                    },
                    {
                        title: that.$t('processInfo.manager'),
                        dataKey: 'manager',
                        visible: true,
                        defaultContent: '',
                    },
                    {
                        title: that.$t('processInfo.createTime'),
                        dataKey: 'createTime',
                        visible: true,
                        defaultContent: '',
                    },
                    {
                        title: that.$t('processInfo.effectiveTime'),
                        dataKey: 'effectiveTime',
                        visible: true,
                        defaultContent: '',
                    },
                    {
                        title: that.$t('processInfo.closeTime'),
                        dataKey: 'closeTime',
                        visible: true,
                        defaultContent: '',
                    },
                    {
                        title: that.$t('processInfo.status'),
                        dataKey: 'status',
                        visible: true,
                        defaultContent: '',
                        isTemplate: true,
                    },
                ],
            },
            rowList: [],
            isEditable: false,
            isDeletable: false,
            isShowable: false,
            isSettable: false,
            type: 'modify',
            deleteConfirmMessage: that.$t('versionControl.submitMessage.deleteConfirmMessage'),
            deletionModalShow: false,
            displayValue: false,
            paginOpts: {
                showAllPageNumber: false,
                isEnableFirstPageBtn: true,
                isEnableLastPageBtn: true,
            },
        };
    },
    created() {
        this.updateVersion();
    },
    computed: {
        ...mapState('process', ['categories', 'selectedProId', 'selectedArtId']),
        tdTypeSlots() {
            const that = this;
            let slotArray = new Array();
            that.rowList.forEach((process, index) => {
                slotArray.push(`col_status_${index}`);
            });
            return slotArray;
        },
        selectedRowItemProps() {
            return this.selectedIndexList.length > 0 ? this.rowList[this.selectedIndexList[0]] : {};
        },
        selectedRowProId() {
            return this.selectedIndexList.length > 0 ? this.rowList[this.selectedIndexList[0]].proId : '';
        },
    },
    methods: {
        ...mapActions('process', ['updateProcessList', 'updateProcSelectedProId', 'updateSelectedSpecProId']),
        resetSelectedStatus() {
            const that = this;
            that.$refs.versionListTable.selectedIndex = '';
            that.isEditable = false;
            that.isDeletable = false;
            that.isShowable = false;
            that.isSettable = false;
        },
        afterSubmit() {
            const that = this;
            that.updateVersion();
            that.resetSelectedStatus();
        },
        updateVersion() {
            const that = this;
            this.updateProcessList().then((res) => {
                const cards = res.data.data.cards;
                const card = cards.filter((item) => {
                    return item.artID == that.selectedArtId;
                });
                // Check selected proId equals newest proId getting from mfp
                if (card.length > 0 && card[0].proID != that.selectedProId) {
                    that.updateProcSelectedProId(card[0].proID);
                }
                // Get Version List
                apiVersion(that.selectedProId)
                    .then((res) => {
                        if (res.status == 200) {
                            that.rowList = res.data.data
                                .map((data) => {
                                    const startTime = data.startTime;
                                    const endTime = data.endTime;
                                    const executable = data.executable;
                                    const type = global.processTypeConverter(startTime, endTime, executable);
                                    return {
                                        isCheckEditable: that.isCheckDeletable(data.proId, type, data.taskCount),
                                        proId: data.proId,
                                        version: data.versionIndex,
                                        procName: data.proName,
                                        limited: data.roleNameList.toString(),
                                        category: data.prjName,
                                        managerDep: data.managerDepNameList.toString(),
                                        manager: data.managerNameList.toString(),
                                        createTime: data.createTime,
                                        effectiveTime: startTime === '9999-12-31' ? '*' : moment(startTime).format('YYYY-MM-DD HH:mm'),
                                        closeTime: endTime === '9999-12-31' ? '' : moment(endTime).format('YYYY-MM-DD HH:mm'),
                                        status: type,
                                        taskCount: data.taskCount,
                                        deleteArtEnable: data.deleteArtEnable,
                                    };
                                })
                                .reverse();
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        },
        turnOnOffBatchMode(checked) {
            const that = this;
            that.tableOpts.enableCheck = checked;
            that.isEditable = false;
            that.isDeletable = false;
            that.isShowable = false;
            that.isSettable = false;
        },
        onRowSelect(table, index, rowData, isSelected) {
            const that = this;
            if (isSelected) {
                that.selectedIndexList = [index];
            }
            that.isEditable = rowData.status === 2 ? isSelected : false;
            that.isDeletable = that.isCheckDeletable(rowData.proId, rowData.status, rowData.taskCount) ? isSelected : false;
            that.isShowable = isSelected;
            that.isSettable = that.isCheckSettable(rowData.status) ? isSelected : false;
        },
        onCheckSelect(selectedList) {
            const that = this;
            const selectedProIdAry = selectedList.map((item) => {
                return item.proId;
            });
            that.selectedIndexList = [];
            that.rowList.forEach((item, index) => {
                if (selectedProIdAry.includes(item.proId)) that.selectedIndexList.push(index);
            });
            that.isDeletable = selectedList.length > 0 ? true : false;
        },
        goTo(target) {
            const that = this;
            const selectedIndex = that.selectedIndexList[0];
            const proId = that.rowList[selectedIndex].proId;
            that.updateSelectedSpecProId(proId);
            that.$router.push({ name: target });
        },
        deleteProcess() {
            const that = this;
            that.turnOnOffBatchMode(true);
            that.displayValue = !that.displayValue;

            if (that.tableOpts.enableCheck) {
                that.deleteConfirmMessage = that.$t('versionControl.submitMessage.deleteSelectedConfirmMessage');
            } else {
                that.deleteConfirmMessage = that.$t('versionControl.submitMessage.deleteConfirmMessage');
            }
        },
        deleteVersionMode() {
            const that = this;
            that.turnOnOffBatchMode(false);
            that.displayValue = true;
        },
        async confirmDelete(modal) {
            const that = this;
            let loader = that.$loading.show();
            await Promise.all(
                that.selectedIndexList.map(async (selectedIndex) => {
                    if (that.rowList[selectedIndex].proId === that.selectedProId) return;
                    const proId = that.rowList[selectedIndex].proId;
                    await apiDeleteProcess(proId)
                        .then((res) => {})
                        .catch((err) => {
                            console.log(err);
                        });
                })
            );
            // TODO 需確認版號是否為固定後才能改為此方法更新資料
            // that.rowList = that.rowList.filter((item, index) => {
            //     return !that.selectedIndexList.includes(index);
            // });
            that.updateVersion();
            that.selectedIndexList = [];
            that.resetSelectedStatus();
            modal.hide();
            loader.hide();
            that.$message.success(that.$t('common.submitMessage.deleteSuccess'));
        },
        isCheckDeletable(proId, type, taskCount) {
            let isCheckDeletable = false;
            if (this.selectedProId !== proId && (type == 1 || type == 2 || type == 4) && taskCount == 0) {
                isCheckDeletable = true;
            }
            return isCheckDeletable;
        },
        isCheckSettable(type) {
            let isCheckSettable = false;
            if (type == 1 || type == 2 || type == 4) {
                isCheckSettable = true;
            }
            return isCheckSettable;
        },
        onDataCallackLoad(data) {
            this.processView = data;
            this.processView = data.dataSource;
        },
        onPageDataCallackLoad(data) {
            this.processView = data.dataSource;
            if (data.totalNumber === 0) {
                this.displayValue = false;
            } else {
                this.displayValue = true;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.version-control {
    .version-control-wrapper {
        background: #ffffff;
        box-shadow: 0px 3px 6px -4px rgba(72, 62, 114, 0.12);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 40px;
        .tool-bar {
            display: flex;
            margin-top: 20px;
            margin-bottom: 16px;
            gap: 8px;
            button {
                display: flex;
            }
        }
        .table-status-wrapper {
            display: flex;
            justify-content: center;
        }
    }
}
</style>
