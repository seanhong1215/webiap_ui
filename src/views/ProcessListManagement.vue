<template>
    <div class="proc-list">
        <fl-head-icon-title :text="$t('processList.processOverView')" :headerTagNumber="4" iconClass="icon-fl-proc-title" />
        <!-- 卡片 -->
        <div class="status-cards-container">
            <status-card v-for="statusCard in getStatusCards(searchField)" v-bind="statusCard" :key="statusCard.type" @onSelectUpdate="setSelectedType" />
        </div>
        <div class="search-container">
            <div class="fl-search-wrapper">
                <f-searchbar v-model="searchValue" size="large" :placeholder="$t('processList.processSearch')" @search="onSearchActive($event, false)"></f-searchbar>
            </div>
            <div class="fl-adv-search">
                <fl-adv-search :opening="isShowAdvSearchBlock" @click="isShowAdvSearchBlock = !isShowAdvSearchBlock" />
            </div>
            <transition>
                <div class="fl-adv-search-div" v-show="isShowAdvSearchBlock">
                    <adv-search-block ref="advSearch" @onSubmit="onSearchActive($event, true)" />
                </div>
            </transition>
        </div>
        <div class="content-container">
            <div class="content-header">
                <fl-head-icon-title :text="$t(`processList.${viewType}`)" :headerTagNumber="4" iconClass="icon-fl-proc-title" />
                <div style="display: flex; flex-direction: row">
                    <div class="d-flex radio-group">
                        <f-radio-group v-for="icon in switchButtonIcons" :key="icon">
                            <f-radio name="iconGroup" v-model="typeValue" :value="icon.triggerId" :class="icon.isActive ? 'active' : ''" @click="doClick(icon)">
                                <i :class="icon.class"></i>
                            </f-radio>
                        </f-radio-group>
                    </div>
                </div>
            </div>
            <div class="content-body" :class="dataViewClass">
                <template v-if="viewType === 'card'">
                    <process-card
                        v-show="!isSearchEmpty"
                        v-for="(processCard, index) in getProcessView"
                        :processCard="processCard"
                        :key="processCard.id"
                        :isDisabledForUPProcess="getToolBarDisabled(processCard)"
                        @go-to="goTo($event, (selectedIndex = index))"
                        @open-modal-edit="
                            selectedIndex = index;
                            openModalEdit();
                        "
                    />
                    <div v-show="!displayValue" class="content-search-empty">
                        <img :src="`${publicPath}img/background/workingBlock.png`" />
                        <div v-show="!isSearchEmpty">{{ $t('common.noData') }}</div>
                        <div v-show="isSearchEmpty">{{ $t('common.noResult') }} <a href="#" @click.prevent="onSearchBack" style="text-decoration: underline">返回</a></div>
                    </div>
                </template>
                <template v-else-if="viewType === 'list'">
                    <div v-show="!isSearchEmpty" class="tool-bar">
                        <f-button variant="primary-outline" :disabled="isDisabled.edit" @click="openModalEdit()"><i class="fal fa-edit"></i>{{ $t('common.edit') }}</f-button>
                        <f-button variant="primary-outline" :disabled="isDisabled.condition" @click="goTo('ConditionSetting')">
                            <i class="fal fa-code-branch"></i>{{ $t('router.ConditionSetting') }}
                        </f-button>
                        <f-button variant="primary-outline" :disabled="isDisabled.processReview" @click="goTo('ProcessReview')">
                            <i class="fal fa-eye"></i>{{ $t('router.ProcessReview') }}
                        </f-button>
                        <more-action-button
                            :icon-only="false"
                            :is-disabled="isDisabled.others"
                            :status="selectedStatusCode"
                            :itemProps="selectedIndex != -1 ? { version: getProcessView[selectedIndex].version } : {}"
                            :proId="selectedIndex != -1 ? getProcessView[selectedIndex].id : ''"
                            :artId="selectedIndex != -1 ? getProcessView[selectedIndex].artId : ''"
                            :proName="selectedIndex != -1 ? getProcessView[selectedIndex].proName : ''"
                            :deleteArtEnable="selectedIndex != -1 ? getProcessView[selectedIndex].deleteArtEnable : ''"
                            @after-submit="afterOnOffSubmit"
                        />
                    </div>
                    <fl-table v-show="!isSearchEmpty" ref="listTable" :columnDefs="columnDefs" :rowList="getProcessView" :enable-row-select="true" @on-row-select-update="onRowSelect">
                        <template v-for="tdTypeSlot in tdTypeSlots" v-slot:[tdTypeSlot]="{ columnData }" :key="tdTypeSlot">
                            <div class="table-status-wrapper">
                                <status-badge :status="columnData" />
                            </div>
                        </template>
                    </fl-table>

                    <div v-show="!displayValue" class="content-search-empty">
                        <img :src="`${publicPath}img/background/workingBlock.png`" />
                        <div v-show="!isSearchEmpty">{{ $t('common.noData') }}</div>
                        <div v-show="isSearchEmpty">{{ $t('common.noResult') }} <a href="#" @click.prevent="onSearchBack" style="text-decoration: underline">返回</a></div>
                    </div>
                </template>
            </div>
            <f-paginations
                v-show="displayValue"
                :page-size-menu="[12, 24, 48, 72, 96]"
                :show-all-page-number="paginOpts.showAllPageNumber"
                :is-enable-first-page-btn="paginOpts.isEnableFirstPageBtn"
                :is-enable-last-page-btn="paginOpts.isEnableLastPageBtn"
                :data-array="getSearchCardsData"
                @after-data-src-update="onDataCallackLoad"
                @after-data-update="onPageDataCallackLoad"
            />
        </div>
        <teleport to="#portal-target">
            <f-modal ref="afModalEdit" v-model:visible="afModalEdit" size="small" :title="$t('common.edit')">
                <process-card-edit-dialog
                    :modal-data="contentData"
                    :id="selectedIndex >= 0 && getProcessView[selectedIndex] ? getProcessView[selectedIndex].id : ''"
                    :pro-name="selectedIndex >= 0 && getProcessView[selectedIndex] ? getProcessView[selectedIndex].proName : ''"
                    :desc="selectedIndex >= 0 && getProcessView[selectedIndex] ? getProcessView[selectedIndex].desc : ''"
                    @update-valid-status="updateConfirmStatus"
                    @update="updateContentData"
                >
                </process-card-edit-dialog>
                <template #footer>
                    <f-button variant="secondary-outline" size="large" @click="afModalEdit = false"><i class="fal fa-times"></i>{{ $t('common.abort') }}</f-button>
                    <f-button variant="primary" size="large" @click="afModalEditSubmit" :disabled="confirmBtnDisable"><i class="fal fa-check"></i>{{ $t('common.confirm') }}</f-button>
                </template>
            </f-modal>
        </teleport>
    </div>
</template>
<script>
import FlSwitchButton from '../components/Basic/FlSwitchButton.vue';
import FlSearchBox from '../components/Basic/FlSearchBox.vue';
import FlHeadIconTitle from '../components/Basic/FlHeadIconTitle.vue';
import FlAdvSearch from '../components/Basic/FlAdvSearch.vue';
import StatusCard from '../components/ProcessListManagement/StatusCard.vue';
import ProcessCard from '../components/ProcessListManagement/ProcessCard.vue';
import AdvSearchBlock from '../components/ProcessListManagement/AdvSearchBlock.vue';
import FlTable from '../components/Basic/FlTable.vue';
import FlButton from '../components/Basic/FlButton.vue';
import ProcessCardEditDialog from '../components/ProcessListManagement/ProcessCardEditDialog.vue';
import FlModal from '../components/Basic/FlModal.vue';
import FlModalMessage from '../components/Basic/FlModalMessage.vue';
import FlLable from '../components/Basic/FlLabel.vue';
import StatusBadge from '../components/Common/StatusBadge.vue';
import MoreActionButton from '../components/ProcessListManagement/MoreActionButton.vue';
import FlPagination from '../components/Basic/FlPagination.vue';
import FPaginations from '../components/Basic/FPaginations.vue';
import { mapState, mapActions, mapGetters } from 'vuex';
import cloneDeep from 'lodash/fp/cloneDeep';

const DEFAULT_TABLE_BUTTON_IS_DISABLE = {
    edit: true,
    authSetting: true,
    condition: true,
    processReview: true,
    others: true,
};
const iconDefaultSetting = {
    class: '',
    triggerId: '',
    isActive: false,
};
export default {
    name: 'app',
    components: {
        FPaginations,
        StatusCard,
        FlSearchBox,
        FlAdvSearch,
        FlHeadIconTitle,
        ProcessCard,
        FlSwitchButton,
        AdvSearchBlock,
        FlTable,
        FlButton,
        FlModal,
        ProcessCardEditDialog,
        FlModalMessage,
        FlLable,
        StatusBadge,
        MoreActionButton,
        FlPagination,
    },
    data() {
        const that = this;
        return {
            publicPath: process.env.BASE_URL,
            selectedIndex: -1,
            isShowAdvSearchBlock: false,
            searchField: '',
            searchValue: '',
            statusCards: [],
            typeValue: 'card',
            isValidToConfirm: false,
            contentData: {},
            columnDefs: [
                { title: that.$t('processInfo.id'), dataKey: 'id', visible: false },
                { title: that.$t('processInfo.proName'), dataKey: 'proName' },
                { title: that.$t('processInfo.category'), dataKey: 'category' },
                { title: that.$t('processInfo.managerDep'), dataKey: 'managerDep' },
                { title: that.$t('processInfo.manager'), dataKey: 'manager' },
                { title: that.$t('processInfo.type'), dataKey: 'type', isTemplate: true },
                { title: that.$t('processInfo.effectiveTime'), dataKey: 'effectiveTime' },
                { title: that.$t('processInfo.closeTime'), dataKey: 'closeTime' },
                { title: that.$t('processInfo.desc'), dataKey: 'desc' },
            ],
            isDisabled: { ...DEFAULT_TABLE_BUTTON_IS_DISABLE },
            selectedStatusCode: 0,
            paginOpts: {
                showAllPageNumber: false,
                isEnableFirstPageBtn: true,
                isEnableLastPageBtn: true,
            },
            processView: [],
            afModalEdit: false,
            disableConfrimBtnBeforeCustomCheck: true,
            disableConfrimBtn: true,
            selected: [],
            displayValue: true,
        };
    },
    created() {
        const that = this;
        let loader = that.$loading.show();
        try {
            that.updateProcessList();
        } catch (e) {
        } finally {
            loader.hide();
        }
        that.switchButtonIcons.forEach((icon) => {
            icon = { ...iconDefaultSetting, ...icon };
        });
        const hasActiveLength = that.switchButtonIcons.filter((icon) => {
            return icon.isActive === true;
        }).length;
        if (that.switchButtonIcons[0] && hasActiveLength === 0) {
            that.switchButtonIcons[0].isActive = true;
        }
        that.updateViewType(that.switchButtonIcons[0].triggerId);
    },
    methods: {
        ...mapActions('process', [
            'updateProcessList',
            'updateProcSelectedType',
            'updateViewType',
            'updateProcSelectedProId',
            'updateProcSelectedArtId',
            'updateSelectedSpecProId',
            'getProcessByProId',
        ]),
        onDataCallackLoad(data) {
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
        setSelectedType(type) {
            const that = this;
            that.resetSearch();
            if (that.viewType === 'list') {
                that.resetSelectedStatus();
            }
            that.updateProcSelectedType(type);
        },
        switchView(triggerId) {
            const that = this;
            switch (triggerId) {
                case 'card':
                    that.updateViewType(triggerId);
                    break;
                case 'list':
                    that.updateViewType(triggerId);
                    break;
                default:
                    break;
            }
        },
        onSearchActive(value, isAdv) {
            const that = this;
            if (that.viewType === 'list') that.resetSelectedStatus();
            that.searchField = value;
            if (isAdv) that.isShowAdvSearchBlock = false;
        },
        openModalEdit() {
            const that = this;
            that.afModalEdit = true;
        },
        afModalEditSubmit(contentData) {
            const that = this;
            contentData = that.contentData;
            const proId = contentData.id;
            that.afModalEdit = false;
            that.getProcessByProId(proId)
                .then((res) => {
                    let loader = this.$loading.show();
                    const process = res.data.data;
                    process.name = contentData.proName;
                    process.synopsis = contentData.desc;
                    const jsonString = JSON.stringify(process);
                    apiUpdateProcessByString(process.id, that.encodeJsonString(jsonString))
                        .then((res) => {
                            if (res.status == 200) {
                                that.updateProcessList();
                                that.$message.success(that.$t('processInfo.submitMessage.saveEditSuccess'));
                            } else {
                                that.$message.success(that.$t('processInfo.submitMessage.saveEditError'));
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                        .finally(() => {
                            loader.hide();
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        afterOnOffSubmit() {
            const that = this;
            if (that.viewType === 'list') {
                that.resetSelectedStatus();
            }
        },
        goTo(target) {
            const that = this;
            const proId = that.getProcessView[that.selectedIndex].id;
            const artId = that.getProcessView[that.selectedIndex].artId;
            if (target === 'ProcessReview' || target === 'ConditionSetting') {
                that.updateSelectedSpecProId(proId);
            } else {
                that.updateProcSelectedProId(proId);
                that.updateProcSelectedArtId(artId);
            }
            that.$router.push({ name: target });
        },
        onChildValueUpdate(value, isValid) {
            const that = this;
            that.$refs.afModalEdit.updateConfirmStatus(isValid);
        },
        onRowSelect(table, index, rowData, isSelected) {
            const that = this;
            if (isSelected) {
                that.isDisabled = that.getToolBarDisabled(rowData);
                that.selectedStatusCode = rowData.type;
                that.selectedIndex = index;
            } else {
                that.isDisabled = { ...DEFAULT_TABLE_BUTTON_IS_DISABLE };
            }
        },
        resetSelectedStatus() {
            const that = this;
            if (that.$refs.listTable) {
                that.$refs.listTable.selectedIndex = '';
            }
            that.isDisabled = { ...DEFAULT_TABLE_BUTTON_IS_DISABLE };
            that.selectedIndex = -1;
        },
        resetSearch() {
            const that = this;
            that.$refs.advSearch.reset();
            that.searchField = '';
        },
        encodeJsonString(str) {
            return str.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
        },
        getToolBarDisabled(processCard) {
            const isEditable = processCard.type !== undefined && processCard.type !== 3;
            return {
                edit: !isEditable,
                authSetting: false,
                condition: !isEditable,
                processReview: false,
                others: false,
            };
        },
        updateConfirmStatus(isValid) {
            const that = this;
            that.isValidToConfirm = isValid;
        },
        updateContentData(data) {
            // data = innerData
            const that = this;
            that.contentData = data;
            if (that.contentData !== undefined) {
                that.isValidToConfirm = true;
            } else {
                that.isValidToConfirm = false;
            }
        },
        doClick(icon) {
            const that = this;
            that.switchButtonIcons.forEach((iconObj) => {
                iconObj.isActive = false;
            });
            icon.isActive = true;
            if (icon.triggerId === 'list') {
                that.typeValue = 'list';
            } else {
                that.typeValue = 'card';
            }
            switch (icon.triggerId) {
                case 'card':
                    that.updateViewType(icon.triggerId);
                    break;
                case 'list':
                    that.updateViewType(icon.triggerId);
                    break;
                default:
                    break;
            }
        },
        onSearchBack() {
            const that = this;
            that.searchValue = '';
            that.searchField = '';
            that.resetSelectedStatus();
        },
    },
    computed: {
        ...mapState('process', ['flow', 'viewType', 'processList']),
        ...mapGetters('process', ['getSearchCards', 'getStatusCards']),
        getSearchCardsData() {
            return cloneDeep(this.getSearchCards(this.searchField));
        },
        getProcessView() {
            return this.processView;
        },
        dataViewClass() {
            const that = this;
            return that.viewType === 'list' ? 'table-view-wrapper' : '';
        },
        tdTypeSlots() {
            const that = this;
            let slotArray = new Array();
            that.getProcessView.forEach((process, index) => {
                slotArray.push(`col_type_${index}`);
            });
            return slotArray;
        },
        switchButtonIcons() {
            const that = this;
            return [
                {
                    class: 'icon-fl-card',
                    triggerId: 'card',
                    isActive: that.viewType === 'list' ? false : true,
                },
                {
                    class: 'icon-fl-list',
                    triggerId: 'list',
                    isActive: that.viewType === 'list' ? true : false,
                },
            ];
        },
        isSearchEmpty() {
            return this.searchField !== '' && this.getSearchCardsData.length === 0;
        },
        confirmBtnDisable() {
            const that = this;
            console.log('confirmBtnDisable++');
            if (that.disableConfrimBtnBeforeCustomCheck) {
                return !that.isValidToConfirm;
            } else {
                return false;
            }
        },
    },
    watch: {
        viewType() {
            const that = this;
            that.isDisabled = { ...DEFAULT_TABLE_BUTTON_IS_DISABLE };
        },
    },
};
</script>
<style lang="scss" scoped>
.proc-list {
    .status-cards-container {
        display: flex;
        padding-top: 16px;
        gap: 16px;
    }
    .search-container {
        position: relative;
        display: flex;
        padding: 24px 0;
        align-items: center;
        .fl-search-wrapper {
            padding-right: 20px;
            border-right: solid 1px #c4c4c4;
            width: 100%;
        }
        .fl-adv-search {
            padding-left: 16px;
            color: #6e5faf;
            white-space: nowrap;
            cursor: pointer;
        }
        .fl-adv-search-div {
            width: 100%;
            position: absolute;
            z-index: 2;
            background: #ffffff;
            box-shadow: 0px 6px 16px -8px rgba(204, 199, 227, 0.08), 0px 9px 28px rgba(204, 199, 227, 0.05), 0px 12px 48px 16px rgba(204, 199, 227, 0.03);
            border-radius: 16px;
            top: calc(100% - 20px);
        }
    }
    .content-container {
        .content-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            :deep(.fl-btn-import > i) {
                margin-bottom: 1px;
            }
            :deep(.radio-group) {
                height: 32px;
            }
        }
        .content-body {
            display: flex;
            flex-wrap: wrap;
            gap: 0;
            margin-top: 18px;
            margin-bottom: 16px;
            &.table-view-wrapper {
                margin-top: 0px;
                margin-left: 0;
                padding: 20px;
                width: 100%;
                .tool-bar {
                    display: flex;
                    margin-bottom: 16px;
                    button:not(:last-child) {
                        margin-right: 12px;
                    }
                    :deep(.f-btn) {
                        display: flex;
                    }
                }
                .table-status-wrapper {
                    display: flex;
                    justify-content: center;
                }
            }
            .content-search-empty {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                width: 100%;
                div {
                    font-size: 16px;
                    line-height: 24px;
                    color: #a7afb2;
                }
            }
        }
    }
    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.2s;
    }
    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }
    .v-enter-to,
    .v-leave-from {
        opacity: 1;
    }
}

.fl-btn-import {
    margin-right: 12px;
    display: flex;
}
.proc-list {
    :deep(.tool-bar button.f-btn-icon) {
        width: auto;
        height: 32px;
        padding: 7px 12px;
        font-size: 14px;
        &::before {
            margin-right: 4px;
        }
    }
    :deep(.f-btn-icon:not(:disabled):hover) {
        color: #6e5faf;
    }
    :deep(.tool-bar button.f-btn-icon:not(:disabled):hover) {
        border-radius: 4px;
    }
    :deep(.radio-group .f-radio-group:last-of-type .f-radio-container) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    :deep(.radio-group .f-radio-group:first-of-type .f-radio-container) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    :deep(.f-radio-group .f-radio-container) {
        padding: 8px 12px;
    }
}
</style>
