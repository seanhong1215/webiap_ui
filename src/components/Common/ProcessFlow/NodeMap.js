import { shallowRef } from 'vue';
import cloneDeep from 'lodash/fp/cloneDeep';
const vueCmpProps = ['tdData', 'rowData'];
const orderComponent = {
    name: 'tdOrder',
    props: vueCmpProps,
    template: `
        <i class="fas fa-check-circle simulate-checked" v-if="rowData.checked"></i><span>{{ tdData }}</span>
    `,
};
const memberComponent = {
    name: 'tdMember',
    props: vueCmpProps,
    template: `
        <div>{{ tdData.name }}</div>
        <div class="sign-dep">【{{ tdData.depName }}】</div>
    `,
};
const processComponent = {
    name: 'tdProcess',
    props: vueCmpProps,
    template: `
        <div>{{ tdData.name }}</div>
        <div class="sign-dep">【{{ tdData.prjName }}】</div>
    `,
};
const executorNameStyle = 'color: #333333; font-weight: 500;';
const executorComponent = {
    name: 'tdExecutor',
    props: vueCmpProps,
    template: `
        <div style="${executorNameStyle}">{{ tdData.name }}</div>
        <div class="sign-dep">{{ depName }}</div>
    `,
    computed: {
        depName() {
            const that = this;
            if (that.tdData.depName && that.tdData.depName !== '') {
                return `【${that.tdData.depName}】`;
            } else {
                return '';
            }
        },
    },
};
const executor = {
    title: 'processNode.executor',
    dataKey: 'executor',
    visible: true,
    defaultContent: '',
    isTemplate: true,
    style: { color: '#1484e5' },
};
const tdSlotsArr = (rowList, instance) => {
    let slotsArr = new Array();
    const keySets = instance.columnDefs.filter((item) => item.isTemplate);
    rowList.forEach((rowData, index) => {
        keySets.forEach((obj) => {
            const template = {
                slotName: `col_${obj.dataKey}_${index}`,
                componentName: obj.dataKey,
            };
            slotsArr.push(template);
        });
    });
    return slotsArr;
};
const nodeMap = {
    root: {
        columnDefs: [
            {
                title: 'processNode.executor',
                dataKey: 'executor',
                visible: true,
                defaultContent: '',
                isTemplate: true,
            },
        ],
        tdSlots(rowList) {
            return tdSlotsArr(rowList, this);
        },
        tdTemplates: {
            executor: shallowRef({
                name: 'tdExecutor',
                props: vueCmpProps,
                template: `
                    <i class="fas fa-check-circle simulate-checked" v-if="tdData.checked"></i>
                    <div style="${executorNameStyle}">{{ tdData.name }}</div>
                    <div class="sign-dep">{{ depName }}</div>
                `,
                computed: {
                    depName() {
                        const that = this;
                        if (that.tdData.depName && that.tdData.depName !== '') {
                            return `【${that.tdData.depName}】`;
                        } else {
                            return '';
                        }
                    },
                },
            }),
        },
    },
    sign: {
        columnDefs: [
            {
                title: 'processNode.order',
                dataKey: 'order',
                visible: true,
                defaultContent: '',
                isTemplate: true,
                style: { width: '56px' },
            },
            {
                title: 'ruleSetting.placeholder.setSignMember',
                dataKey: 'member',
                visible: true,
                defaultContent: '',
                isTemplate: true,
            },
            {
                title: 'ruleSetting.assignPolicy',
                dataKey: 'dispatch',
                visible: true,
                defaultContent: '',
            },
            {
                title: 'ruleSetting.pickJobPolicy',
                dataKey: 'pick',
                visible: true,
                defaultContent: '',
            },
        ],
        tdSlots(rowList) {
            return tdSlotsArr(rowList, this);
        },
        tdTemplates: {
            order: shallowRef(orderComponent),
            member: shallowRef(memberComponent),
        },
    },
    patternassign: {
        columnDefs: [
            {
                title: 'processNode.order',
                dataKey: 'order',
                visible: true,
                defaultContent: '',
                isTemplate: true,
                style: { width: '56px' },
            },
            {
                title: 'ruleSetting.placeholder.setSignMember',
                dataKey: 'member',
                visible: true,
                defaultContent: '',
                isTemplate: true,
            },
            {
                title: 'ruleSetting.signPattern',
                dataKey: 'pattern',
                visible: true,
                defaultContent: '',
            },
        ],
        tdSlots(rowList) {
            return tdSlotsArr(rowList, this);
        },
        tdTemplates: {
            order: shallowRef(orderComponent),
            member: shallowRef(memberComponent),
        },
    },
    roleassign: {
        columnDefs: [
            {
                title: 'processNode.order',
                dataKey: 'order',
                visible: true,
                defaultContent: '',
                isTemplate: true,
                style: { width: '56px' },
            },
            {
                title: 'ruleSetting.placeholder.setSignMember',
                dataKey: 'member',
                visible: true,
                defaultContent: '',
                isTemplate: true,
            },
        ],
        tdSlots(rowList) {
            return tdSlotsArr(rowList, this);
        },
        tdTemplates: {
            order: shallowRef(orderComponent),
            member: shallowRef(memberComponent),
        },
    },
    itemassign: {
        columnDefs: [
            {
                title: 'processNode.order',
                dataKey: 'order',
                visible: true,
                defaultContent: '',
                isTemplate: true,
                style: { width: '56px' },
            },
            {
                title: 'processNode.artItem',
                dataKey: 'item',
                visible: true,
                defaultContent: '',
                isTemplate: true,
            },
        ],
        tdSlots(rowList) {
            return tdSlotsArr(rowList, this);
        },
        tdTemplates: {
            order: shallowRef(orderComponent),
            item: shallowRef(memberComponent),
        },
    },
    csign: {
        columnDefs: [
            {
                title: 'processNode.order',
                dataKey: 'order',
                visible: true,
                defaultContent: '',
                isTemplate: true,
                style: { width: '56px' },
            },
            {
                title: 'processNode.csignMember',
                dataKey: 'csignMember',
                visible: true,
                defaultContent: '',
                isTemplate: true,
            },
            {
                title: 'ruleSetting.signType',
                dataKey: 'csType',
                visible: true,
                defaultContent: '',
            },
            {
                title: 'ruleSetting.placeholder.cssignCondition',
                dataKey: 'signWeights',
                visible: true,
                defaultContent: '',
            },
        ],
        tdSlots(rowList) {
            return tdSlotsArr(rowList, this);
        },
        tdTemplates: {
            order: shallowRef(orderComponent),
            csignMember: shallowRef(memberComponent),
        },
    },
    createProcess: {
        columnDefs: [
            {
                title: 'processNode.order',
                dataKey: 'order',
                visible: true,
                defaultContent: '',
                isTemplate: true,
                style: { width: '56px' },
            },
            {
                title: 'processNode.createProcess',
                dataKey: 'createProcess',
                visible: true,
                defaultContent: '',
                isTemplate: true,
            },
            {
                title: 'processNode.initialMember',
                dataKey: 'member',
                visible: true,
                defaultContent: '',
                isTemplate: true,
            },
            {
                title: 'processNode.endCondtion',
                dataKey: 'endCondition',
                visible: true,
                defaultContent: '',
            },
        ],
        tdSlots(rowList) {
            return tdSlotsArr(rowList, this);
        },
        tdTemplates: {
            order: shallowRef(orderComponent),
            member: shallowRef(memberComponent),
            createProcess: shallowRef(processComponent),
        },
    },
};
function nodeConfig(type, isSiumlate, vueInstance) {
    const simulateMode = isSiumlate ? true : false;
    if (!nodeMap[type]) {
        return undefined;
    }
    let config = cloneDeep(nodeMap[type]);
    if (simulateMode && type !== 'root') {
        config.columnDefs.splice(1, 0, executor);
        config.tdTemplates.executor = shallowRef(executorComponent);
    }
    config.columnDefs.forEach((columnDef) => {
        columnDef.title = vueInstance.$t(columnDef.title);
    });
    return config;
}
export default nodeConfig;
