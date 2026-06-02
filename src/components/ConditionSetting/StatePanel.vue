<template>
    <div class="fl-conditionpanel">
        <!-- StatePanel -->
        <div class="fl-row fl-action" v-if="!isStateSizeZero">
            <div class="fl-row">
                <fl-button :iconClass="'fal fa-trash-alt'" @click="deleteState" :type="'icon'" :disabled="!isCanDelete || isUPProcess" />
                <fl-button :iconClass="'fal fa-arrow-square-up'" @click="moveUpState" :type="'icon'" :disabled="!isCanMoveUp || isUPProcess" />
                <fl-button :iconClass="'fal fa-arrow-square-down'" @click="moveDownState" :type="'icon'" :disabled="!isCanMoveDown || isUPProcess" />
            </div>
            <div class="fl-row right">
                <f-button variant="primary-outline" size="large" @click="addState" :disabled="isUPProcess"><i class="fal fa-plus"></i>{{ $t('conditionSetting.addCondition') }}</f-button>
                <f-button variant="primary-outline" size="large" @click="copyState" :disabled="isUPProcess"><i class="fal fa-clone"></i>{{ $t('conditionSetting.copyCondition') }}</f-button>
                <f-button variant="primary-outline" size="large" @click="save" :disabled="getProcessWorkingType || isUPProcess"><i class="fal fa-save"></i>{{ $t('common.save') }}</f-button>
                <f-button variant="primary-outline" size="large" @click="release" :disabled="getProcessWorkingType || isUPProcess"
                    ><i class="fal fa-rocket"></i>{{ $t('common.announce') }}</f-button
                >
            </div>
        </div>
        <div>
            <fl-drag-drop :listArr="states" :handle="handle" @updateDragList="updateDragList" :isDisabled="isUPProcess">
                <template v-slot:body="{ slotprops, index }">
                    <state :ref="setItemRef" :state="slotprops" :index="index" :processItems="processItems" :isDisabled="isUPProcess" @updateState="updateState($event, index)" />
                </template>
            </fl-drag-drop>
            <div v-show="isStateSizeZero" class="fl-state-zero">
                <img :src="`${publicPath}img/background/workingBlock.png`" />
                <div>{{ $t('conditionSetting.clickAndAdd') }}</div>
                <f-button variant="primary" size="large" @click="addState"><i class="fal fa-plus"></i>{{ $t('conditionSetting.addCondition') }}</f-button>
            </div>
        </div>
        <teleport to="#portal-target">
            <f-modal ref="afModalNameEdit" v-model:visible="afModalNameEdit" size="small" :title="$t('conditionSetting.addCondition')">
                <add-state :modalData="contentData" :editData="{ name: '' }" @update-valid-status="updateConfirmStatus" />
                <template #footer>
                    <f-button variant="secondary-outline" size="large" @click="afModalNameEdit = false"><i class="fal fa-times"></i>{{ $t('common.abort') }}</f-button>
                    <f-button variant="primary" size="large" :disabled="confirmBtnDisable" @click="afterModalNameEdit"><i class="fal fa-check"></i>{{ $t('common.confirm') }}</f-button>
                </template>
            </f-modal>
        </teleport>
        <teleport to="#portal-target">
            <f-modal ref="afModalNameCopy" v-model:visible="afModalNameCopy" size="small" :title="$t('conditionSetting.copyCondition')">
                <copy-state :modalData="contentData" :states="states" />
                <template #footer>
                    <f-button variant="secondary-outline" size="large" @click="afModalNameCopy = false"><i class="fal fa-times"></i>{{ $t('common.abort') }}</f-button>
                    <f-button variant="primary" size="large" :disabled="confirmBtnDisable" @click="afterModalNameCopy"><i class="fal fa-check"></i>{{ $t('common.confirm') }}</f-button>
                </template>
            </f-modal>
        </teleport>
        <on-off-line-dialog ref="releaseModal" :type="'release'" :itemProps="getItemProps" :subType="getReleaseInit" :rootProId="selectedSpecProId" @after-submit="afterSubmit" />
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { apiNewId, apiStateSave } from '@/utils/api';
// page components
import State from '@/components/ConditionSetting/State.vue';
import AddState from '@/components/ConditionSetting/StateNameEdit.vue';
import CopyState from '@/components/ConditionSetting/StateNameCopy.vue';
import OnOffLineDialog from '@/components/Common/OnOffLineDialog/OnOffLineDialog.vue';
// basic components
import FlDragDrop from '@/components/Basic/FlDragDrop.vue';
import FlButton from '@/components/Basic/FlButton.vue';
import FlLabel from '@/components/Basic/FlLabel.vue';
import FlModal from '@/components/Basic/FlModal.vue';
import { nextTick } from 'vue';

const DEFAULT_TABLE_BUTTON_IS_DISABLE = {
    edit: true && false,
    authSetting: true,
    condition: true,
    processReview: true,
    others: true,
};
export default {
    name: 'StatePanel',
    props: {
        processInfo: {
            type: Object,
        },
        isDisabled: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        State,
        AddState,
        OnOffLineDialog,
        FlDragDrop,
        FlButton,
        FlLabel,
        FlModal,
        CopyState,
    },
    data() {
        return {
            handle: 'div.fl-state',
            processItems: [],
            states: [],
            publicPath: process.env.BASE_URL,
            newList: [],
            deleteList: [],
            copyList: [],
            artId: '',
            rootProId: '',
            proId: '',
            prjID: '',
            isHaveDeleted: false,
            isFirstTimeToUpdatedDrag: true,
            itemRefs: [],
            oriDataLength: 0,
            afModalNameEdit: false,
            afModalNameCopy: false,
            disableConfrimBtnBeforeCustomCheck: false,
            isValidToConfirm: false,
            contentData: {},
        };
    },
    emits: ['updateDoSomething'],
    methods: {
        ...mapActions('process', ['updateProcessList', 'getMfpManagerByProId']),
        ...mapActions('condition', ['updateXConditionList']),
        afterSubmit() {
            this.updateProcessList();
            this.getMfpManagerByProId(this.selectedSpecProId);
        },
        updateDragList(val) {
            const that = this;
            that.states = val;
            if (!that.isFirstTimeToUpdatedDrag) {
                that.$emit('updateDoSomething', true);
            }
            that.isFirstTimeToUpdatedDrag = false;
        },
        deleteState() {
            const that = this;
            if (!that.isCanDelete) {
                return;
            }
            for (let i = that.states.length - 1; i >= 0; i--) {
                if (that.states[i].selected) {
                    that.deleteList.push(that.states[i]);
                    if (that.newList.indexOf(that.states[i].id) > -1) {
                        that.newList.splice(i, 1);
                    }
                    // 刪除複製的 start
                    let copyIndex = that.copyList.findIndex((el) => el.artStateId === that.states[i].id);
                    if (copyIndex > -1) {
                        that.copyList.splice(copyIndex, 1);
                    }
                    // 刪除複製的 end
                    that.states.splice(i, 1);
                    that.isHaveDeleted = true;
                }
            }
            that.$message.success(that.$t('common.submitMessage.deleteSuccess'));

            this.$emit('updateDoSomething', true);
        },
        moveUpState() {
            const that = this;
            if (!that.isCanMoveUp) {
                return;
            }
            for (let i = 0; i < that.states.length; i++) {
                if (that.states[i].selected) {
                    if (i > 0 && !that.states[i - 1].selected) {
                        that.upRecord(that.states, i);
                    }
                }
            }

            this.$emit('updateDoSomething', true);
        },
        moveDownState() {
            const that = this;
            if (!that.isCanMoveDown) {
                return;
            }
            for (let i = that.states.length - 1; i >= 0; i--) {
                if (that.states[i].selected) {
                    if (i < that.states.length - 1 && !that.states[i + 1].selected) {
                        that.downRecord(that.states, i);
                    }
                }
            }

            this.$emit('updateDoSomething', true);
        },
        addState() {
            const that = this;
            that.afModalNameEdit = true;
        },
        async afterModalNameEdit(contentData) {
            const that = this;
            contentData = that.contentData;
            that.afModalNameEdit = false;
            let newState = that.getEmptyState();
            newState.name = contentData.name;
            let newId = await that.getNewId('5');
            if (newId == 'GET NEW ID FAIL') {
                that.$message.error(that.$t('common.submitMessage.addFail'));
            } else {
                newState.id = newId;
                that.states.push(newState);
                that.$message.success(that.$t('common.submitMessage.addSuccess'));
                that.newList.push(newState.id);
                this.$emit('updateDoSomething', true);
            }
        },
        async getNewId(type) {
            const that = this;
            const newId = await apiNewId(type)
                .then((res) => {
                    if (res.status == 200) {
                        return res.data.data.newId;
                    } else {
                        return 'GET NEW ID FAIL';
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            //console.log('@ getNewId @ newId:', newId);
            return newId;
        },
        getEmptyState() {
            const that = this;
            return {
                name: 'new state',
                selected: false,
                conditions: [that.getEmptyCondition()],
            };
        },
        getEmptyCondition() {
            return {
                relationship: '',
                item: '',
                operation: '',
                condition: '',
            };
        },
        checkAllState(e) {
            const that = this;
            for (let i = 0; i < that.states.length; i++) {
                const state = that.states[i];
                //check state name
                if (state.name == '') {
                    console.log('checkAllState', 'name empty');
                    that.$message.error(that.$t('conditionSetting.submitMessage.conditionNameEmpty'));
                    return false;
                }
                //check same name
                let list = that.states.filter((x) => x.name == state.name);
                if (list.length > 1) {
                    console.log('checkAllState', 'duplicate name ');
                    that.$message.error(that.$t('conditionSetting.submitMessage.conditionNameDuplicate'));
                    return false;
                }
                if (state.conditions.length == 1) {
                    state.conditions;
                    if (state.conditions[0].relationship == '' && state.conditions[0].item == '' && state.conditions[0].operation == '' && state.conditions[0].condition == '') {
                        return true;
                    }
                }
                if (!that.checkAllCondition(state.conditions)) {
                    return false;
                }
            }
            return true;
        },
        checkAllCondition(conditions) {
            for (let i = 0; i < conditions.length; i++) {
                const condition = conditions[i];
                if (i != 0 && condition.relationship == '') {
                    console.log('checkAllCondition', 'relationship　 empty');
                    return false;
                }
                if (condition.item == '') {
                    console.log('checkAllCondition', 'item empty');
                    return false;
                }
                if (condition.operation == '') {
                    console.log('checkAllCondition', 'operation empty');
                    return false;
                }
                if (condition.itemObj.dbType.indexOf('string') > -1) {
                    // can put empty in string
                } else {
                    if (condition.condition == '') {
                        console.log('checkAllCondition', 'condition not text but empty');
                        return false;
                    }
                }
            }
            return true;
        },
        async save(e) {
            const that = this;
            const checkRes = that.checkAllState();
            if (!checkRes) {
                that.$message.error(that.$t('conditionSetting.submitMessage.checkfail'));
                return;
            }
            let data = {
                prjId: that.prjID,
                rootProId: that.rootProId,
                proId: that.proId,
                newList: that.createSaveListNew(),
                deleteList: that.createSaveListDel(),
                updateList: that.createSaveListUpdate(),
                copyList: that.createSaveListCopy(),
                proSignStateList: that.createProSignStateList(),
            };
            const newId = await apiStateSave(data)
                .then((res) => {
                    if (res.status == 200) {
                        that.$message.success(that.$t('common.submitMessage.saveSuccess'));
                    } else {
                        that.$message.error(that.$t('common.submitMessage.saveFail'));
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            console.log('newId', newId);
            //clear list
            that.newList = [];
            that.deleteList = [];
            that.copyList = [];
            //refresh data
            await that.refreshPanel();
            this.$emit('updateDoSomething', false);
        },
        getConditionString(conditions) {
            const that = this;
            if (conditions.length == 1) {
                if (conditions[0].relationship == '' && conditions[0].item == '' && conditions[0].operation == '' && conditions[0].condition == '') {
                    return '';
                }
            }
            let res = '';
            for (let i = 0; i < conditions.length; i++) {
                const condition = conditions[i];
                if (condition.relationship != '') {
                    res = res + condition.relationship + ' ';
                }
                res = res + condition.item + ' ';
                res = res + condition.operation + ' ';
                if (condition.itemObj) {
                    if (condition.itemObj.dbType.indexOf('string') > -1) {
                        res = res + '"' + condition.condition + '"' + ' ';
                    } else {
                        res = res + condition.condition + ' ';
                    }
                } else {
                    res = res + condition.condition + ' ';
                }
            }
            return res;
        },
        encodeJsonString(str) {
            return str.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
        },
        createSaveListNew() {
            const that = this;
            let list = that.states.filter((x) => that.newList.includes(x.id));
            let res = list.map((state) => {
                return {
                    rootProId: that.rootProId,
                    proId: that.proId,
                    artId: that.artId,
                    artStateId: state.id,
                    artStateName: that.encodeJsonString(state.name),
                    artStateCondition: that.encodeJsonString(that.getConditionString(state.conditions)),
                };
            });
            return res;
        },
        createSaveListDel() {
            const that = this;
            let res = that.deleteList.map((state) => {
                return {
                    rootProId: that.rootProId,
                    proId: that.proId,
                    artId: that.artId,
                    artStateId: state.id,
                    mfpId: state.mfpId,
                };
            });
            return res;
        },
        createSaveListUpdate() {
            const that = this;
            let list = that.states.filter((x) => !that.newList.includes(x.id) && !that.deleteList.includes(x.id) && that.copyList.findIndex((el) => el.artStateId == x.id) == -1);
            let res = list.map((state) => {
                return {
                    rootProId: that.rootProId,
                    proId: that.proId,
                    artStateId: state.id,
                    artStateName: that.encodeJsonString(state.name),
                    artStateCondition: that.encodeJsonString(that.getConditionString(state.conditions)),
                };
            });
            return res;
        },
        createSaveListCopy() {
            const that = this;
            for (let i = 0; i < that.copyList.length; i++) {
                let copyObj = that.copyList[i];
                const state = that.states.find((element) => element.id == copyObj.artStateId);
                copyObj.artStateName = that.encodeJsonString(state.name);
                copyObj.artStateCondition = that.encodeJsonString(that.getConditionString(state.conditions));
            }
            return that.copyList;
        },
        createProSignStateList() {
            const that = this;
            let res = that.states.map((state, index) => {
                return {
                    ProSignStateId: state.id,
                    ProSignStateName: that.encodeJsonString(state.name),
                    ProSignStateDisplayName: that.encodeJsonString(state.name),
                };
            });
            return res;
        },
        release() {
            const that = this;
            that.$refs.releaseModal.show();
        },
        updateState(stateInfo, index) {
            const that = this;
            that.states[index] = stateInfo;
            that.itemRefs.forEach((ref) => {
                nextTick(() => ref.doPositionFix());
            });
            this.$emit('updateDoSomething', true);
        },
        swapItems(arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
        },
        upRecord(arr, index) {
            const that = this;
            if (index == 0) {
                return;
            }
            that.swapItems(arr, index, index - 1);
        },
        downRecord(arr, index) {
            const that = this;
            if (index == arr.length - 1) {
                return;
            }
            that.swapItems(arr, index, index + 1);
        },
        goTo(target) {
            const that = this;
            that.$router.push({ name: target });
        },
        copyState() {
            const that = this;
            that.afModalNameCopy = true;
        },
        async afterModalNameCopy(contentData) {
            const that = this;
            contentData = that.contentData;
            that.afModalNameCopy = false;
            let newState = contentData.state;
            let newId = await that.getNewId('5');
            if (newId == 'GET NEW ID FAIL') {
                that.$message.error(that.$t('common.submitMessage.copyFail'));
            } else {
                newState.id = newId;
                that.states.push(newState);
                that.copyList.push({
                    rootProId: that.rootProId,
                    proId: that.proId,
                    artId: that.artId,
                    artStateId: newState.id,
                    mfpId: newState.mfpId,
                    artStateName: 'nonostate', //will update when createSaveListCopy
                    artStateCondition: 'nonostate', //will update when createSaveListCopy
                });
                that.$message.success(that.$t('common.submitMessage.copySuccess'));
            }
            this.$emit('updateDoSomething', true);
        },
        async refreshPanel() {
            // Update process cards
            const that = this;
            const loader = that.$loading.show();
            try {
                await that.updateXConditionList(that.selectedSpecProId); //root process id
                that.states = that.getXStates;
                that.oriDataLength = that.states.length;
                that.processItems = that.getXProcessItems.filter((item) => !item.javaType.startsWith('Table'));
                const otherInfo = that.getXInfo;
                that.artId = otherInfo.artId;
                that.rootProId = otherInfo.rootProId;
                that.proId = otherInfo.proId;
                that.prjID = otherInfo.prjID;
                that.isHaveDeleted = false;
                this.$emit('updateDoSomething', false);
            } catch (e) {
                console.log(`refreshPanel fail with e:${e}`);
                that.$message.error(that.$t('error.system'), 60);
            } finally {
                loader.hide();
            }
        },
        setItemRef(el) {
            const that = this;
            if (el) {
                nextTick(() => {
                    if (!that.itemRefs.includes(el)) {
                        that.itemRefs.push(el);
                    }
                });
            }
        },
        updateConfirmStatus(isValid) {
            const that = this;
            that.isValidToConfirm = isValid;
        },
    },
    computed: {
        ...mapState('process', ['selectedSpecProId']),
        ...mapGetters('process', ['getSpecMfpPanel']),
        ...mapGetters('condition', ['getXStates', 'getXProcessItems', 'getXInfo']),
        isUPProcess() { return false; },
        getReleaseInit() {
            const that = this;
            if (that.getSpecMfpPanel.type == 1) {
                return 'init';
            }
            return 'noneInit';
        },
        getProcessWorkingType() {
            const that = this;
            if (that.getSpecMfpPanel.type == 3) {
                return true;
            }
            return false;
        },
        dragOptions() {
            return {
                animation: 200,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost',
            };
        },
        isCanDelete() {
            const that = this;
            const res = that.states.some(function (item, index, array) {
                return item.selected == true;
            });
            return res;
        },
        isCanMoveUp() {
            const that = this;
            const res = that.states.some(function (item, index, array) {
                if (index == 0) {
                    return false;
                } else {
                    if (item.selected) {
                        if (array[index - 1].selected) {
                            return false;
                        }
                        return true;
                    } else {
                        return false;
                    }
                }
            });
            return res;
        },
        isCanMoveDown() {
            const that = this;
            const res = that.states.some(function (item, index, array) {
                if (index == array.length - 1) {
                    return false;
                } else {
                    if (item.selected) {
                        if (array[index + 1].selected) {
                            return false;
                        }
                        return true;
                    } else {
                        return false;
                    }
                }
            });
            return res;
        },
        isStateSizeZero() {
            const that = this;
            return that.states.length == 0;
        },
        getItemProps() {
            return {
                version: this.getSpecMfpPanel.version,
            };
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
    beforeUpdate() {
        this.itemRefs = [];
    },
    async created() {
        const that = this;
        await that.refreshPanel();
        this.$emit('updateDoSomething', false);
    },
};
</script>
<style scoped lang="scss">
.fl-action {
    justify-content: space-between;
    margin-top: 24px;
    margin-bottom: 12px;
    &.zero {
        display: flex;
        justify-content: flex-end;
        > button {
            margin-right: 8px;
        }
    }
    .right > button {
        margin-right: 8px;
    }
}
.fl-more {
    padding: 8px 0;
    margin: 5px 0;
    z-index: 100;
    position: absolute;
    width: 120px;
    background: #ffffff;
    box-shadow: 0px 8px 28px rgba(72, 62, 114, 0.08);
    border-radius: 2px;
    font-style: normal;
    font-weight: normal;
    .normal {
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        color: #333333;
    }
    .small {
        height: 32px;
        line-height: 32px;
        font-size: 12px;
        color: rgba(51, 51, 51, 0.87);
        padding-left: 28px;
    }
}
.fl-row {
    display: flex;
    flex-direction: row;
}
.fl-state-zero {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 110px 0;
    div {
        color: #a7afb2;
        margin-bottom: 16px;
    }
}

:deep(.fl-menu) {
    i {
        width: 16px;
        text-align: center;
        justify-content: center;
        display: inline-flex;
    }
}
</style>
