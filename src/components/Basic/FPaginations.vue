<template>
    <div :class="['f-page-wrap', { 'only-page-nav': isOnlyPageNav }]">
        <div v-if="!isOnlyPageNav" class="f-page-size">
            <span>{{ getLangName('show') }}</span>
            <select
                class="f-page-size-select"
                :value="pageSize"
                @change="
                    pageSize = Number($event.target.value);
                    nowPageNum = 1;
                "
            >
                <option v-for="pageSizeOption in pageSizeMenu" :value="pageSizeOption" :key="pageSizeOption">
                    {{ pageSizeOption }}
                </option>
            </select>
            <span>{{ getLangName('entries') }}</span>
        </div>
        <div class="f-page-nav">
            <ul class="f-pagination">
                <li v-if="isEnableFirstPageBtn" :class="['f-page-item', { disabled: nowPageNum === 1 }]" @click="nowPageNum !== 1 && doPageItemActive(1)">
                    <a class="f-page-link">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="#666666">
                            <path
                                d="M4.88243 4.73892L9.02383 0.660791C9.18907 0.495557 9.45625 0.495557 9.62149 0.660791L9.8711 0.910401C10.0363 1.07563 10.0363 1.34282 9.8711 1.50806L6.27461 5.03774L9.86758 8.56743C10.0328 8.73267 10.0328 8.99985 9.86758 9.16509L9.61797 9.4147C9.45274 9.57993 9.18555 9.57993 9.02032 9.4147L4.87891 5.33657C4.71719 5.17134 4.71719 4.90415 4.88243 4.73892ZM0.382425 5.33657L4.52383 9.4147C4.68907 9.57993 4.95625 9.57993 5.12149 9.4147L5.3711 9.16509C5.53633 8.99985 5.53633 8.73267 5.3711 8.56743L1.77461 5.03774L5.36758 1.50806C5.53282 1.34282 5.53282 1.07563 5.36758 0.910401L5.11797 0.660791C4.95274 0.495557 4.68555 0.495557 4.52032 0.660791L0.37891 4.73892C0.217191 4.90415 0.217191 5.17134 0.382425 5.33657Z"
                            />
                        </svg>
                    </a>
                </li>
                <li :class="['f-page-item', { disabled: disabledPrev }]" @click="!disabledPrev && doPageItemActive(nowPageNum - 1)">
                    <a class="f-page-link">
                        <svg width="6" height="10" viewBox="0 0 6 10" fill="#666666">
                            <path
                                d="M0.382425 4.73892L4.52383 0.660791C4.68907 0.495557 4.95625 0.495557 5.12149 0.660791L5.3711 0.910401C5.53633 1.07563 5.53633 1.34282 5.3711 1.50806L1.77461 5.03774L5.36758 8.56743C5.53282 8.73267 5.53282 8.99985 5.36758 9.16509L5.11797 9.4147C4.95274 9.57993 4.68555 9.57993 4.52032 9.4147L0.37891 5.33657C0.217191 5.17134 0.217191 4.90415 0.382425 4.73892Z"
                            />
                        </svg>
                    </a>
                </li>
                <li v-for="pageNum in pagingArray" :class="isPageItemNumActive(pageNum)" @click="pageNum !== nowPageNum && doPageItemActive(pageNum)" :key="pageNum">
                    <a class="f-page-link">{{ pageNum }}</a>
                </li>
                <li :class="['f-page-item', { disabled: disabledNext }]" @click="!disabledNext && doPageItemActive(nowPageNum + 1)">
                    <a class="f-page-link">
                        <svg width="6" height="10" viewBox="0 0 6 10" fill="#666666">
                            <path
                                d="M5.36736 5.33657L1.22595 9.4147C1.06072 9.57993 0.79353 9.57993 0.628296 9.4147L0.378687 9.16509C0.213452 8.99985 0.213452 8.73267 0.378687 8.56743L3.97517 5.03774L0.382202 1.50806C0.216968 1.34282 0.216968 1.07563 0.382202 0.910401L0.631812 0.660791C0.797046 0.495557 1.06423 0.495557 1.22947 0.660791L5.37087 4.73892C5.53259 4.90415 5.53259 5.17134 5.36736 5.33657Z"
                            />
                        </svg>
                    </a>
                </li>
                <li v-if="isEnableLastPageBtn" :class="['f-page-item', { disabled: nowPageNum === paginCounts }]" @click="nowPageNum !== paginCounts && doPageItemActive(paginCounts)">
                    <a class="f-page-link">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="#666666">
                            <path
                                d="M5.11736 5.33657L0.975952 9.4147C0.810718 9.57993 0.54353 9.57993 0.378296 9.4147L0.128687 9.16509C-0.0365479 8.99985 -0.0365479 8.73267 0.128687 8.56743L3.72517 5.03774L0.132202 1.50806C-0.0330322 1.34282 -0.0330322 1.07563 0.132202 0.910401L0.381812 0.660791C0.547046 0.495557 0.814233 0.495557 0.979468 0.660791L5.12087 4.73892C5.28259 4.90415 5.28259 5.17134 5.11736 5.33657ZM9.61736 4.73892L5.47595 0.660791C5.31072 0.495557 5.04353 0.495557 4.8783 0.660791L4.62869 0.910401C4.46345 1.07563 4.46345 1.34282 4.62869 1.50806L8.22517 5.03774L4.6322 8.56743C4.46697 8.73267 4.46697 8.99985 4.6322 9.16509L4.88181 9.4147C5.04705 9.57993 5.31423 9.57993 5.47947 9.4147L9.62087 5.33657C9.78259 5.17134 9.78259 4.90415 9.61736 4.73892Z"
                            />
                        </svg>
                    </a>
                </li>
            </ul>
        </div>
        <div class="f-page-info" v-if="!isOnlyPageNav">
            {{ getLangName('showing') }} {{ from }} {{ getLangName('to') }} {{ to }} {{ getLangName('of') }} {{ totalNumber }} {{ getLangName('entries') }}
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { ref, computed, watch, onUnmounted, toRefs } from 'vue';
const pageNumStatus = {
    firstPage: 0,
    lastPage: 1,
    middlePage: 2,
};
class PaginServerSideInfo {
    constructor(start, length, filter) {
        this.start = start;
        this.length = length;
        this.filter = filter;
    }
}

export default {
    name: 'FPagination',
    props: {
        /**
         * Set the size list menu of pagination.
         */
        pageSizeMenu: {
            type: Array,
            default() {
                return [10, 25, 50, 75, 100];
            },
        },
        /**
         * Set the static data source of pagination.
         */
        dataArray: {
            type: Array,
            default() {
                return [];
            },
        },
        /**
         * Is source from a paginData.
         */
        isPaginData: {
            type: Boolean,
            default: false,
        },
        /**
         * If source is from a paginData then you have to tell how many data is,
         * or the pagin won't work current.
         */
        totalDataLength: {
            type: Number,
            default: 0,
        },
        /**
         * Enable show all pagin numbers.
         */
        showAllPageNumber: {
            type: Boolean,
            default: false,
        },
        /**
         * If showAllPageNumber is set to false, then you can set this param
         * to limited how many pagin shows in, the other will be replace by "more" icon.
         */
        pageNumbersLimited: {
            type: Number,
            default: 5,
        },
        /**
         * Enable the first page button.
         */
        isEnableFirstPageBtn: {
            type: Boolean,
            default: true,
        },
        /**
         * Enable the last page button.
         */
        isEnableLastPageBtn: {
            type: Boolean,
            default: true,
        },
        /**
         * Set each page data is from server on each loading while page num changed.
         */
        serverSide: {
            type: Boolean,
            default: false,
        },
        /**
         * Set data from ajax, the ajax's setting.
         * NOTICE: if this option has been set, the option "dataArray" will be abort.
         */
        axiosConfigOpts: {
            type: Object,
            default() {
                return {};
            },
        },
        /**
         * Set direct page num programmatically.
         * The triggerId have to set with a random id,
         * each call must be set different triggerId,
         * so that watch will be triggered.
         * Eg: {pageNum: 1, triggerId: Math.random()}
         */
        directPageNum: {
            type: Object,
            default() {
                return { pageNum: 1, triggerId: '' };
            },
        },
        /**
         * component display language.
         */
        locale: {
            type: String,
            default: 'zh-TW',
        },
        /**
         * hide left & right info.
         */
        isOnlyPageNav: {
            type: Boolean,
            default: false,
        },
    },
    emits: [
        /**
         * Set the callback function after page num changed and data loaded.
         * emit name: afterDataUpdate
         */
        'afterDataUpdate',
        /**
         * Set the callback function before page num changed and data loaded.
         * emit name: afterDataUpdate
         */
        'beforeLoad',
    ],
    setup(props, { emit }) {
        const pageSize = ref(props.pageSizeMenu[0]);
        const nowPageNum = ref(1);
        const dataSource = ref(props.dataArray);
        const totalNumber = ref(props.isPaginData ? props.totalDataLength : props.dataArray.length);
        const axiosConfig = computed(() => {
            let config = Object.assign(
                {
                    url: '',
                    method: 'post',
                    data: {},
                    params: {},
                    headers: { ContentType: 'application/json; charset=utf-8' },
                },
                props.axiosConfigOpts
            );

            if (props.serverSide) {
                config.data = new PaginServerSideInfo(dataStartIndex.value, pageSize.value, props.axiosConfigOpts.data);
            }

            return config;
        });

        const dataStartIndex = computed(() => {
            return nowPageNum.value * pageSize.value - pageSize.value;
        });
        const dataEndIndex = computed(() => {
            return nowPageNum.value * pageSize.value;
        });
        const from = computed(() => {
            return totalNumber.value > 0 ? dataStartIndex.value + 1 : 0;
        });
        const to = computed(() => {
            return totalNumber.value > dataEndIndex.value ? dataEndIndex.value : totalNumber.value;
        });
        const paginCounts = computed(() => {
            return Math.ceil(totalNumber.value / pageSize.value);
        });
        const nowPageNumStatus = computed(() => {
            if (nowPageNum.value === 1) {
                return 0;
            }
            if (nowPageNum.value === paginCounts.value) {
                return 1;
            }
            return 2;
        });

        const disabledPrev = computed(() => {
            if (nowPageNum.value === 1 || paginCounts.value == 0) {
                return true;
            } else {
                return false;
            }
        });
        const disabledNext = computed(() => {
            if (nowPageNum.value === paginCounts.value || paginCounts.value === 0) {
                return true;
            } else {
                return false;
            }
        });

        const getBasicPagingArray = function () {
            const pagingArray = [];
            for (let i = 1; i <= paginCounts.value; i++) {
                pagingArray.push(i);
            }
            return pagingArray;
        };
        const pagingArray = computed(() => {
            let pagingArray = [];

            if (props.showAllPageNumber) {
                pagingArray = getBasicPagingArray();
            } else {
                switch (nowPageNumStatus.value) {
                    case pageNumStatus.firstPage: {
                        pagingArray = getBasicPagingArray();
                        if (paginCounts.value > props.pageNumbersLimited) {
                            pagingArray = pagingArray.slice(0, props.pageNumbersLimited);
                        }
                        break;
                    }
                    case pageNumStatus.lastPage: {
                        pagingArray = getBasicPagingArray();
                        if (paginCounts.value > props.pageNumbersLimited) {
                            pagingArray = pagingArray.slice(paginCounts.value - props.pageNumbersLimited, paginCounts.value);
                        }
                        break;
                    }
                    case pageNumStatus.middlePage: {
                        pagingArray = getBasicPagingArray();
                        let maxIndex = nowPageNum.value;
                        let minIndex = nowPageNum.value;
                        for (let i = 1; i < props.pageNumbersLimited; i++) {
                            if (i % 2 === 0) {
                                const tmp = minIndex - 1;
                                if (tmp >= 1) {
                                    minIndex--;
                                } else if (maxIndex < paginCounts.value) {
                                    maxIndex++;
                                }
                            } else {
                                const tmp = maxIndex + 1;
                                if (tmp <= paginCounts.value) {
                                    maxIndex++;
                                } else if (minIndex > 1) {
                                    minIndex--;
                                }
                            }
                        }
                        pagingArray = pagingArray.slice(minIndex - 1, maxIndex);
                        break;
                    }
                    default:
                        break;
                }
            }
            return pagingArray;
        });

        const isPageItemNumActive = (index) => {
            return `f-page-item page-num ${index === nowPageNum.value ? 'active' : ''}`;
        };

        const doPageItemActive = (pageNum) => {
            nowPageNum.value = pageNum;
        };

        const getLangName = (word) => {
            let result = '';
            switch (word) {
                case 'show':
                    if (props.locale == 'zh-TW') result = '顯示';
                    if (props.locale == 'zh-CN') result = '显示';
                    if (props.locale == 'en') result = 'Show';
                    break;
                case 'entries':
                    if (props.locale == 'zh-TW') result = '項';
                    if (props.locale == 'zh-CN') result = '项';
                    if (props.locale == 'en') result = 'entries';
                    break;

                case 'showing':
                    if (props.locale == 'zh-TW') result = '顯示第';
                    if (props.locale == 'zh-CN') result = '显示第';
                    if (props.locale == 'en') result = 'Showing';
                    break;
                case 'to':
                    if (props.locale == 'zh-TW') result = '至';
                    if (props.locale == 'zh-CN') result = '至';
                    if (props.locale == 'en') result = 'to';
                    break;
                case 'of':
                    if (props.locale == 'zh-TW') result = '項結果，共';
                    if (props.locale == 'zh-CN') result = '项结果，共';
                    if (props.locale == 'en') result = 'of';
                    break;
            }
            return result;
        };

        if (axiosConfig.value.url !== '') {
            emit('beforeLoad');
            axios(axiosConfig.value)
                .then((response) => {
                    const responseData = response.data;
                    if (props.serverSide) {
                        dataSource.value = responseData.data.data;
                        totalNumber.value = responseData.data.recordsTotal;
                    } else {
                        dataSource.value = responseData.data;
                        totalNumber.value = responseData.data.length;
                    }
                    let pageData = dataSource.value;
                    if (!props.isPaginData) {
                        pageData = dataSource.value.slice(dataStartIndex.value, dataEndIndex.value);
                    }

                    emit('afterDataUpdate', {
                        dataSource: pageData,
                        totalNumber: totalNumber.value,
                        pageSize: pageSize.value,
                        nowPageNum: nowPageNum.value,
                        dataStartIndex: dataStartIndex.value,
                        dataEndIndex: dataEndIndex.value,
                        from: from.value,
                        to: to.value,
                        paginCounts: paginCounts.value,
                    });
                })
                .catch((error) => {
                    console.error('error: %s', error);
                });
        } else if (!props.isPaginData) {
            emit('afterDataUpdate', {
                dataSource: dataSource.value.slice(dataStartIndex.value, dataEndIndex.value),
                totalNumber: totalNumber.value,
                pageSize: pageSize.value,
                nowPageNum: nowPageNum.value,
                dataStartIndex: dataStartIndex.value,
                dataEndIndex: dataEndIndex.value,
                from: from.value,
                to: to.value,
                paginCounts: paginCounts.value,
            });
        }

        const { directPageNum } = toRefs(props);
        watch(
            () => directPageNum,
            (newVal) => {
                nowPageNum.value = newVal.value.pageNum;
                // if (paginCounts.value >= newVal.value.pageNum) {
                // }
            },
            { deep: true, immediate: true }
        );

        watch(
            () => props.dataArray,
            (newVal) => {
                if (!props.serverSide) {
                    dataSource.value = props.dataArray;
                    let pageData = dataSource.value;
                    if (!props.isPaginData) {
                        totalNumber.value = newVal.length;
                        pageData = dataSource.value.slice(dataStartIndex.value, dataEndIndex.value);
                    }

                    emit('afterDataUpdate', {
                        dataSource: pageData,
                        totalNumber: totalNumber.value,
                        pageSize: pageSize.value,
                        nowPageNum: nowPageNum.value,
                        dataStartIndex: dataStartIndex.value,
                        dataEndIndex: dataEndIndex.value,
                        from: from.value,
                        to: to.value,
                        paginCounts: paginCounts.value,
                    });
                }
            },
            { deep: true, immediate: true }
        );

        const stopHandle = watch([nowPageNum, pageSize, axiosConfig, directPageNum], async (curVal, oldVal) => {
            let curAxiosConfig = curVal[2];
            let oldAxiosConfig = oldVal[2];

            let pageData = dataSource.value;
            if (props.serverSide || curAxiosConfig !== oldAxiosConfig) {
                try {
                    emit('beforeLoad');
                    const response = await axios(axiosConfig.value);
                    const responseData = response.data;

                    if (props.serverSide) {
                        dataSource.value = responseData.data.data;
                        totalNumber.value = responseData.data.recordsTotal;
                    } else {
                        dataSource.value = responseData.data;
                        totalNumber.value = responseData.data.length;
                    }
                    pageData = dataSource.value;
                } catch (error) {
                    console.error('error: %s', error);
                }
            }
            if (!props.isPaginData && !props.serverSide) {
                pageData = dataSource.value.slice(dataStartIndex.value, dataEndIndex.value);
            }

            emit('afterDataUpdate', {
                dataSource: pageData,
                totalNumber: totalNumber.value,
                pageSize: pageSize.value,
                nowPageNum: nowPageNum.value,
                dataStartIndex: dataStartIndex.value,
                dataEndIndex: dataEndIndex.value,
                from: from.value,
                to: to.value,
                paginCounts: paginCounts.value,
            });
        });
        onUnmounted(() => {
            stopHandle();
        });

        return {
            pageSize,
            nowPageNum,
            dataSource,
            totalNumber,
            dataStartIndex,
            dataEndIndex,
            from,
            to,
            paginCounts,
            disabledPrev,
            disabledNext,
            pagingArray,
            isPageItemNumActive,
            doPageItemActive,
            getLangName,
        };
    },
};
</script>
