<template>
    <div class="wrapper">
        <div class="container">
            <div class="">{{ $t('advSearch.name') }} <i class="fas fa-chevron-down" :class="{ 'fa-flip-vertical': opening }"></i></div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'FlAdvSearch',
    props: ['opening'],
    methods: {},
};
</script>
<style lang="scss" scoped>
.ad-adv-search-open {
    color: rgba(0, 112, 209, 0.8);
}
</style>
