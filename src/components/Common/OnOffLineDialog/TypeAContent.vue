<template>
    <div class="online-dialog">
        <fl-label :text="typeMap[type].effect.title" />
        <div class="fl-radio-group">
            <f-radio v-model="picked" :value="immediate.id" @click="(...args) => onValPicked('picked', ...args)">{{ immediate.labelMsg }}</f-radio>
            <f-radio v-model="picked" :value="custom.id" @click="(...args) => onValPicked('picked', ...args)">
                {{ custom.labelMsg }}
                <f-date-picker v-model:value="dateValue" :format="'YYYY-MM-DD HH:mm'" showTime @change="updateDateValue" v-if="custom.id === picked ? true : false" />
            </f-radio>
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
    name: 'TypeAContent',
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
            picked: 'immediate',
            version: '1.0',
            content: {},
            dateValue: '',
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
        that.$emit('update', that.content);
        that.$emit('updateValidStatus', that.getIsAllValid());
        that.$nextTick(() => {
            that.$emit('onRendered');
        });
    },
    methods: {
        onValPicked(value) {
            const that = this;
            value = that.picked;
            if (value === 'custom') {
                that.content.time = that.dateValue;
            } else {
                that.content.time = '';
            }
            that.content.type = value;
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
