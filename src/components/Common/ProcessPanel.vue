<template>
    <div class="proc-info-panel">
        <div class="proc-info-title">
            <div class="badge-wrapper"><status-badge :status="processInfo.type" :open-img-icon="false" /></div>
            <div class="proc-name">{{ processInfo.proName }}</div>
        </div>
        <div class="proc-info-body">
            <div v-for="category in categoryList" :key="category.key" v-show="processInfo[category.key] !== '' || category.key !== 'closeTime'">
                <div class="proc-key">{{ $t(`processInfo.${category.key}`) }}：</div>
                <div class="proc-value">
                    {{ processInfo[category.key] }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import StatusBadge from './StatusBadge.vue';
import StatusImg from './StatusImg.vue';
const categoryList = [
    {
        key: 'category',
    },
    {
        key: 'manager',
    },
    {
        key: 'managerDep',
    },
    {
        key: 'effectiveTime',
    },
    {
        key: 'closeTime',
    },
    {
        key: 'desc',
    },
];
export default {
    name: 'ProcessPanel',
    components: { StatusBadge, StatusImg },
    props: {
        processInfo: {
            type: Object,
        },
    },
    data() {
        return {
            categoryList: categoryList,
        };
    },
};
</script>
<style lang="scss" scoped>
.proc-info-panel {
    background: #ffffff;
    box-shadow: 0px 4px 8px rgba(0, 36, 179, 0.08);
    border-radius: 16px;
    padding: 20px;
    .proc-info-title {
        display: flex;
        align-items: center;
        div {
            &.img-wrapper {
                margin-right: 12px;
                display: flex;
            }
            &.proc-name {
                font-weight: 500;
                font-size: 20px;
                line-height: 125%;
                color: #333333;
                margin-left: 12px;
            }
        }
    }
    .proc-info-body {
        display: flex;
        margin-top: 16px;
        div {
            width: 19%;
            border-left: 1px solid #dbdbdb;
            .proc-key {
                font-size: 14px;
                line-height: 24px;
                color: #757575;
                white-space: nowrap;
                margin-left: 16px;
            }
            .proc-value {
                margin-top: 4px;
                font-size: 16px;
                line-height: 22px;
                color: #262a2b;
                white-space: nowrap;
                border: none;
                margin-left: 16px;
                text-overflow: ellipsis;
                width: 80%;
                overflow: hidden;
            }
        }
        div:first-child {
            border: none;
        }
        div:last-child {
            margin-right: 0;
        }
    }
}
</style>
