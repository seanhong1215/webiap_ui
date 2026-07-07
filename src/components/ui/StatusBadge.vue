<template>
    <span class="status-badge" :style="{ color: meta.color, background: meta.bg }">
        <span class="dot" :style="{ background: meta.color }"></span>
        {{ label }}
    </span>
</template>

<script>
import { computed } from 'vue';
import { PROCESS_STATUS, SUBMISSION_STATUS } from '@/constants/status';

export default {
    name: 'StatusBadge',
    props: {
        // 'process'(流程生命週期,value=type 1~4)| 'submission'(審核狀態,value=pending/approved/rejected)
        variant: { type: String, default: 'process' },
        value: { type: [Number, String], required: true },
        // 流程狀態的用語:'admin' 或 'user'
        labelSet: { type: String, default: 'admin' },
    },
    setup(props) {
        const meta = computed(() => {
            if (props.variant === 'submission') return SUBMISSION_STATUS[props.value] || {};
            return PROCESS_STATUS[props.value] || {};
        });
        const label = computed(() => {
            if (props.variant === 'submission') return meta.value.label;
            return props.labelSet === 'user' ? meta.value.userLabel : meta.value.adminLabel;
        });
        return { meta, label };
    },
};
</script>

<style lang="scss" scoped>
.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 12px;
    white-space: nowrap;

    .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
    }
}
</style>
