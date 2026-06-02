<template>
    <div class="fl-state">
        <div class="fl-row fl-stateinfo" :class="{ disabled: isUPProcess }" @mouseover="stateInfoHover = true" @mouseleave="stateInfoHover = false">
            <div class="fl-row" style="width: 80%">
                <div class="fl-drag fl-title-icon" v-show="!isUPProcess">
                    <i class="fal fa-arrows"></i>
                </div>
                <f-checkbox v-show="!isUPProcess" v-model="stateInner.selected" :width="'16px'" @update:modelValue="updateCheckboxValue($event)" />
                <span v-show="!isNameEditing" class="name">{{ stateInner.name }}</span>
                <f-input
                    ref="stateNameEditor"
                    v-show="isNameEditing"
                    @input="onInputUpdateName($event)"
                    :isDisabled="isUPProcess"
                    @keyup.enter="onInputUpdateNameFinish"
                    style="width: 50%"
                    class="name-edit"
                    :itemProps="itemPropsInput"
                />
                <div class="fl-edit fl-title-icon" @click="isNameEditing = true" v-show="!isUPProcess"><i class="fal fa-edit" /></div>
            </div>
            <div style="width: 20%; display: flex; justify-content: flex-end">
                <span class="fl-more-icon" @click="showConditionPanel = !showConditionPanel" :class="{ 'fa-rotate-270': !showConditionPanel }"><i class="fal fa-chevron-down" /></span>
            </div>
        </div>
        <transition :style="{ '--height': computedHeight }">
            <div v-show="showConditionPanel" class="fl-conditions" ref="stateContent" @scroll="doPositionFix">
                <div class="fl-row fl-condition" v-for="(condition, index) in stateInner.conditions" :key="index">
                    <div class="index">
                        <span class="fl-item">{{ index + 1 }}</span>
                    </div>
                    <f-select
                        v-show="isFirstCondition(index)"
                        style="width: 185px"
                        ref="select"
                        v-model:value="condition.relationship"
                        :placeholder="$t('conditionSetting.placeholder.relationship')"
                        :show-labels="false"
                        :allow-empty="false"
                        track-by="name"
                        label="name"
                        @change="(...args) => updateSelectorValue(...args, index, 'relationship')"
                    >
                        <f-select-option v-for="item in relationshipItems" :key="item.id" :value="item.id">{{ item.name }}</f-select-option>
                    </f-select>
                    <f-select
                        show-search
                        ref="select"
                        style="width: 185px"
                        v-model:value="condition.item"
                        :placeholder="$t('conditionSetting.placeholder.itemType')"
                        :show-labels="false"
                        :allow-empty="false"
                        track-by="name"
                        label="name"
                        @change="(...args) => updateSelectorValue(...args, index, 'item')"
                        :disabled="isUPProcess"
                    >
                        <f-select-option v-for="item in processItems" :key="item.id" :value="item.id">{{ item.name }}</f-select-option>
                    </f-select>
                    <f-select
                        ref="select"
                        style="width: 185px"
                        v-model:value="condition.operation"
                        :placeholder="$t('conditionSetting.placeholder.operation')"
                        :show-labels="false"
                        :allow-empty="false"
                        track-by="name"
                        label="name"
                        @change="(...args) => updateSelectorValue(...args, index, 'operation')"
                        :disabled="isUPProcess"
                    >
                        <f-select-option v-for="item in operatorItems" :key="item.id" :value="item.id">{{ item.name }}</f-select-option>
                    </f-select>
                    <f-input
                        style="width: 100%"
                        v-model="condition.condition"
                        :placeholder="$t('conditionSetting.placeholder.equalsHold')"
                        @input="updateLabelInput($event, index)"
                        :isDisabled="isUPProcess"
                        :itemProps="itemPropsInput"
                    />
                    <div class="fl-item-add" @click="addCondition(index)" v-show="!isUPProcess"><i class="fal fa-plus-square" /></div>
                    <div class="fl-item-add" @click="removeCondition(index)" v-show="!isUPProcess"><i class="fal fa-minus-square" /></div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
// basic components
import FlCheckbox from '@/components/Basic/FlCheckbox.vue';
import FlButton from '@/components/Basic/FlButton.vue';
import FlMultiselect from '@/components/Basic/FlMultiselect.vue';
import FlLabelInput from '@/components/Basic/FlLabelInput.vue';
import { nextTick } from 'vue';
class CustomSelect {
    constructor(targetEl, container) {
        this.targetEl = targetEl;
        this.container = container;
        this.arrow = targetEl.getElementsByClassName('multiselect__select')[0];
        this.list = targetEl.getElementsByClassName('multiselect__content-wrapper')[0];
        this.isInActive = targetEl.className.includes('multiselect--active');
        this.targetEl.style.position = 'static';
    }
    resetArrowCurrentPosition() {
        const arrowTop = this.targetEl.offsetTop - this.container.scrollTop;
        const arrowLeft = this.targetEl.offsetLeft + this.targetEl.offsetWidth - this.arrow.offsetWidth - 1;
        this.arrow.style.top = `${arrowTop}px`;
        this.arrow.style.left = `${arrowLeft}px`;
    }
    resetListCurrentPosition() {
        const left = this.targetEl.offsetLeft;
        let complementTop = this.targetEl.offsetTop - this.container.scrollTop;
        let menuHeight = this.list.getElementsByClassName('multiselect__content')[0].offsetHeight;
        let menuMaxHeight = this.list.style['max-height'];
        menuMaxHeight = parseInt(menuMaxHeight.substring(0, menuMaxHeight.indexOf('px')), 10);
        menuHeight = menuHeight > menuMaxHeight ? menuMaxHeight : menuHeight;
        if (menuHeight > 0) {
            this.list.style.height = `${menuHeight}px`;
        }
        if (this.targetEl.className.includes('multiselect--above')) {
            complementTop -= menuHeight;
        } else {
            complementTop += this.targetEl.offsetHeight;
        }
        this.list.style.top = `${complementTop}px`;
        this.list.style.left = `${left}px`;
    }
    resetSelecRelativeObjectVisibility() {
        const viewTop = this.container.offsetTop + this.container.scrollTop;
        const viewBottom = viewTop + this.container.offsetHeight;
        const elemTop = this.targetEl.offsetTop;
        const elemBottom = this.targetEl.offsetTop + this.targetEl.offsetHeight;
        const objs = [this.arrow];
        if (this.isInActive) {
            objs.push(this.list);
        }
        if (elemBottom <= viewBottom && elemTop >= viewTop) {
            objs.forEach((obj) => (obj.style.display = 'block'));
        } else {
            objs.forEach((obj) => (obj.style.display = 'none'));
        }
    }
    setListCurrentWidth() {
        this.list.style.width = `${this.targetEl.offsetWidth}px`;
    }
    listHide() {
        this.list.style.visibility = 'hidden';
    }
    listShow() {
        this.list.style.visibility = 'visible';
    }
}
export default {
    name: 'State',
    components: {
        FlCheckbox,
        FlButton,
        FlMultiselect,
        FlLabelInput,
    },
    props: {
        state: { default: {} },
        index: { default: 0 },
        processItems: {},
        isDisabled: {},
        itemProps: {},
    },
    data() {
        const that = this;
        const relationshipItems = [
            {
                name: `${that.$t('common.and1')}( && )`,
                id: '&&',
            },
            {
                name: `${that.$t('common.or1')}( || )`,
                id: '||',
            },
        ];
        const operatorItems = [
            {
                name: '==',
                id: '==',
            },
            {
                name: '>=',
                id: '>=',
            },
            {
                name: '<=',
                id: '<=',
            },
            {
                name: '>',
                id: '>',
            },
            {
                name: '<',
                id: '<',
            },
            {
                name: '!=',
                id: '!=',
            },
        ];
        return {
            isNameEditing: false,
            stateInfoHover: false,
            stateInner: this.state,
            tempData: {},
            showConditionPanel: true,
            operatorItems: operatorItems,
            relationshipItems: relationshipItems,
            selectAllStyle: {
                divStyle: {
                    width: '184px',
                    height: '32px',
                },
                selectStyle: {
                    width: '140px',
                },
            },
            computedHeight: 'auto',
            itemPropsInput: {
                options: {
                    labelMsg: '',
                    focusOnUpdate: true,
                    maxInputLength: 30,
                },
                val: this.state.name,
            },
        };
    },
    emits: ['updateState'],
    methods: {
        getDisabledUnuse(mfpId) {
            if (mfpId == 'MFP00001647847574451') {
                return true;
            }
            return false;
        },
        updateCheckboxValue(boo) {
            this.stateInner.selected = boo;
        },
        updateState() {
            this.$emit('updateState', this.stateInner);
        },
        isFirstCondition(index) {
            return index != 0;
        },
        updateSelectorValue(value, option, index, type) {
            this.stateInner.conditions[index][type] = value;
            this.updateState();
        },
        updateLabelInput(val, index) {
            this.stateInner.conditions[index]['condition'] = val;
            this.updateState();
        },
        addCondition(index) {
            const that = this;
            that.stateInner.conditions.splice(index + 1, 0, that.getEmptyCondition());
            that.initHeight();
            console.log('addCondition');
            nextTick(() => {
                that.$refs.stateContent.querySelectorAll('.ant-select').forEach((targetEl) => {
                    const customSelect = new CustomSelect(targetEl, that.$refs.stateContent);
                    customSelect.setListCurrentWidth();
                    customSelect.resetArrowCurrentPosition();
                    customSelect.resetListCurrentPosition();
                });
            });
            that.updateState();
        },
        removeCondition(index) {
            if (this.stateInner.conditions.length == 1) {
                this.stateInner.conditions[0] = this.getEmptyCondition();
            } else {
                this.stateInner.conditions.splice(index, 1);
            }
            this.initHeight();
            console.log('removeCondition');
            this.updateState();
        },
        getEmptyCondition() {
            return {
                relationship: '',
                item: '',
                operation: '',
                condition: '',
            };
        },
        onInputUpdateName(val) {
            this.stateInner.name = val;
        },
        onInputUpdateNameFinish() {
            const that = this;

            if (that.stateInner.name == '') {
                that.stateInner.name = that.$t('conditionSetting.unnamed');
            }
            that.checkNameLength();
            that.isNameEditing = false;
            this.updateState();
        },
        initHeight() {
            const lg = this.stateInner.conditions.length;
            const height = 12 + lg * 46 + 20 + 'px';
            this.computedHeight = height;
        },
        updateStateInnerObj() {
            const that = this;
            for (let i = 0; i < that.stateInner.conditions.length; i++) {
                const condition = that.stateInner.conditions[i];
                condition.relationshipObj = that.relationshipItems.find((x) => x.id === condition.relationship);
                condition.itemObj = that.processItems.find((x) => x.id === condition.item);
                condition.operationObj = that.operatorItems.find((x) => x.id === condition.operation);
                console.log(condition);
            }
        },
        onMultiSelectClick(event) {
            const that = this;
            const targetEl = event.currentTarget;
            if (targetEl.className.includes('div.ant-select.ant-select-focused')) {
                const customSelect = new CustomSelect(targetEl, that.$refs.stateContent);
                customSelect.resetArrowCurrentPosition();
                customSelect.listHide();
                customSelect.resetListCurrentPosition();
                customSelect.listShow();
            }
        },
        doPositionFix() {
            const that = this;
            nextTick(() => {
                that.$refs.stateContent.querySelectorAll('.ant-select').forEach((targetEl) => {
                    const customSelect = new CustomSelect(targetEl, that.$refs.stateContent);
                    customSelect.resetArrowCurrentPosition();
                    customSelect.resetListCurrentPosition();
                    customSelect.resetSelecRelativeObjectVisibility();
                });
            });
        },
        checkNameLength() {
            const that = this;
            const lengthLimit = 30;
            if (that.stateInner.name.length > lengthLimit) {
                that.$message.warn(that.$t('conditionSetting.submitMessage.nameLimit'));
                that.stateInner.name = that.stateInner.name.substring(0, lengthLimit);
            }
        },
    },
    computed: {
        isUPProcess() { return false; },
    },
    updated() {
        const that = this;
        nextTick(() => {
            that.$refs.stateContent.querySelectorAll('.ant-select').forEach((targetEl) => {
                const customSelect = new CustomSelect(targetEl, that.$refs.stateContent);
                customSelect.resetArrowCurrentPosition();
                customSelect.setListCurrentWidth();
            });
        });
        console.log('state updated');
    },
    watch: {
        stateInner: {
            immediate: true,
            handler() {
                const that = this;
                that.updateState();
            },
        },
        state: {
            immediate: true,
            handler() {
                const that = this;
                that.stateInner = that.state;
                that.updateStateInnerObj();
            },
        },
    },
    created() {
        const that = this;
        that.updateStateInnerObj();
    },
    mounted: function () {
        this.initHeight();
    },
};
</script>
<style scoped lang="scss">
.fl-state {
    background: #ffffff;
    box-shadow: 0px 4px 8px rgba(72, 62, 114, 0.1);
    border-radius: 8px;
    margin-bottom: 20px;
    .fl-stateinfo {
        justify-content: space-between;
        background: rgba(245, 245, 245, 0.8);
        padding: 8px 20px;
        border-radius: 8px 8px 0px 0px;
        > div {
            display: flex;
            align-items: center;
        }
        .fl-title-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 40px;
            &.fl-drag {
                width: 24px;
                margin-right: 16px;
                color: #757575;
            }
            &.fl-chevron {
                width: 24px;
                margin-right: 16px;
                &:hover {
                    cursor: pointer;
                }
            }
            &.fl-edit {
                width: 40px;
                height: 40px;
                color: rgba(110, 95, 175, 0.8);
                font-size: 16px;
                &:hover {
                    cursor: pointer;
                    color: rgba(110, 95, 175, 1);
                }
                &:active {
                    cursor: pointer;
                    color: rgba(110, 95, 175, 1);
                }
            }
        }
        .name {
            margin-left: 16px;
            line-height: 1.5;
            font-weight: 500;
            font-size: 16px;
            color: #5c6466;
            cursor: default;
        }
        .name-edit {
            margin-left: 12px;
            margin-right: 4px;
            &:hover {
                cursor: pointer;
            }
        }
        .rulesetting {
            color: #6e5faf;
            display: flex;
            align-items: center;
            line-height: 32px;
            font-size: 16px;
            text-decoration: underline;
            &:hover {
                cursor: pointer;
            }
        }
        .rulesetting::after {
            content: '';
            display: inline-block;
            width: 1px;
            height: 30px;
            margin: 0 16px;
            background-color: #c4c4c4;
        }
        span > i {
            color: #757575;
        }
        .fl-more-icon {
            cursor: pointer;
        }
    }
    .fl-conditions {
        padding: 20px 16px;
        .fl-condition {
            align-items: center;
            gap: 16px;
            margin-bottom: 16px;
            .index {
                font-size: 14px;
                color: #262a2b;
            }
            .fl-item-add {
                align-content: center;
                justify-content: center;
                display: grid;
                color: rgba(110, 95, 175, 0.8);
                font-size: 20px;
                &:hover {
                    cursor: pointer;
                    color: rgba(110, 95, 175, 1);
                }
                &:active {
                    color: rgba(110, 95, 175, 1);
                    cursor: pointer;
                }
            }
        }
    }
}

:deep(.f-checkbox-container:not(:last-child)) {
    margin: 0;
}

div.fl-stateinfo {
    cursor: grab;
    &.disabled {
        cursor: default;
    }
    .fl-dragging {
        cursor: pointer !important;
    }
}

.fl-row {
    display: flex;
    flex-direction: row;
}

.v-enter-active,
.v-leave-active {
    transition: height 500ms ease;
    overflow: hidden;
}
.v-enter-from,
.v-leave-to {
    height: 0px;
}
.v-enter-to,
.v-leave-from {
    height: var(--height);
}
</style>
