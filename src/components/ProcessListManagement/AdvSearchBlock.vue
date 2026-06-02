<template>
    <!-- AdvSearchBlock -->
    <div class="advance-search-block-wrapper">
        <div class="search-body">
            <div class="search-state">
                <label>{{ $t('processInfo.type') }}</label>
                <f-checkbox :disabled="selectedType != 0 && selectedType != 1" v-model="condition.init" @update:modelValue="updateCheckboxValue($event, 'init')">
                    {{ $t('status.init') }}
                </f-checkbox>
                <f-checkbox :disabled="selectedType != 0 && selectedType != 2" v-model="condition.ready" @update:modelValue="updateCheckboxValue($event, 'ready')">
                    {{ $t('status.ready') }}
                </f-checkbox>
                <f-checkbox :disabled="selectedType != 0 && selectedType != 3" v-model="condition.running" @update:modelValue="updateCheckboxValue($event, 'running')">
                    {{ $t('status.running') }}
                </f-checkbox>
                <f-checkbox :disabled="selectedType != 0 && selectedType != 4" v-model="condition.close" @update:modelValue="updateCheckboxValue($event, 'close')">
                    {{ $t('status.close') }}
                </f-checkbox>
            </div>
            <div class="seach-other">
                <div class="search-classified">
                    <f-select show-search ref="select" size="large" style="width: 100%" v-model:value="processClassifiedItemProps.val">
                        <template #label>{{ processClassifiedItemProps.options.labelMsg }}</template>
                        <template #prefix>
                            <i class="fal fa-pause"></i>
                        </template>
                        <f-select-option v-for="item in processClassifiedItemProps.options.selectOptions" :key="item.id" :value="item.id">{{ item.name }}</f-select-option>
                    </f-select>
                    <f-select show-search ref="select" size="large" style="width: 100%" v-model:value="processOwnerItemProps.val">
                        <template #label>{{ processOwnerItemProps.options.labelMsg }}</template>
                        <template #prefix>
                            <i class="far fa-user"></i>
                        </template>
                        <f-select-option v-for="item in processOwnerItemProps.options.selectOptions" :key="item.id" :value="item.id">{{ item.name }}</f-select-option>
                    </f-select>
                    <f-select show-search ref="select" size="large" style="width: 100%" v-model:value="processOwnDepItemProps.val">
                        <template #label>{{ processOwnDepItemProps.options.labelMsg }}</template>
                        <template #prefix>
                            <i class="fal fa-building"></i>
                        </template>
                        <f-select-option v-for="item in processOwnDepItemProps.options.selectOptions" :key="item.id" :value="item.id">{{ item.name }}</f-select-option>
                    </f-select>
                </div>
                <div class="search-time-range">
                    <f-range-picker v-model:value="processEffectiveTimeItemProps.dateRange" size="large" class="w-100">
                        <template #label>{{ processEffectiveTimeItemProps.options.labelMsg }}</template>
                    </f-range-picker>
                    <f-range-picker v-model:value="processOfflineTimeItemProps.dateRange" size="large" class="w-100">
                        <template #label>{{ processOfflineTimeItemProps.options.labelMsg }}</template>
                    </f-range-picker>
                    <div class="search-footer">
                        <f-button variant="secondary-outline" size="large" @click="reset"><i class="fal fa-redo"></i>{{ $t('common.reset') }}</f-button>
                        <f-button variant="primary" size="large" @click="confirm"><i class="fal fa-check"></i>{{ $t('common.confirm') }} </f-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import FlLabelInput from '@/components/Basic/FlLabelInput.vue';
import FlCheckbox from '@/components/Basic/FlCheckbox.vue';
import FlButton from '@/components/Basic/FlButton.vue';
import FlDate from '@/components/Basic/FlDate.vue';
import { mapState, mapActions, mapGetters } from 'vuex';
export default {
    name: 'AdvSearchBlock',
    components: {
        FlLabelInput,
        FlCheckbox,
        FlButton,
        FlDate,
    },
    emits: ['onSubmit'],
    data() {
        const that = this;
        return {
            processStateItemProps: {
                options: {
                    labelMsg: that.$t('processInfo.type'),
                    type: 'slot',
                    isInline: false,
                },
            },
            processClassifiedItemProps: {
                options: {
                    labelMsg: that.$t('processInfo.category'),
                    type: 'select',
                    isUsingSearch: true,
                    isInline: false,
                    iconClass: 'fal fa-pause',
                    selectOptions: [],
                    placeholderMsg: that.$t('processInfo.placeholder.category'),
                    allowEmpty: true,
                },
                val: '分類選擇',
            },
            processOwnerItemProps: {
                options: {
                    labelMsg: that.$t('processInfo.manager'),
                    type: 'select',
                    isUsingSearch: true,
                    isInline: false,
                    iconClass: 'fal fa-user',
                    selectOptions: [],
                    placeholderMsg: that.$t('processInfo.placeholder.manager'),
                    allowEmpty: true,
                },
                val: '人員選擇',
            },
            processOwnDepItemProps: {
                options: {
                    labelMsg: that.$t('processInfo.managerDep'),
                    type: 'select',
                    isUsingSearch: true,
                    isInline: false,
                    iconClass: 'fal fa-building',
                    selectOptions: [],
                    placeholderMsg: that.$t('processInfo.placeholder.managerDep'),
                    allowEmpty: true,
                },
                val: '部門選擇',
            },
            processEffectiveTimeItemProps: {
                options: {
                    labelMsg: that.$t('processInfo.effectiveTime'),
                    type: 'slot',
                    isInline: false,
                },
                dateType: 'range',
                dateRange: [],
            },
            processOfflineTimeItemProps: {
                options: {
                    labelMsg: that.$t('processInfo.closeTime'),
                    type: 'slot',
                    isInline: false,
                },
                dateType: 'range',
                dateRange: [],
            },
            condition: {},
        };
    },
    created() {
        const that = this;
        that.condition = { ...that.getDEFAULT_CONDITION };
    },
    methods: {
        updateCheckboxValue(value, type) {
            const that = this;
            that.condition[type] = value;
        },
        updateClassified(value, propsObj, type) {
            const that = this;
            if (value === null) {
                value = [];
            }
            propsObj.val = value;
            that.condition[type] = value;
        },
        updateTime(value, propsObj, type) {
            const that = this;
            if (value[0] === null && value[1] === null) {
                value = [];
            }
            propsObj.dateRange = value;
            that.condition[type] = value;
        },
        reset() {
            const that = this;
            that.condition = { ...that.getDEFAULT_CONDITION };
            that.processClassifiedItemProps.val = '';
            that.processOwnerItemProps.val = '';
            that.processOwnDepItemProps.val = '';
            that.processEffectiveTimeItemProps.dateRange = [];
            that.processOfflineTimeItemProps.dateRange = [];
        },
        confirm() {
            const that = this;
            that.$emit('onSubmit', { ...that.condition });
        },
        getLocale() {
            const that = this;
            return that.$root.$i18n.locale;
        },
    },
    watch: {
        selectedType: {
            handler() {
                const that = this;
                that.condition = { ...that.getDEFAULT_CONDITION };
            },
        },
        processList: {
            handler(newProcessList) {
                const that = this;
                newProcessList.forEach((process) => {
                    const managers = process.manager.split(',');
                    const managerDeps = process.managerDep.split(',');
                    if (!that.processClassifiedItemProps.options.selectOptions.find((item) => item.id === process.category)) {
                        const item = {
                            id: process.category,
                            name: process.category,
                        };
                        that.processClassifiedItemProps.options.selectOptions.push(item);
                    }
                    managers.forEach((manager) => {
                        if (!that.processOwnerItemProps.options.selectOptions.find((item) => item.id === manager)) {
                            const item = {
                                id: manager,
                                name: manager,
                            };
                            that.processOwnerItemProps.options.selectOptions.push(item);
                        }
                    });
                    managerDeps.forEach((managerDep) => {
                        if (!that.processOwnDepItemProps.options.selectOptions.find((item) => item.id === managerDep)) {
                            const item = {
                                id: managerDep,
                                name: managerDep,
                            };
                            that.processOwnDepItemProps.options.selectOptions.push(item);
                        }
                    });
                });
            },
        },
    },
    computed: {
        ...mapState('process', ['processList', 'selectedType']),
        getDEFAULT_CONDITION() {
            return {
                init: this.selectedType == 1 ? true : false,
                ready: this.selectedType == 2 ? true : false,
                running: this.selectedType == 3 ? true : false,
                close: this.selectedType == 4 ? true : false,
                classified: {},
                owner: {},
                ownerDep: {},
                effectiveTime: [],
                offlineTime: [],
            };
        },
    },
};
</script>
<style lang="scss" scoped>
.advance-search-block-wrapper {
    display: flex;
    flex-direction: column;
    padding: 20px;
    .search-body {
        display: grid;
        grid-template-columns: 150px auto;
        :deep(.label-group.label-block) {
            div.label-wrapper {
                label {
                    font-size: 16px;
                    color: #5c6466;
                    font-weight: 500;
                    padding-left: 0;
                }
            }
        }
        .search-state {
            display: flex;
            flex-direction: column;
            color: #5c6466;
            label {
                font-size: 16px;
                color: #757575;
                margin-bottom: 8px;
            }
            :deep(label.f-checkbox-container) {
                margin-bottom: 12px;
            }
        }
        :deep(label.f-checkbox-container .f-checkbox-wrap) {
            input[type='checkbox'] {
                margin-right: 4px;
            }
        }
        .seach-other {
            display: grid;
            grid-template-rows: 1fr 1fr;
            grid-gap: 16px;
            .search-classified {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                grid-gap: 16px;
                :deep(.f-select-wrap-large .f-select-label) {
                    color: #757575;
                }
            }
            .search-time-range {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                grid-gap: 16px;
                align-items: flex-end;
                :deep(.f-rangepicker-wrap-large .f-rangepicker-label) {
                    color: #757575;
                }
            }
            :deep(.f-select-prefix > i) {
                color: #757575;
            }
        }
    }
    .search-footer {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        :deep(button::before) {
            margin-right: 4px;
        }
    }
}
@media (max-width: 1366px) {
    .advance-search-block-wrapper {
        padding: 20px;
    }
}
</style>
