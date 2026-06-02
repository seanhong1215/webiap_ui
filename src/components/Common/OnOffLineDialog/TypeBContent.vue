<template>
    <div class="offline-dialog">
        <fl-label :text="typeMap[type].effect.title" />
        <div class="fl-radio-group">
            <f-radio v-model="effectPicked" :value="immediate.id" @click="(...args) => onValPicked('effectPicked', ...args)">{{ immediate.labelMsg }}</f-radio>
            <f-radio v-model="effectPicked" :value="custom.id" @click="(...args) => onValPicked('effectPicked', ...args)">
                {{ custom.labelMsg }}
                <f-date-picker v-model:value="dateValue" :format="'YYYY-MM-DD HH:mm'" showTime @change="updateDateValue" v-if="custom.id === effectPicked ? true : false" />
            </f-radio>
        </div>
        <fl-label :text="typeMap[type].processWay.title" />
        <div class="fl-radio-group">
            <f-radio v-model="processWayPicked" :value="keep.id" @click="onValPicked('processWayPicked', ...args)">{{ keep.labelMsg }}</f-radio>
        </div>
        <template v-if="showVersion">
            <fl-label :text="$t('onOffLine.processVersionInfo')" />
            <div class="announce-version">{{ $t('onOffLine.nowVersionIs') }} V{{ version }}</div>
        </template>
    </div>
</template>
<script>
import typeMap from './typeMap.js';
import FlLabel from '../../Basic/FlLabel.vue';
let typeMapper = null;
export default {
    name: 'TypeBContent',
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
                labelMsg: typeMapper[that.type].effect.immediate,
                name: 'effectTime',
                value: 'immediate',
            },
            custom: {
                id: 'custom',
                labelMsg: typeMapper[that.type].effect.custom,
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
            showVersion: false,
            typeMap: typeMapper,
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
.announce-version {
    margin-top: 16px;
    margin-bottom: 32px;
    padding-left: 32px;
    font-size: 14px;
    line-height: 140%;
    color: #5c6466;
}
</style>
