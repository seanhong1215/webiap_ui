<template>
    <teleport to="#portal-target">
        <f-modal ref="mainDialog" v-model:visible="mainDialog" size="small" :title="mainTitle">
            <component v-bind:is="typeContent" :itemProps="itemProps" @update="updateContentData" @update-valid-status="updateConfirmStatus" :type="type" />
            <template #footer>
                <f-button variant="secondary-outline" size="large" @click="hide"><i class="fal fa-times"></i>{{ $t('common.abort') }}</f-button>
                <f-button variant="primary" size="large" @click="submit" :disabled="confirmBtnDisable"><i class="fal fa-check"></i>{{ $t('common.confirm') }}</f-button>
            </template>
        </f-modal>
    </teleport>
</template>
<script>
import moment from 'moment';
import { mapState } from 'vuex';
import { defineAsyncComponent } from 'vue';
import typeMap from './typeMap.js';
import { apiStateRelease, apiProcessOffline } from '@/utils/api';
let typeMapper = null;
export default {
    name: 'OnOffLineDialog',
    components: {},
    props: {
        itemProps: {
            type: Object,
            default: () => {
                return {};
            },
        },
        type: {
            type: String,
            default: 'online', // online, offline, release, modify
        },
        subType: {
            type: String,
            default: 'init', // init, noneInit
        },
        rootProId: {
            type: String,
            default: '',
        },
    },
    emits: ['afterSubmit'],
    data() {
        return {
            mainTitle: '',
            dialogTitle: '',
            dialogMessage: '',
            isDialogLg: false,
            contentData: {},
            hintDialog: false,
            mainDialog: false,
            isValidToConfirm: false,
            disableConfrimBtnBeforeCustomCheck: false,
        };
    },
    beforeCreate() {
        const that = this;
        typeMapper = typeMap(that);
    },
    created() {
        const that = this;
        if (typeMapper[that.type]) {
            that.mainTitle = typeMapper[that.type].modalTitle;
        }
    },
    computed: {
        typeContent() {
            const that = this;
            let componentName = 'TypeAContent';
            if (typeMapper[that.type]) {
                if (that.type === 'release') {
                    const typeObj = typeMapper[that.type];
                    componentName = typeObj[that.subType].component;
                } else {
                    componentName = typeMapper[that.type].component;
                }
            }
            return defineAsyncComponent(() => import(`@/components/Common/OnOffLineDialog/${componentName}.vue`));
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
        getItemProps() {
            return this.itemProps;
        },
    },
    watch: {
        type() {
            const that = this;
            if (typeMapper[that.type]) {
                that.mainTitle = typeMapper[that.type].modalTitle;
            }
        },
    },
    methods: {
        show() {
            const that = this;
            that.mainDialog = true;
        },
        mainDialogs() {},
        hide() {
            const that = this;
            that.mainDialog = false;
            that.$emit('afterSubmit');
        },
        async submit(contentData) {
            const that = this;
            contentData = that.contentData;
            const rootProId = that.rootProId;
            const time = contentData.time;
            let data = { isCompleteOldVersionTask: true };
            if (contentData.processWayType == 'restart') {
                data.isCompleteOldVersionTask = true;
            } else if (contentData.processWayType == 'keep') {
                data.isCompleteOldVersionTask = false;
            }
            if (that.type === 'release') {
                if (contentData.type !== 'immediate') {
                    data.startTime = time;
                }
                await that.doRelease(rootProId, data);
            } else if (that.type === 'offline') {
                if (contentData.type !== 'immediate') {
                    data.endTime = time;
                }
                await that.doOffLine(rootProId, data);
            } else if (that.type === 'online') {
                if (contentData.type !== 'immediate') {
                    data.startTime = time;
                }
                await that.doOnline(rootProId, data);
            } else if (that.type === 'modify') {
                if (contentData.type !== 'immediate') {
                    data.startTime = contentData.type === 'notnow' ? '9999-12-30' : time;
                }
                await that.doModify(rootProId, data);
            }
            that.isDialogLg = false;
            if (true) {
                that.hide();
                const timeVal = moment(contentData.time).format('YYYY-MM-DD HH:mm');
                const dialog = typeMapper[that.type].dialog(contentData.type, timeVal);
                that.dialogTitle = dialog.title;
                that.dialogMessage = dialog.message;
                that.$message.success(`${that.dialogTitle}: ${that.dialogMessage}`);
            }
        },
        async doRelease(rootProId, data) {
            const that = this;
            await apiStateRelease(rootProId, data)
                .then((res) => {
                    if (res.status == 200) {
                        // that.$message.success(that.$t('onOffLine.releaseSuccess'));
                    } else {
                        // that.$message.error(that.$t('onOffLine.releaseFail'));
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        async doOnline(rootProId, data) {
            const that = this;

            await apiStateRelease(rootProId, data)
                .then((res) => {
                    if (res.status == 200) {
                        //that.$message.success('發布成功');
                    } else {
                        //that.$message.error('發布失敗');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        async doModify(rootProId, data) {
            const that = this;
            await apiStateRelease(rootProId, data)
                .then((res) => {
                    if (res.status == 200) {
                        //that.$message.success('發布成功');
                    } else {
                        //that.$message.error('發布失敗');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        async doOffLine(rootProId, data) {
            const that = this;
            await apiProcessOffline(rootProId, data)
                .then((res) => {
                    if (res.status === 200) {
                        //that.$message.success('下線成功');
                    } else {
                        //that.$message.error('下線失敗');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        updateConfirmStatus(isValid) {
            const that = this;
            that.isValidToConfirm = isValid;
        },
        updateContentData(data) {
            const that = this;
            that.contentData = data;
        },
    },
};
</script>
