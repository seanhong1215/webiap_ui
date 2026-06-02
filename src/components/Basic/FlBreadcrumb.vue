<template>
    <a-breadcrumb separator=">">
        <a-breadcrumb-item v-for="(breadcrumb, index) in crumbs">
            <span v-if="index != crumbs.length - 1">
                <router-link :to="breadcrumb.to">
                    {{ $t(`router.${breadcrumb.text}`) }}
                </router-link>
            </span>
            <span v-else-if="breadcrumb.direct">
                <router-link :to="breadcrumb.direct">
                    {{ $t(`router.${breadcrumb.text}`) }}
                </router-link>
            </span>
            <span v-else>{{ $t(`router.${breadcrumb.text}`) }}</span>
        </a-breadcrumb-item>
    </a-breadcrumb>
</template>
<script>
export default {
    name: 'FlBreadcrumb',
    computed: {
        crumbs: function() {
            const that = this;
            let breadcrumbs = [];
            if (that.$route.meta) {
                let nowCrumbs = that.$route.meta.breadcrumbs ? that.$route.meta.breadcrumbs : [];
                nowCrumbs.forEach((crumbs) => {
                    breadcrumbs.push({
                        to: crumbs.link,
                        text: crumbs.name,
                    });
                });
            }
            return breadcrumbs;
        },
    },
};
</script>
<style lang="scss" scoped>
.ant-breadcrumb > span > .ant-breadcrumb-link > span {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.38);
    text-decoration: underline;
    cursor: pointer;
}
.ant-breadcrumb > span:last-child > .ant-breadcrumb-link > span {
    color: #0070d1;
    text-decoration: none;
    cursor: auto;
}
</style>
