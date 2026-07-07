<template>
    <div class="empty-state">
        <div class="empty-icon"><i :class="`ti ti-${icon}`"></i></div>
        <div class="empty-title">{{ title }}</div>
        <div v-if="hint" class="empty-hint">{{ hint }}</div>
        <slot />
    </div>
</template>

<script>
export default {
    name: 'EmptyState',
    props: {
        icon: { type: String, default: 'inbox' },
        title: { type: String, default: '沒有資料' },
        hint: { type: String, default: '' },
    },
};
</script>

<style lang="scss" scoped>
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 56px 20px;
    text-align: center;
    color: #919191;

    .empty-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #f4f4f7;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        color: #c4c0d4;
        margin-bottom: 14px;
    }
    .empty-title {
        font-size: 15px;
        font-weight: 600;
        color: #5c6466;
    }
    .empty-hint {
        font-size: 13px;
        margin-top: 4px;
    }
}
</style>
