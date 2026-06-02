<template>
    <img :class="`status-img-${statusMap[status]}`" :src="`${publicPath}img/status/${statusMap[status]}.svg`" />
</template>
<script>
import statusMap from '../../store/statusMap.js';
export default {
    name: 'StatusImg',
    props: {
        status: {
            type: Number,
            default: 1,
        },
    },
    data() {
        return {
            statusMap: statusMap,
            publicPath: process.env.BASE_URL,
        };
    },
};
</script>
<style lang="scss" scoped>
.status-img {
    &-init {
        filter: drop-shadow(0px 4px 4px rgba(255, 224, 224, 0.8));
    }
    &-ready {
        filter: drop-shadow(0px 4px 4px rgba(51, 51, 51, 0.2));
    }
    &-running {
        filter: drop-shadow(0px 4px 4px rgba(0, 112, 209, 0.2));
    }
    &-close {
        filter: drop-shadow(0px 4px 4px rgba(153, 153, 153, 0.2));
    }
}
</style>
