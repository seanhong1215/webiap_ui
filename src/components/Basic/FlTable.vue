<template>
    <table>
        <thead>
            <tr>
                <th v-if="enableToggleDetail">
                    <span></span>
                </th>
                <th v-if="enableCheck">
                    <input type="checkbox" :value="rowList" v-model="selectAll" :disabled="selectAllDisabled" />
                </th>
                <template v-for="column in columns" :key="column.title">
                    <th v-show="column.visible" :style="column.style">
                        {{ column.title }}
                    </th>
                </template>
            </tr>
        </thead>
        <tbody>
            <template v-for="(rowData, index) in rowList" :key="index">
                <tr :class="[selectedIndex === index ? 'selected' : '', { 'enable-row-select': enableRowSelect && !enableCheck }]" @click="doRowSelect(index, rowData)">
                    <td v-if="enableToggleDetail" @click="toggleRowDetail(index, $event)" style="cursor: pointer">
                        <span><i class="fas fa-chevron-right toggle-mark" :style="toggleMarkStyle" :ref="setItemRef"></i></span>
                    </td>
                    <td v-if="enableCheck">
                        <input type="checkbox" :value="rowData" v-model="selected" :disabled="!(rowData[isCheckEditableKey] ? rowData[isCheckEditableKey] : false)" />
                    </td>
                    <template v-for="column in columns" :key="column.dataKey">
                        <td v-show="column.visible" :class="[{ 'template-row': column.isTemplate }, column.isTemplate == true ? rowData[column.dataKey].class : '']">
                            <template v-if="column.isTemplate">
                                <slot :name="`col_${column.dataKey}_${index}`" :columnData="rowData[column.dataKey]" :rowIndex="index" :rowData="rowData"></slot>
                            </template>
                            <template v-else>
                                {{ rowData[column.dataKey] ? rowData[column.dataKey] : column.defaultContent }}
                            </template>
                        </td>
                    </template>
                </tr>
                <tr v-if="toggleRowIndex === index || preToggleRowIndex === index">
                    <td :colspan="colspan" class="detail-row-data">
                        <div ref="toggleRowDetailRef" :style="rowDetailStyle">
                            <div ref="toggleRowSoltRef">
                                <slot name="rowDetailSlot" :rowData="rowData" :rowIndex="index"></slot>
                            </div>
                        </div>
                    </td>
                </tr>
            </template>
        </tbody>
    </table>
</template>
<script>
const columnDefault = {
    title: '',
    dataKey: '',
    visible: true,
    defaultContent: '',
    isTemplate: false,
    style: {},
};
export default {
    name: 'FlTable',
    props: {
        /**
         * Enable row selected checkbox.
         *
         * @type Boolean
         */
        enableCheck: {
            type: Boolean,
            default: false,
        },
        /**
         * Enable row toggle detail.
         *
         * @type Boolean
         */
        enableToggleDetail: {
            type: Boolean,
            default: false,
        },
        /**
         * Set the header title name, colunm data key(bind with rowData),
         * is visible and default content with if row data key is not exist.
         * The current format can ref to "columnDefault" which can be find was declared on the top.
         *
         * @type Array
         */
        columnDefs: {
            type: Array,
            default: () => {
                return [];
            },
        },
        /**
         * Set the table data source.
         *
         * @type Array
         */
        rowList: {
            type: Array,
            default: () => {
                return [];
            },
        },
        /**
         * Set collapse delay time, the time unit is ms.
         *
         * @type Number
         */
        toggleCollapseDelayTime: {
            type: Number,
            default: 500,
        },
        enableRowSelect: {
            type: Boolean,
            default: false,
        },
        isCheckEditableKey: {
            type: String,
            default: 'isCheckEditable',
        },
    },
    emits: [
        /**
         * Set the callback function after the row is selected.
         *
         * @type $emit
         * emit name: onCheckSelectedUpdate
         * params: selected
         */
        'onCheckSelectedUpdate',
        /**
         * Set the callback function after the row detail showing is toggle.
         *
         * @type $emit
         * emit name: toggleRowDetail
         * params: index: int, opening: boolean
         */
        'toggleRowDetail',
        /**
         * Set the callback function after the row select/diselect.
         *
         * @type $emit
         * emit name: onRowSelectUpdate
         * params: that: table, index: int, rowData: object, isSelected: boolean
         */
        'onRowSelectUpdate',
    ],
    data() {
        return {
            selected: [],
            toggleRowIndex: '',
            selectedIndex: '',
            preToggleRowIndex: '',
            rowDetailStyle: {
                height: '0px',
                overflow: 'hidden',
                transition: '1000ms',
            },
            toggleMarkStyle: {
                transition: '500ms',
            },
            itemRefs: [],
            columns: [],
        };
    },
    created() {
        const that = this;
        that.rowDetailStyle.transition = `${that.toggleCollapseDelayTime}ms`;
        that.toggleMarkStyle.transition = `${that.toggleCollapseDelayTime / 2}ms`;
        that.columnDefs.forEach((column, index) => {
            const columnOpts = { ...columnDefault, ...column };
            that.columns.push(columnOpts);
        });
    },
    updated() {
        const that = this;
        if (that.$refs.toggleRowDetailRef) {
            const height = getComputedStyle(that.$refs.toggleRowSoltRef).height;
            that.$refs.toggleRowDetailRef.style.height = height;
        }
    },
    computed: {
        selectAllDisabled() {
            const that = this;
            const rowList = that.rowList.filter((item) => {
                return item[that.isCheckEditableKey] == true;
            });
            return rowList.length == 0 ? true : false;
        },
        selectAll: {
            get() {
                const that = this;
                const rowList = that.rowList.filter((item) => {
                    return item[that.isCheckEditableKey] == true;
                });
                return rowList ? rowList.length != 0 && that.selected.length === rowList.length : false;
            },
            set(value) {
                const that = this;
                const selected = [];
                if (value) {
                    that.rowList.forEach((rowData) => {
                        if (rowData[that.isCheckEditableKey]) selected.push(rowData);
                    });
                }
                that.selected = selected;
            },
        },
        colspan() {
            const that = this;
            let colspan = that.columns.length;
            if (that.enableToggleDetail) colspan++;
            if (that.enableCheck) colspan++;
            return colspan;
        },
    },
    methods: {
        toggleRowDetail(index, e) {
            const that = this;
            if (that.toggleRowIndex === index) {
                that.$refs.toggleRowDetailRef.style.height = '0px';
                that.itemRefs[index].style.transform = 'rotate(0deg)';
                setTimeout(() => {
                    that.toggleRowIndex = '';
                    that.selectedIndex = '';
                    that.preToggleRowIndex = '';
                    that.$emit('toggleRowDetail', index, false);
                }, that.toggleCollapseDelayTime);
            } else {
                that.itemRefs[index].style.transform = 'rotate(90deg)';
                if (that.toggleRowIndex !== '') {
                    that.itemRefs[that.toggleRowIndex].style.transform = 'rotate(0deg)';
                }
                if (that.$refs.toggleRowDetailRef) {
                    that.$refs.toggleRowDetailRef.style.height = '0px';
                }
                that.toggleRowIndex = index;
                that.selectedIndex = index;
                that.$emit('toggleRowDetail', index, true);
                setTimeout(() => {
                    that.preToggleRowIndex = index;
                }, that.toggleCollapseDelayTime);
            }
        },
        setItemRef(el) {
            const that = this;
            if (el) {
                that.itemRefs.push(el);
            }
        },
        doRowSelect(index, rowData) {
            const that = this;
            if (that.enableRowSelect && !that.enableCheck) {
                let isSelected = false;
                if (that.selectedIndex === index) {
                    that.selectedIndex = '';
                } else {
                    that.selectedIndex = index;
                    isSelected = true;
                }
                that.$emit('onRowSelectUpdate', that, index, rowData, isSelected);
            }
        },
    },
    beforeUpdate() {
        const that = this;
        that.itemRefs = [];
    },
    watch: {
        rowList(val, oldValue) {
            const that = this;
            that.selected = [];
            that.itemRefs.forEach((el, index) => {
                el.style.transform = 'rotate(0deg)';
            });
            that.toggleRowIndex = '';
            that.preToggleRowIndex = '';
        },
        selected(val, oldValue) {
            const that = this;
            that.$emit('onCheckSelectedUpdate', val);
        },
        enableCheck() {
            const that = this;
            that.selectedIndex = '';
            that.selected = [];
        },
    },
};
</script>
<style lang="scss" scoped>
table {
    width: 100%;
    text-align: center;
    border-collapse: separate;
    border-spacing: 0;
    thead {
        background-color: #ede9f7;
        th {
            padding-top: 18px;
            padding-bottom: 18px;
            &:nth-child(1) {
                border-top-left-radius: 4px;
            }
            &:nth-last-child(1) {
                border-top-right-radius: 4px;
            }
        }
    }
    tbody {
        tr {
            background: #ffffff;
            &.enable-row-select {
                cursor: pointer;
            }
            &.selected {
                background: rgba(237, 233, 247, 0.5);
            }
            td {
                border-bottom: 1px solid rgba(196, 196, 196, 0.5);
                &:not(.detail-row-data) {
                    padding: 16px;
                    i.toggle-mark {
                        transform: 'rotate(0deg)';
                    }
                }
            }
        }
    }
}
</style>
