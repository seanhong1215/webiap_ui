<template>
    <div class="stat-card" :class="{ clickable, active }">
        <div class="stat-icon" :style="{ background: bg }">
            <i :class="`ti ti-${icon}`" :style="{ color }"></i>
        </div>
        <div class="stat-body">
            <div class="stat-value" :style="valueColor ? { color } : null">{{ value }}</div>
            <div class="stat-label">{{ label }}</div>
        </div>
        <div v-if="clickable" class="stat-arrow"><i class="ti ti-chevron-right"></i></div>
    </div>
</template>

<script>
export default {
    name: 'StatCard',
    props: {
        value: { type: [Number, String], required: true },
        label: { type: String, required: true },
        icon: { type: String, required: true }, // Tabler 名稱(不含 ti- 前綴)
        color: { type: String, default: '#6e5faf' },
        bg: { type: String, default: '#f0eeff' },
        clickable: { type: Boolean, default: false },
        active: { type: Boolean, default: false },
        valueColor: { type: Boolean, default: false }, // 數字是否套用主色
    },
};
</script>

<style lang="scss" scoped>
.stat-card {
    background: #fff;
    border: 1.5px solid #eaecf0;
    border-radius: 14px;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition:
        transform 0.18s,
        box-shadow 0.18s,
        border-color 0.18s;

    &.clickable {
        cursor: pointer;
        &:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(110, 95, 175, 0.12);
            border-color: #d9d3f0;
        }
    }
    &.active {
        border-color: #6e5faf;
        box-shadow: 0 0 0 3px rgba(110, 95, 175, 0.12);
    }

    .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        flex-shrink: 0;
    }
    .stat-body {
        flex: 1;
        min-width: 0;
    }
    .stat-value {
        font-size: 26px;
        font-weight: 700;
        color: #222;
        line-height: 1.1;
    }
    .stat-label {
        font-size: 13px;
        color: #919191;
        margin-top: 2px;
    }
    .stat-arrow {
        color: #d0d0d8;
        font-size: 14px;
    }
}
</style>
