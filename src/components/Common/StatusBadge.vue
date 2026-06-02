<template>
    <div class="fl-badge" :class="`status-${statusMap[status]}`">
        <status-img :status="status" v-if="openImgIcon" />
        <span>{{ $t(`status.${statusMap[status]}`) }}</span>
    </div>
</template>
<script>
import statusMap from '../../store/statusMap.js';
import StatusImg from './StatusImg.vue';
export default {
    name: 'StatusBadge',
    components: { StatusImg },
    props: {
        status: {
            type: Number,
            default: 1,
        },
        openImgIcon: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            statusMap: statusMap,
        };
    },
};
</script>
<style lang="scss" scoped>
.fl-badge {
    font-size: 12px;
    padding: 3px 12px;
    width: 60px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: min-content;
    &.status-init {
        background: #ebc0a0;
        color: #fff;
    }
    &.status-ready {
        background: #eed49d;
        color: #fff;
    }
    &.status-running {
        background: #a4d0d9;
        color: #fff;
    }
    &.status-close {
        background: #c4c4c4;
        color: #fff;
    }
}
</style>
