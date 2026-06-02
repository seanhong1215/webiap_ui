<template>
    <div class="af-selector-div">
        <div style="width: 32px" v-if="iconClass != null"><i class="af-icon" :class="iconClass" :style="iconStyle" /></div>
        <div style="width: 16px" v-if="iconClass == null" />
        <div :style="{ width: width }">
            <div style="width: 100%;" @click="taggleMenu">
                <input style="width: 100%;" :placeholder="placeholder" :value="getOptionValue" disabled="true" v-if="!isAriaExpanded || !isUsingSearch" />
            </div>
            <input style="width: 100%;" :placeholder="'請輸入搜尋文字'" v-model="searchingText" v-if="isUsingSearch && isAriaExpanded" />
            <div style="position: relative;">
                <ul :style="{ height: getUlHeight }" v-show="isAriaExpanded">
                    <li
                        v-for="option in filteredOptions"
                        :key="option.id"
                        @click="
                            myChangeEvent($event, option.id);
                            taggleMenu();
                        "
                    >
                        {{ option.name }}
                    </li>
                </ul>
            </div>
        </div>
        <button class="af-button" @click="taggleMenu">
            <i class="fas fa-sort-down af-icon-down" v-show="!isAriaExpanded" />
            <i class="fas fa-sort-up   af-icon-up" v-show="isAriaExpanded" />
        </button>
    </div>
</template>
<script>
FlButton;
import FlButton from './FlButton.vue';

export default {
    name: 'FlSelector',
    components: {
        FlButton,
    },
    emits: ['updateSelector'],
    data: function() {
        return {
            valueInner: this.value,
            searchingText: '',
            isAriaExpanded: false,
        };
    },
    props: {
        options: {}, // [{name: '',id: ''}]
        value: {},
        placeholder: { default: '請選擇選項' },
        iconClass: {},
        iconStyle: {},
        isUsingSearch: { default: false },
        width: { default: '100%' },
        disabled: { default: false },
        itemCount: { default: 5 },
    },

    methods: {
        myChangeEvent(event, id) {
            this.valueInner = id;
            this.emitSelectOption(id);
        },
        emitSelectOption: function(value) {
            this.$emit('updateSelector', value);
        },
        taggleMenu() {
            if (this.disabled) {
                this.isAriaExpanded = false;
            } else {
                this.isAriaExpanded = !this.isAriaExpanded;
                this.searchingText = '';
            }
        },
    },
    computed: {
        getOptionValue: function() {
            let res = null;
            if (this.options !== undefined) {
                Array.from(this.options).forEach((option) => {
                    if (option.id == this.valueInner) {
                        res = option.name;
                    }
                });
            }
            return res;
        },
        filteredOptions() {
            if (this.options === undefined) {
                return;
            }
            return this.options.filter((item) => {
                if (this.searchingText == '') {
                    return true;
                }
                return item.name.indexOf(this.searchingText) > -1;
            });
        },
        getUlHeight() {
            let min = this.itemCount;
            if (this.options.length < this.itemCount) {
                min = this.options.size;
            }
            return min * 38 + 'px';
        },
    },

    watch: {
        value: {
            immediate: true,
            handler() {
                this.valueInner = this.value;
            },
        },
    },
};
</script>
<style scoped lang="scss">
.af-selector-div {
    display: flex;
    flex-direction: row;
    align-items: center;
    background: #ffffff;
    border: 1px solid #dadce0;
    box-sizing: border-box;
    box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.016);
    border-radius: 4px;
    height: 32px;
}
.af-selector-select {
    border: 0px;
    outline: 0px;
}
ul {
    background: WHITE;
    position: absolute;
    top: 5px;
    list-style-type: none;
    padding-inline-start: 0px;
    margin-top: 6px;
    box-shadow: 0px 4px 8px rgb(0 36 179 / 10%);
    z-index: 100;
    width: calc(100% + 25px);
    overflow: auto;
}

li {
    width: 100%;
    height: 38px;
    padding-left: 16px;
    padding-top: 8px;
    padding-bottom: 8px;
    &:hover {
        background: linear-gradient(0deg, #f5f5f5, #f5f5f5), #ffffff;
        color: #0070d1;
    }
}

.af-icon {
    margin-left: 10px;
}

.af-button {
    background: WHITE;
    border: none;
    height: 80%;
    margin-right: 1px;
    .af-icon-down {
        font-size: 20px;
        width: 13px;
    }
    .af-icon-up {
        font-size: 20px;
        margin-top: 5px;
        width: 13px;
    }
}
input {
    background: white;
    border: none;
}
</style>
