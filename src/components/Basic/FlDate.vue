<template>
    <div class="icon-date-cmp">
        <div class="fl-date">
            <a-date-picker v-if="type === 'date'" :show-time="isShowTime" v-model:value="Moments" suffix-icon=" " :locale="getLocale" :disabled-date="disabledDate" />
            <a-range-picker v-if="type === 'range'" v-model:value="Moments" :locale="getLocale" :disabled-date="disabledDate" />
        </div>
    </div>
</template>
<script>
import moment, { Moment } from 'moment';
import localeTW from 'ant-design-vue/es/date-picker/locale/zh_TW';
import localeCN from 'ant-design-vue/es/date-picker/locale/zh_CN';
import localeEN from 'ant-design-vue/es/date-picker/locale/en_US';
import localeJP from 'ant-design-vue/es/date-picker/locale/ja_JP';

const localeList = {
    zh_TW: localeTW,
    zh_CN: localeCN,
    en: localeEN,
    ja: localeJP,
};

export default {
    name: 'FlDate',
    props: {
        type: {
            type: String,
            default: 'date',
        },
        dateValue: {
            type: String,
        },
        range: {
            type: Array,
            default: [],
        },
        format: {
            type: String,
            default: '',
        },
        isShowTime: {
            type: Boolean,
            default: false,
        },
        isCanSelectBeforeToday: {
            type: Boolean,
            default: true,
        },
    },
    emits: ['change'],
    data: function() {
        return {
            innerDateValue: this.dateValue,
            innerRange: this.range,
            innerFormat: this.format,
            disabledDate: (current) => {
                if (this.isCanSelectBeforeToday) {
                    return false;
                } else {
                    // Can not select days before today and today
                    return (
                        current &&
                        current <
                            moment()
                                .subtract(1, 'days')
                                .endOf('day')
                    );
                }
            },
            localeList: localeList,
        };
    },
    mounted() {
        const that = this;
        if (that.type === 'date') {
            that.innerFormat = that.format === '' ? 'YYYY-MM-DD HH:mm:ss' : that.format;
        } else if (that.type === 'range') {
            that.innerFormat = that.format === '' ? 'YYYY-MM-DD' : that.format;
        }
    },
    computed: {
        Moments: {
            get() {
                const that = this;
                let res = null;
                if (that.type === 'date') {
                    res = that.innerDateValue ? moment(that.innerDateValue, that.innerFormat) : null;
                } else if (that.type === 'range') {
                    let start = that.innerRange[0] ? moment(that.innerRange[0], that.innerFormat) : null;
                    let end = that.innerRange[1] ? moment(that.innerRange[1], that.innerFormat) : null;
                    res = [start, end];
                }
                console.log(res);
                return res;
            },
            set(newValue) {
                const that = this;
                if (that.type === 'date') {
                    that.innerDateValue = newValue ? newValue.format(that.innerFormat) : null;
                    this.$emit('change', that.innerDateValue);
                } else if (that.type === 'range') {
                    that.innerRange[0] = newValue[0] ? newValue[0].format(that.innerFormat) : null;
                    that.innerRange[1] = newValue[1] ? newValue[1].format(that.innerFormat) : null;
                    this.$emit('change', that.innerRange);
                }
            },
        },
        getLocale() {
            const that = this;
            return that.localeList[that.$root.$i18n.locale];
        },
    },
    watch: {
        dateValue(newValue) {
            const that = this;
            that.innerDateValue = newValue;
        },
        range(newValue) {
            const that = this;
            that.innerRange = newValue;
        },
    },
};
</script>
<style lang="scss" scoped>
.fl-date {
    :deep(.ant-calendar-picker) {
        display: flex;
        align-items: center;
        position: relative;
        &::before {
            font-family: 'Font Awesome 5 Pro';
            content: '\f073';
            margin-right: 10px;
            position: absolute;
            left: 10px;
            z-index: 5;
            color: #666666;
        }
        .ant-calendar-picker-input {
            border: 1px solid #dadce0;
            box-sizing: border-box;
            box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.016);
            border-radius: 4px;
            padding-left: 36px;
        }
    }
}
</style>
