<template>
    <div>
        <div class="copy-title">{{ title }}</div>
        <fl-panel :containerStyle="allStyle.containerStyle" :headerStyle="allStyle.headerStyle">
            <!-- 標題區塊 -->
            <template v-slot:header="">
                <div class="copy-header-wrap">
                    <div class="">{{ $t('conditionSetting.conditionName') }}</div>
                    <div class="">{{ $t('ruleSetting.ruleName') }}</div>
                </div>
            </template>
            <!-- 內容區塊 -->
            <template v-slot:body="">
                <div class="copy-body-wrap">
                    <div class="copy-body-content">
                        <div v-for="(condition, index) in innerValue.conditions" :key="index">
                            <div class="copy-condition" :class="{ active: index == innerValue.activeConditionIndex }" :id="condition.id" @click="selectedCondition(condition, index)">
                                <span>{{ condition.value }}</span>
                                <span class="fas fa-angle-right"></span>
                            </div>
                        </div>
                    </div>
                    <div class="vertical-line"></div>
                    <div class="copy-body-content">
                        <div v-for="(rule, index) in innerValue.rules" :key="index">
                            <div class="copy-rule" :class="{ active: index == innerValue.activeRuleIndex }" @click="selectedRule(rule, index)">
                                <span>{{ rule.value }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </fl-panel>
    </div>
</template>
<script>
import FlModal from '@/components/Basic/FlModal';
import FlPanel from '@/components/Basic/FlPanel';
export default {
    components: {
        FlModal,
        FlPanel,
    },
    props: {
        title: {
            type: String,
            default: '',
        },
        /** Copy Setting
         * conditions：Condition Data Array
         * activeConditionIndex：Selected Condition Index
         * rules：Rule Data Array
         * selectedRule：Selected Rule Object
         * activeRuleIndex：Selected Rule Index
         */
        value: {
            default: function() {
                return {
                    conditions: [],
                    activeConditionIndex: -1,
                    rules: [],
                    selectedRule: {},
                    activeRuleIndex: -1,
                };
            },
        },
    },
    emits: ['selectedCondition', 'selectedRule'],
    data() {
        return {
            allStyle: {
                containerStyle: {
                    minHeight: '343px',
                    border: '1px solid rgba(196, 196, 196, 0.5)',
                },
                headerStyle: {
                    height: '32px',
                    padding: '5px 0px',
                },
            },
            innerValue: this.value,
        };
    },
    methods: {
        selectedCondition(condition, index) {
            let that = this;
            that.innerValue.activeConditionIndex = index;
            that.$emit('selectedCondition', condition, index);
        },
        selectedRule(rule, index) {
            let that = this;
            that.innerValue.activeRuleIndex = index;
            that.innerValue.selectedRule = rule;
            that.$emit('selectedRule', rule, index);
        },
    },
};
</script>
<style lang="scss" scoped>
// 複製設定
.copy-title {
    font-size: 16px;
    line-height: 100%;
    color: rgba(51, 51, 51, 0.87);
    margin-left: 3px;
}
.copy-header-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 100%;
}
.copy-body-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 100%;
    min-height: 311px;
    .copy-body-content {
        flex: 1;
        margin: 12px 0px;
        max-height: 287px;
        overflow-y: auto;
        .copy-condition,
        .copy-rule {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            align-items: center;
            padding: 5px 28px;
            &:hover {
                background: #e6f1ff;
                cursor: pointer;
            }
            &.active {
                background: #e6f1ff;
                span {
                    &:first-child {
                        color: #1484e5;
                    }
                }
            }
            span {
                &:first-child {
                    padding-right: 18px;
                }
            }
        }
    }
    .vertical-line {
        width: 1px;
        background: rgba(196, 196, 196, 0.5);
    }
}
</style>
