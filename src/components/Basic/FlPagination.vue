<template>
    <div class="row">
        <div class="col-4 text-left page-size">
            <span>{{ $t('flPagination.show') }}</span>
            <select
                class="mr-1 ml-1 border-0 rounded"
                :value="pageSize"
                @change="
                    pageSize = $event.target.value;
                    nowPageNum = 1;
                "
            >
                <option v-for="pageSizeOption in pageSizeMenu" :key="pageSizeOption" :value="pageSizeOption">
                    {{ pageSizeOption }}
                </option>
            </select>
            <span>{{ $t('flPagination.items') }}</span>
        </div>
        <div class="col-4 text-center page-nav d-flex justify-content-center">
            <nav aria-label="page navigation">
                <ul class="pagination">
                    <li v-if="isEnableFirstPageBtn" class="page-item first" :class="frontPageBtnClass" @click="nowPageNum != 1 && doPageItemActive(1)">
                        <a class="page-link" aria-label="First">
                            <i class="fal fa-angle-double-left fa-lg"></i>
                        </a>
                    </li>
                    <li class="page-item prev" :class="frontPageBtnClass" @click="nowPageNum != 1 && doPageItemActive(nowPageNum - 1)">
                        <a class="page-link" aria-label="Previous">
                            <i class="fal fa-angle-left fa-lg"></i>
                        </a>
                    </li>
                    <li v-if="!showAllPageNumber && moreIcon.showPre" class="page-item more disabled">
                        <a class="page-link" href="#">
                            <i class="fal fa-ellipsis-h"></i>
                        </a>
                    </li>
                    <li v-for="pageNum in pagingArray" :key="pageNum" :class="isPageItemNumActive(pageNum)" @click="pageNum != nowPageNum && doPageItemActive(pageNum)">
                        <a class="page-link" tabindex>{{ pageNum }}</a>
                    </li>
                    <li v-if="!showAllPageNumber && moreIcon.showNext" class="page-item more disabled">
                        <a class="page-link">
                            <i class="fal fa-ellipsis-h"></i>
                        </a>
                    </li>
                    <li class="page-item next" :class="rearPageBtnClass" @click="nowPageNum != paginCounts && doPageItemActive(nowPageNum + 1)">
                        <a class="page-link" aria-label="Next">
                            <i class="fal fa-angle-right fa-lg"></i>
                        </a>
                    </li>
                    <li v-if="isEnableLastPageBtn" class="page-item last" :class="rearPageBtnClass" @click="nowPageNum != paginCounts && doPageItemActive(paginCounts)">
                        <a class="page-link" aria-label="Last">
                            <i class="fal fa-angle-double-right fa-lg"></i>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="col-4 text-right page-info">
            {{ $t('flPagination.showNumber') }} {{ from }} {{ $t('flPagination.to') }} {{ to }} {{ $t('flPagination.results') }}，{{ $t('flPagination.total') }} {{ currentTotalNumber }}
            {{ $t('flPagination.items') }}
        </div>
    </div>
</template>
<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
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
    name: 'FlPagination',
    props: {
        /**
         * Set the size list menu of pagination.
         *
         * @type Array
         */
        pageSizeMenu: {
            type: Array,
            default: () => {
                return [10, 25, 50, 75, 100];
            },
        },
        /**
         * Set the static data source of pagination.
         *
         * @type Array
         */
        dataArray: {
            type: Array,
            default: () => {
                return [];
            },
        },
        /**
         * Is source from a paginData.
         *
         * @type Boolean
         */
        isPaginData: {
            type: Boolean,
            default: false,
        },
        /**
         * If source is from a paginData then you have to tell how many data is,
         * or the pagin won't work current.
         *
         * @type Number
         */
        totalDataLength: {
            type: Number,
            default: 0,
        },
        /**
         * Enable show all pagin numbers.
         *
         * @type Boolean
         */
        showAllPageNumber: {
            type: Boolean,
            default: true,
        },
        /**
         * If showAllPageNumber is set to false, then you can set this param
         * to limited how many pagin shows in, the other will be replace by "more" icon.
         *
         * @type Number
         */
        pageNumbersLimited: {
            type: Number,
            default: 5,
        },
        /**
         * Enable the first page button.
         *
         * @type Boolean
         */
        isEnableFirstPageBtn: {
            type: Boolean,
            default: false,
        },
        /**
         * Enable the last page button.
         *
         * @type Boolean
         */
        isEnableLastPageBtn: {
            type: Boolean,
            default: false,
        },
        /**
         * Set each page data is from server on each loading while page num changed.
         *
         * @type Boolean
         */
        serverSide: {
            type: Boolean,
            default: false,
        },
        /**
         * Set data from ajax, the ajax's setting.
         * NOTICE: if this option has been set, the option "dataArray" will be abort.
         *
         * @type Object
         */
        axiosConfigOpts: {
            type: Object,
        },
        /**
         * Set direct page num programmatically.
         * The triggerId have to set with a random id,
         * each call must be set different triggerId,
         * so that watch will be triggered.
         * Eg: {pageNum: 1, triggerId: Math.random()}
         *
         * @type Object
         */
        directPageNum: {
            type: Object,
            default: () => {
                return { pageNum: 1, triggerId: '' };
            },
        },
    },
    emits: [
        /**
         * Set the callback function after page num changed and data loaded.
         *
         * @type $emit
         * emit name: afterDataUpdate
         * params: flPagination, data
         */
        'afterDataUpdate',
        'afterDataSrcUpdate',
    ],
    data() {
        const that = this;
        return {
            pageSize: 10,
            nowPageNum: 1,
            dataSource: [],
            totalNumber: 0,
            axiosConfig: {
                url: '',
                method: 'post',
                data: {},
                params: {},
                headers: { ContentType: 'application/json; charset=utf-8' },
            },
        };
    },
    created() {
        const that = this;
        that.pageSize = that.pageSizeMenu[0];
        that.dataSource = that.dataArray;
        that.nowPageNum = that.directPageNum.pageNum;
        that.totalNumber = that.isPaginData ? that.totalDataLength : that.dataArray.length;
        that.axiosConfig = { ...that.axiosConfig, ...that.axiosConfigOpts };
        if (that.axiosConfig.url !== '') {
            if (that.serverSide) {
                that.axiosConfig.data = new PaginServerSideInfo(that.dataStartIndex, that.pageSize, that.axiosConfigOpts.data);
            }
            axios(that.axiosConfig)
                .then((response) => {
                    const responseData = response.data;
                    if (that.serverSide) {
                        that.dataSource = responseData.data.data;
                        that.totalNumber = responseData.data.recordsTotal;
                    } else {
                        that.dataSource = responseData.data;
                        that.totalNumber = responseData.data.length;
                    }
                })
                .catch((error) => {
                    console.log('error: %s', error);
                });
        }
    },
    computed: {
        from() {
            const that = this;
            return that.totalNumber > 0 ? that.dataStartIndex + 1 : 0;
        },
        to() {
            const that = this;
            return that.totalNumber > that.dataEndIndex ? that.dataEndIndex : that.totalNumber;
        },
        dataStartIndex() {
            const that = this;
            return that.nowPageNum * that.pageSize - that.pageSize;
        },
        dataEndIndex() {
            const that = this;
            return that.nowPageNum * that.pageSize;
        },
        paginCounts() {
            const that = this;
            return Math.ceil(that.totalNumber / that.pageSize);
        },
        pagingArray() {
            const that = this;
            let pagingArray = that.getBasicPagingArray();
            if (!that.showAllPageNumber) {
                switch (that.nowPageNumStatus) {
                    case pageNumStatus.firstPage: {
                        if (that.paginCounts > that.pageNumbersLimited) {
                            pagingArray = pagingArray.slice(0, that.pageNumbersLimited);
                        }
                        break;
                    }
                    case pageNumStatus.lastPage: {
                        if (that.paginCounts > that.pageNumbersLimited) {
                            pagingArray = pagingArray.slice(that.paginCounts - that.pageNumbersLimited, that.paginCounts);
                        }
                        break;
                    }
                    case pageNumStatus.middlePage: {
                        pagingArray = pagingArray.slice(that.pageIndexBoundary.min - 1, that.pageIndexBoundary.max);
                        break;
                    }
                    default:
                        break;
                }
            }
            return pagingArray;
        },
        nowPageNumStatus() {
            const that = this;
            if (that.nowPageNum === 1) {
                return 0;
            }
            if (that.nowPageNum === that.totalNumber) {
                return 1;
            }
            return 2;
        },
        pageEntityCount() {
            const that = this;
            const hashIndex = that.pageSizeMenu.findIndex((pageSize) => pageSize == that.pageSize) + 1;
            return that.nowPageNum * hashIndex * that.pageSize * that.totalNumber;
        },
        currentTotalNumber() {
            const that = this;
            that.totalNumber = that.isPaginData ? that.totalDataLength : that.dataArray.length;
            return that.totalNumber;
        },
        moreIcon() {
            const that = this;
            let showPreMoreIcon = false;
            let showNextMoreIcon = false;
            switch (that.nowPageNumStatus) {
                case pageNumStatus.firstPage: {
                    if (that.paginCounts > that.pageNumbersLimited) {
                        showNextMoreIcon = true;
                    }
                    break;
                }
                case pageNumStatus.lastPage: {
                    if (that.paginCounts > that.pageNumbersLimited) {
                        showPreMoreIcon = true;
                    }
                    break;
                }
                case pageNumStatus.middlePage: {
                    if (that.pageIndexBoundary.min > 1) {
                        showPreMoreIcon = true;
                    }
                    if (that.pageIndexBoundary.max < that.paginCounts) {
                        showNextMoreIcon = true;
                    }
                    break;
                }
                default:
                    break;
            }
            return {
                showPre: showPreMoreIcon,
                showNext: showNextMoreIcon,
            };
        },
        pageIndexBoundary() {
            const that = this;
            let maxIndex = that.nowPageNum;
            let minIndex = that.nowPageNum;
            for (let i = 1; i < that.pageNumbersLimited; i++) {
                if (i % 2 === 0) {
                    const tmp = minIndex - 1;
                    if (tmp >= 1) {
                        minIndex--;
                    } else if (maxIndex < that.paginCounts) {
                        maxIndex++;
                    }
                } else {
                    const tmp = maxIndex + 1;
                    if (tmp <= that.paginCounts) {
                        maxIndex++;
                    } else if (minIndex > 1) {
                        minIndex--;
                    }
                }
            }
            return {
                max: maxIndex,
                min: minIndex,
            };
        },
        frontPageBtnClass() {
            return this.nowPageNum === 1 ? 'disabled' : '';
        },
        rearPageBtnClass() {
            return this.nowPageNum === this.paginCounts ? 'disabled' : '';
        },
    },
    methods: {
        isPageItemNumActive(index) {
            return `page-item page-num ${index === this.nowPageNum ? 'active' : ''}`;
        },
        doPageItemActive(pageNum) {
            const that = this;
            that.nowPageNum = pageNum;
        },
        getBasicPagingArray() {
            const that = this;
            const pagingArray = [];
            for (let i = 1; i <= that.paginCounts; i++) {
                pagingArray.push(i);
            }
            return pagingArray;
        },
    },
    watch: {
        dataArray: {
            handler(value) {
                const that = this;
                let pageData = value.slice(that.dataStartIndex, that.dataEndIndex);
                if (value.length != that.dataSource.length) {
                    that.nowPageNum = 1;
                    pageData = value.slice(0, that.pageSizeMenu[0]);
                }
                that.dataSource = value;
                that.$emit('afterDataSrcUpdate', that, pageData);
            },
            deep: true,
        },
        pageEntityCount() {
            const that = this;
            if (that.serverSide) {
                that.axiosConfig.data = new PaginServerSideInfo(that.dataStartIndex, that.pageSize, that.axiosConfigOpts.data);
                axios(that.axiosConfig)
                    .then((response) => {
                        const responseData = response.data;
                        that.dataSource = responseData.data.data;
                        that.totalNumber = responseData.data.recordsTotal;
                        that.$emit('afterDataUpdate', that, that.dataSource);
                    })
                    .catch((error) => {
                        console.log('error: %s', error);
                    });
            } else if (that.isPaginData) {
                that.$emit('afterDataUpdate', that);
            } else {
                const pageData = that.dataArray.slice(that.dataStartIndex, that.dataEndIndex);
                that.$emit('afterDataUpdate', that, pageData);
            }
        },
        directPageNum() {
            const that = this;
            if (that.paginCounts >= that.directPageNum.pageNum) {
                that.nowPageNum = that.directPageNum.pageNum;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.page-item {
    cursor: pointer;
    a {
        cursor: inherit;
    }
    &.disabled {
        cursor: not-allowed;
    }
}
.page-item.page-num.active {
    cursor: not-allowed;
}
.row {
    .page-size {
        margin: auto;
        font-size: 16px;
        span {
            color: #333333;
        }
        select {
            color: #000000;
        }
    }

    .page-nav {
        .pagination {
            margin: auto;
            font-size: 18px;
            .page-item {
                margin-left: 2px;
                margin-right: 2px;
                .page-link {
                    color: #333333;
                    border: 1px solid #c4c4c4;
                    box-sizing: border-box;
                }
                &.active {
                    .page-link {
                        background: #d7eafb;
                        color: #0070d1;
                        border: 1px solid #0070d1;
                        box-sizing: border-box;
                        border-radius: 2px;
                    }
                }

                &.disabled {
                    .page-link {
                        color: rgba(102, 102, 102, 0.38);
                    }
                }
            }
            .page-item,
            .page-item.first,
            .page-item.prev,
            .page-item.next,
            .page-item.last {
                .page-link:focus {
                    box-shadow: none;
                }
            }

            .page-item.first {
                border-radius: 4px 0px 0px 4px;
            }
            .page-item.last {
                border-radius: 0px 4px 4px 0px;
            }
        }
    }

    .page-info {
        margin: auto;
        font-size: 16px;
        color: #333333;
    }
}
</style>
