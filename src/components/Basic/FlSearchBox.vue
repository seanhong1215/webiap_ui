<template>
    <div class="fl-search-box">
        <input type="text" class="fl-search-input" :placeholder="placeholder" v-model="keyWords" @keyup.enter="doSearch" />
        <fl-button :iconClass="'fas fa-times'" :type="'icon'" class="input-clear" @click="clearInput" />
        <button type="button" class="btn-search" @click="doSearch">
            <i class="fas fa-search"></i>
            <span>{{ $t('common.search') }}</span>
        </button>
    </div>
</template>
<script>
import FlButton from './FlButton.vue';
export default {
    name: 'SearchBox',
    props: {
        placeholder: {
            type: String,
            default: '搜索流程',
        },
    },
    components: {
        FlButton,
    },
    data() {
        return {
            keyWords: '',
        };
    },
    methods: {
        clearInput() {
            this.keyWords = '';
        },
        doSearch() {
            this.$emit('onSearchActive', this.keyWords);
        },
    },
};
</script>
<style scoped lang="scss">
.fl-search-box {
    position: relative;
    width: 100%;
    &:focus-within {
        button.input-clear {
            display: block;
        }
    }
    input {
        width: 100%;
        background: #ffffff;
        border: 1px solid rgba(196, 196, 196, 1);
        border-radius: 8px;
        padding: 8px 130px 8px 20px;
        height: 40px;
        font-size: 16px;
        &:focus-visible {
            outline: none;
            border-color: rgba(241, 239, 247, 0.8);
            box-shadow: 0px 0px 0px 4px rgba(110, 95, 175, 0.1)
        }
    }
    button {
        position: absolute;
        &.btn-search {
            font-size: 18px;
            color: rgba(51, 51, 51, 0.8);
            top: 3px;
            right: 3px;
            bottom: 3px;
            padding: 8px 20px 8px 15px;
            background: rgba(241, 239, 247, 0.8);
            border-radius: 0 6px 6px 0;
            border: 0;
            display: flex;
            &:active {
                background-color: #b6d8f6;
            }
            i {
                margin-right: 7.68px;
            }
            span {
                line-height: 1;
            }
        }
        &.input-clear {
            display: none;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 118px;
            cursor: pointer;
            font-size: 14px;
            color: #fff;
            width: 20px;
            height: 20px;
            background: #C4C4C4;
            border: 1px solid #c4c4c4;
            :deep(.icon-block) {
                display: block;
                margin: 0 auto;
                line-height: 1;
                width: 16px;
                height: 16px; 
                i {
                    width: 14px;
                    height: 14px;
                }
            }
        }
    }
}
</style>
