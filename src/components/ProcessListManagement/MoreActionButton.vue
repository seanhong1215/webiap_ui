<template>
    <f-dropdown :trigger="['click']" :disabled="isDisabled" overlayClassName="more-action-dropdown">
        <f-button :type="iconOnly ? 'icon' : 'small'" size="large" variant="primary-outline" class="f-btn-icon"><i class="fal fa-ellipsis-v"></i>{{ iconOnly ? '' : $t('common.more') }}</f-button>
        <template #overlay>
            <f-menu>
                <!-- This functional module will not release on WebIap 1.0 -->
                <!--
                <a-menu-item key="0">
                    <fl-label :text="'流程模擬'" :iconClass="'fas fa-share-alt'" class="dropdown-icon-label" @click="goTo('ProcessSimulation')" />
                </a-menu-item>
                -->
                <f-menu-item key="1" v-if="status === 3">
                    <fl-label
                        :text="$t('onOffLine.offline')"
                        :iconClass="'fal fa-arrow-from-top'"
                        class="dropdown-icon-label"
                        @click="
                            type = 'offline';
                            $refs.processModal.show();
                        "
                    />
                </f-menu-item>
                <f-menu-item key="2" v-if="status === 4">
                    <fl-label
                        :text="$t('onOffLine.online')"
                        :iconClass="'fal fa-arrow-from-bottom'"
                        class="dropdown-icon-label"
                        @click="
                            type = 'online';
                            $refs.processModal.show();
                        "
                    />
                </f-menu-item>
                <f-menu-item key="3">
                    <fl-label :text="$t('router.VersionControlManagement')" :iconClass="'fal fa-layer-group'" class="dropdown-icon-label" @click="goTo('VersionControlManagement')" />
                </f-menu-item>
                <f-menu-item key="5" v-if="deleteArtEnable == true">
                    <fl-label :text="$t('artifactCar.deleteButton')" :iconClass="'fal fa-trash-alt'" class="dropdown-icon-label" @click="flModalMessage = true" />
                </f-menu-item>
            </f-menu>
        </template>
    </f-dropdown>
    <on-off-line-dialog ref="processModal" :itemProps="getItemProps" :rootProId="proId" :type="type" @after-submit="afterSubmit" />
    <teleport to="#portal-target">
        <f-confirm v-model:visible="flModalMessage" title="刪除" variant="error" :onOk="deleteArtifact">
            <template #content>
                <p class="text-center" style="white-space: pre-line">{{ $t('artifactCar.submitMessage.deleteConfirmMessage') }}</p>
                <span style="font-size: 14px; color: #e44d55">{{ proName }}</span>
            </template>
        </f-confirm>
    </teleport>
</template>
<script>
import FlLabel from '../Basic/FlLabel.vue';
import FlButton from '../Basic/FlButton.vue';
import OnOffLineDialog from '../Common/OnOffLineDialog/OnOffLineDialog.vue';
import { mapActions } from 'vuex';
import { apiSaveAnotherVersion, apiDeleteMfpArtifact } from '@/utils/api';
export default {
    name: 'MoreActionButton',
    components: { FlLabel, FlButton, OnOffLineDialog },
    props: {
        proId: {
            type: String,
            default: '',
        },
        artId: {
            type: String,
            default: '',
        },
        proName: {
            type: String,
            default: '',
        },
        itemProps: {
            type: Object,
            default: () => {
                return {};
            },
        },
        isDisabled: {
            type: Boolean,
            default: false,
        },
        iconOnly: {
            type: Boolean,
            default: true,
        },
        status: {
            type: Number,
            default: 1,
        },
        deleteArtEnable: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['afterSubmit'],
    data() {
        return {
            publicPath: process.env.BASE_URL,
            type: '',
            downloadMsg: '',
            flModalMessage: false,
        };
    },
    computed: {
        getItemProps() {
            return this.itemProps;
        },
    },
    methods: {
        ...mapActions('process', ['updateProcSelectedProId', 'updateProcSelectedArtId', 'updateProcessList']),
        goTo(target) {
            const that = this;
            that.updateProcSelectedProId(that.proId);
            that.updateProcSelectedArtId(that.artId);
            that.$router.push({ name: target });
        },
        saveAnotherVersion() {
            const that = this;
            let loader = that.$loading.show();
            apiSaveAnotherVersion(this.proId)
                .then((res) => {
                    if (res.status === 200 && res.data.code === 0) {
                        that.$message.success(that.$t('versionControl.submitMessage.saveAnotherVersionSuccess'));
                        that.updateProcessList();
                    } else {
                        that.$message.error(that.$t('versionControl.submitMessage.saveAnotherVersionError'));
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    loader.hide();
                    this.$emit('afterSubmit');
                });
        },
        afterSubmit() {
            const that = this;
            that.updateProcessList();
            this.$emit('afterSubmit');
        },
        deleteArtifact() {
            const that = this;
            that.flModalMessage = false;
            let loader = that.$loading.show();
            apiDeleteMfpArtifact(this.artId)
                .then((res) => {
                    if (res.status === 200 && res.data.code === 0) {
                        that.$message.success(that.$t('artifactCar.submitMessage.deleteArtifactSuccess'));
                        this.updateProcessList();
                    } else {
                        that.$message.error(that.$t('artifactCar.submitMessage.deleteArtifactError'));
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    loader.hide();
                    this.$emit('afterSubmit');
                });
        },
    },
};
</script>
<style lang="scss">
div.more-action-dropdown {
    background-color: #ffffff;
    box-shadow: 0px 9px 28px 8px rgba(72, 62, 114, 0.08);
    border-radius: 2px;
    border: 0;
    min-width: fit-content;
    .ant-dropdown-menu-item {
        white-space: nowrap;
        font-size: 14px;
        color: #5c6466;
        &:hover {
            background-color: rgba(241, 239, 247, 0.8) !important;
        }
        &:active {
            background-color: rgba(241, 239, 247, 0.8) !important;
        }
        .dropdown-icon-label {
            &:active {
                color: #5c6466;
            }
        }
        .fl-label-wrapper {
            color: #5c6466;
            i {
                margin-left: 0;
            }
        }
    }
}
i {
    width: 20px;
    text-align: center;
}
</style>
