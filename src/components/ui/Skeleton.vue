<template>
    <span class="skeleton" :style="style"></span>
</template>

<script>
export default {
    name: 'Skeleton',
    props: {
        width: { type: String, default: '100%' },
        height: { type: String, default: '14px' },
        radius: { type: String, default: '6px' },
    },
    computed: {
        style() {
            return { width: this.width, height: this.height, borderRadius: this.radius };
        },
    },
};
</script>

<style lang="scss" scoped>
.skeleton {
    display: inline-block;
    background: linear-gradient(90deg, #eef0f4 25%, #e2e5ec 37%, #eef0f4 63%);
    background-size: 400% 100%;
    animation: skeleton-shimmer 1.3s ease infinite;
}

@keyframes skeleton-shimmer {
    0% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0 50%;
    }
}

@media (prefers-reduced-motion: reduce) {
    .skeleton {
        animation: none;
    }
}
</style>
