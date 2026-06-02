<template>
    <div class="proc-card">
        <div class="proc-card-header">
            <div class="proc-name-wrapper">
                <status-img :status="processCard.type" class="status-img" />
                <span class="proc-name">{{ processCard.proName }}</span>
            </div>
            <status-badge :status="processCard.type" :open-img-icon="false" />
        </div>
        <div class="proc-card-body">
            <div class="info-card" v-for="column in columns" :key="column.key" :class="column.className" v-show="column.value !== '' || column.key !== 'closeTime'">
                <div class="info-title">{{ $t(`processInfo.${column.key}`) }}：</div>
                <div class="info-value">{{ getCurrentShowValue(column.value) }}</div>
            </div>
        </div>
        <div class="proc-card-tool-bar">
            <a-tooltip v-if="processCard.type !== undefined && processCard.type !== 3" :title="$t('common.edit')" placement="top">
                <f-button
                    variant="primary-outline"
                    size="large"
                    class="fal fa-edit f-btn-icon"
                    :disabled="isDisabledForUPProcess.edit"
                    @click="$emit('openModalEdit')"
                />
            </a-tooltip>
            <a-tooltip :title="$t('router.ConditionSetting')" placement="top" v-if="processCard.type !== undefined && processCard.type !== 3">
                <f-button
                    variant="primary-outline"
                    size="large"
                    class="fal fa-code-branch f-btn-icon"
                    :disabled="isDisabledForUPProcess.condition"
                    @click="$emit('goTo', 'ConditionSetting')"
                />
            </a-tooltip>
            <a-tooltip :title="$t('router.ProcessReview')" placement="top">
                <f-button
                    variant="primary-outline"
                    size="large"
                    class="fal fa-eye f-btn-icon"
                    :disabled="isDisabledForUPProcess.processReview"
                    @click="$emit('goTo', 'ProcessReview')"
                />
            </a-tooltip>
            <a-tooltip :title="$t('common.more')" placement="top">
                <more-action-button
                    :proId="processCard.id"
                    :proName="processCard.proName"
                    :artId="processCard.artId"
                    :itemProps="itemProps"
                    :status="processCard.type"
                    :deleteArtEnable="processCard.deleteArtEnable"
                    :isDisabled="isDisabledForUPProcess.others"
                />
            </a-tooltip>
        </div>
    </div>
</template>
<script>
import StatusBadge from '../Common/StatusBadge.vue';
import StatusImg from '../Common/StatusImg.vue';
import MoreActionButton from '../ProcessListManagement/MoreActionButton.vue';

export default {
    name: 'ProcessCard',
    components: { StatusBadge, StatusImg, MoreActionButton },
    props: {
        processCard: {},
        isDisabledForUPProcess: {},
    },
    emits: ['openModalEdit', 'openModalAuth', 'goTo'],
    data() {
        return {
            columns: [],
            itemProps: {},
        };
    },
    created() {
        this.syncColumns(this.processCard);
    },
    watch: {
        processCard: {
            handler(data) { this.syncColumns(data); },
            deep: true,
        },
    },
    methods: {
        syncColumns(data) {
            this.columns = [
                { key: 'category', value: data.category || '', className: 'in-line' },
                { key: 'manager', value: data.manager || '', className: 'in-line' },
                { key: 'managerDep', value: data.managerDep || '', className: 'in-line' },
                { key: 'effectiveTime', value: data.effectiveTime || '', className: 'in-line' },
                { key: 'closeTime', value: data.closeTime || '', className: 'in-line' },
                { key: 'desc', value: data.desc || '', className: 'fill-row' },
            ];
            this.itemProps = { version: data.version };
        },
        getCurrentShowValue(value) {
            if (!value) return '';
            const maxLen = 40;
            return value.length > maxLen ? `${value.substring(0, maxLen - 1)}...` : value;
        },
    },
};
</script>
<style lang="scss" scoped>
.proc-card {
    display: grid;
    min-width: 260px;
    flex: 1 1 280px;
    background: #ffffff;
    box-shadow: 0 5px 12px 4px rgba(204, 199, 227, 0.09), 0 3px 6px 0 rgba(204, 199, 227, 0.09), 0 1px 2px -2px rgba(204, 199, 227, 0.16);
    border-radius: 8px;
    margin-right: 16px;
    margin-bottom: 16px;
    padding: 16px;
    transition: all 0.3s;
    cursor: pointer;
    &:hover {
        transform: translateY(-8px);
        box-shadow: 0px 5px 12px 4px rgba(142, 120, 228, 0.15);
    }
    .status-img { padding-top: 5px; }
    .proc-card-header {
        display: flex;
        justify-content: space-between;
        .proc-name-wrapper {
            display: flex;
            align-items: center;
            max-width: 200px;
            .proc-name {
                margin-left: 8px;
                font-weight: 500;
                font-size: 18px;
                line-height: 24px;
                color: #333333;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                width: 100%;
            }
        }
    }
    .proc-card-body {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        .info-card {
            &.fill-row { grid-column: 1 / span 3; padding-top: 12px; }
            &.in-line { min-width: 0; white-space: nowrap; padding-top: 12px; .info-value { overflow: hidden; text-overflow: ellipsis; } }
            .info-title { font-size: 12px; color: #919191; }
            .info-value { font-size: 16px; color: #262a2b; padding-top: 8px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
        }
    }
    .proc-card-tool-bar {
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        margin-top: 8px;
        color: #6e5faf;
        :deep(button.f-btn-icon) { border: 0; margin-right: 4px; &::before { margin-right: 0; } }
        :deep(button.f-btn-icon:last-of-type) { margin-right: 0px; }
    }
}
</style>
