<template>
    <div class="modify-dialog">
        <fl-label :text="$t('onOffLine.setEffectiveTime')" />
        <div class="fl-label-content">
            <div class="effect-group-wrap">
                <span>{{ oldTimeLabelInputItemProps.options.labelMsg }}</span>
                <span class="fl-text">{{ oldEffectTime }}</span>
            </div>
            <div class="effect-group-wrap">
                <span>{{ effectLabelInputItemProps.options.labelMsg }}</span>
                <span class="fl-radio-effect-group">
                    <f-radio v-model="effectPicked" :value="immediate.id" @click="(...args) => onValPicked('effectPicked', ...args)">{{ immediate.labelMsg }}</f-radio>
                    <f-radio v-model="effectPicked" :value="notnow.id" @click="(...args) => onValPicked('effectPicked', ...args)">{{ notnow.labelMsg }}</f-radio>
                    <f-radio v-model="effectPicked" :value="custom.id" @click="(...args) => onValPicked('effectPicked', ...args)">
                        {{ custom.labelMsg }}
                        <f-date-picker v-model:value="dateValue" :format="'YYYY-MM-DD HH:mm'" showTime @change="updateDateValue" v-if="custom.id === effectPicked ? true : false" />
                    </f-radio>
                </span>
            </div>
        </div>
        <fl-label :text="$t('onOffLine.chooseNewProcessWay')" />
        <div class="fl-radio-group">
            <f-radio v-model="processWayPicked" :value="keep.id" @click="(...args) => onValPicked('processWayPicked', ...args)">{{ keep.labelMsg }}</f-radio>
        </div>
        <fl-label :text="$t('onOffLine.processVersionInfo')" />
        <div class="announce-version">{{ $t('onOffLine.nowVersionIs') }} {{ version }}</div>
    </div>
</template>
<script>
import typeMap from './typeMap.js';
import FlLabel from '../../Basic/FlLabel.vue';
let typeMapper = null;
export default {
    name: 'TypeCContent',
    components: {
        FlLabel,
    },
    props: {
        itemProps: {
            type: Object,
            default: () => {
                return {};
            },
        },
        type: {
            type: String,
            default: 'online',
        },
    },
    emits: ['update', 'updateValidStatus', 'onRendered'],
    data() {
        const that = this;
        return {
            immediate: {
                id: 'immediate',
                labelMsg: that.$t('onOffLine.immediateRelease'),
                name: 'effectTime',
                value: 'immediate',
            },
            notnow: {
                id: 'notnow',
                labelMsg: that.$t('onOffLine.notNow'),
                name: 'effectTime',
                value: 'notnow',
            },
            custom: {
                id: 'custom',
                labelMsg: that.$t('onOffLine.customRelease'),
                name: 'effectTime',
                value: 'custom',
            },
            keep: {
                id: 'keep',
                labelMsg: that.$t('onOffLine.keepProcessWay'),
                name: 'processWay',
                value: 'keep',
            },
            restart: {
                id: 'restart',
                labelMsg: that.$t('onOffLine.restartProcessWay'),
                name: 'processWay',
                value: 'restart',
            },
            effectPicked: 'immediate',
            processWayPicked: 'keep',
            version: '1.0',
            content: {},
            dateValue: '',
            typeMap: typeMapper,
            oldTimeLabelInputItemProps: {
                options: {
                    labelMsg: that.$t('onOffLine.oldReleaseTime'),
                    type: 'slot',
                },
            },
            effectLabelInputItemProps: {
                options: {
                    labelMsg: that.$t('onOffLine.newReleaseTime'),
                    type: 'slot',
                },
            },
            oldEffectTime: '2021-12-28 00:00:00',
        };
    },
    beforeCreate() {
        const that = this;
        typeMapper = typeMap(that);
    },
    created() {
        const that = this;
        if (that.itemProps.version) {
            that.version = that.itemProps.version;
        }
        if (that.itemProps.effectiveTime) {
            that.oldEffectTime = that.itemProps.effectiveTime;
        }
        that.content.type = 'immediate';
        that.content.itemProps = that.itemProps;
        that.content.processWayType = 'keep';
        that.$emit('update', that.content);
        that.$emit('updateValidStatus', that.getIsAllValid());
        that.$nextTick(() => {
            that.$emit('onRendered');
        });
    },
    methods: {
        onValPicked(pickTarget, value) {
            const that = this;
            if (pickTarget === 'effectPicked') {
                value = that.effectPicked;
                if (value === 'custom') {
                    that.content.time = that.dateValue;
                } else {
                    that.content.time = '';
                }
                that.content.type = value;
            } else {
                that.processWayPicked = value;
                that.content.processWayType = value;
            }
            that.content.itemProps = that.itemProps;
            that.$emit('update', that.content);
            that.$emit('updateValidStatus', that.getIsAllValid());
        },
        updateDateValue(value) {
            const that = this;
            that.dateValue = value;
            that.content.time = that.dateValue;
            that.$emit('update', that.content);
            that.$emit('updateValidStatus', that.getIsAllValid());
        },
        getIsAllValid() {
            const that = this;
            let status = true;
            if (that.content.type === 'custom' && (!that.content.time || that.content.time === '')) {
                status = false;
            }
            return status;
        },
    },
};
</script>
<style lang="scss" scoped>
:deep(.fl-radio-group) {
    margin-top: 16px;
    margin-bottom: 32px;
    .f-radio-container {
        display: block;
    }
    .f-radio-wrap {
        padding-left: 32px;
        & + .f-radio-wrap {
            margin-top: 8px;
        }
        .f-datepicker-wrap-default {
            margin-left: 10px;
        }
    }
}
.fl-label-content {
    margin-bottom: 20px;
    .effect-group-wrap {
        display: flex;
        padding-top: 8px;
        padding-left: 32px;
        span:first-child {
            margin-right: 4px;
        }
        .fl-text {
            font-size: 14px;
            color: #a7afb2;
        }
        .fl-radio-effect-group {
            display: inline-block;
            width: 80%;
            :deep(label) {
                margin-bottom: 0;
            }
            :deep(.f-datepicker-wrap-default) {
                margin-left: 8px;
            }
        }
        :deep(.f-radio-container:nth-child(2)) {
            margin-left: 20px;
        }
        :deep(.f-radio-container:last-child) {
            display: grid;
            width: 100%;
            margin-top: 8px;
        }
    }
}
.announce-version {
    margin-top: 16px;
    margin-bottom: 20px;
    padding-left: 32px;
    font-size: 14px;
    line-height: 140%;
    color: rgba(51, 51, 51, 0.87);
}
</style>
