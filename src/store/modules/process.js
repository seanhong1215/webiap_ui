import { apiMfpManagerSimple, apiMfpManagerByProId, apiProcess } from '@/utils/api';
import statusMap from '../statusMap';
import global from '@/utils/global';

const compare = (field, data, selectedType, disableSelectedType) => {
    let matched = false;
    let stateMap = [];
    if (field.init) stateMap.push(1);
    if (field.ready) stateMap.push(2);
    if (field.running) stateMap.push(3);
    if (field.close) stateMap.push(4);

    matched = stateMap.length > 0 ? !!stateMap.find((type) => data.type == type) : true;

    if (!disableSelectedType && matched) {
        matched = selectedType == 0 || selectedType == data.type;
    }
    if (field.classified && field.classified.id && matched) {
        matched = field.classified.id === data.category;
    }
    if (field.owner && field.owner.id && matched) {
        matched = data.manager.includes(field.owner.id);
    }
    if (field.ownerDep && field.ownerDep.id && matched) {
        matched = data.managerDep.includes(field.ownerDep.id);
    }
    if (field.effectiveTime && field.effectiveTime.length > 0 && matched) {
        matched = field.effectiveTime[0] <= data.effectiveTime && field.effectiveTime[1] >= data.effectiveTime;
    }
    if (field.offlineTime && field.offlineTime.length > 0 && matched) {
        matched = field.offlineTime[0] <= data.closeTime && field.offlineTime[1] >= data.closeTime;
    }
    return matched;
};

const convertProSimpleToViewData = (card, categories) => {
    const accessMemInfoAry = card.accessMemInfo;
    const manager = accessMemInfoAry.reduce((acc, currValue, index) => {
        return index == 0 ? currValue.memName : `${acc},${currValue.memName}`;
    }, '');
    const managerDep = accessMemInfoAry.reduce((acc, currValue, index) => {
        return index == 0 ? currValue.depName : `${acc},${currValue.depName}`;
    }, '');

    const id = card.proID;
    const artId = card.artID;
    const proName = card.proName;
    const prjID = card.prjID;
    const category = categories[prjID];
    const desc = card.proSynopsis;
    const roleIDList = card.proRoleIDList;
    const versionIndex = card.versionIndex;
    const startTime = card.startTime;
    const endTime = card.endTime;
    const type = global.processTypeConverter(startTime, endTime);
    const deleteArtEnable = card.deleteArtEnable;

    return {
        id,
        artId,
        proName,
        type,
        category,
        manager,
        managerDep,
        effectiveTime: startTime === '9999-12-31' ? '*' : startTime,
        closeTime: type === 4 ? endTime : '',
        desc,
        roleIDList,
        version: versionIndex,
        deleteArtEnable,
    };
};

const convertProToViewData = (card, categories) => {
    const accessMemInfoAry = card.accessMemInfo;
    const manager = accessMemInfoAry.reduce((acc, currValue, index) => {
        return index == 0 ? currValue.memName : `${acc},${currValue.memName}`;
    }, '');
    const managerDep = accessMemInfoAry.reduce((acc, currValue, index) => {
        return index == 0 ? currValue.depName : `${acc},${currValue.depName}`;
    }, '');

    const id = card.process.id;
    const artId = card.artifact.id;
    const proName = card.process.name;
    const prjID = card.process.prjID;
    const category = categories[prjID];
    const desc = card.process.synopsis;
    const roleIDList = card.process.roleIDList;
    const version = card.process.version;
    const startTime = version.startTime;
    const endTime = version.endTime;
    const executable = version.executable;
    const type = global.processTypeConverter(startTime, endTime, executable);

    return {
        id,
        artId,
        proName,
        type,
        category,
        manager,
        managerDep,
        effectiveTime: startTime === '9999-12-31' ? '*' : startTime,
        closeTime: type === 4 ? endTime : '',
        desc,
        roleIDList,
        version: `v${version.number}`,
    };
};

const process = {
    namespaced: true,
    state: () => ({
        categories: {},
        cards: [],
        selectedType: 0,
        processList: [],
        viewType: 'card',
        selectedProId: '',
        selectedArtId: '',
        selectedSpecProId: '',
        specMfp: {},
    }),
    mutations: {
        setProcessList(state, payload) {
            const categories = payload.data.categories;
            const cards = payload.data.cards;
            state.categories = categories;
            state.cards = cards;
            state.processList = cards.map((data) => convertProSimpleToViewData(data, categories));
        },
        setProcSelectedType(state, payload) {
            state.selectedType = payload;
        },
        setViewType(state, type) {
            state.viewType = type;
        },
        setProcSelectedProId(state, proId) {
            state.selectedProId = proId;
        },
        setProcSelectedArtId(state, artId) {
            state.selectedArtId = artId;
        },
        setSelectedSpecProId(state, proId) {
            state.selectedSpecProId = proId;
        },
        setSpecMfp(state, payload) {
            const data = payload.data;
            state.specMfp = {
                accessMemInfo: data.accessMemInfo,
                process: data.process,
                artifact: { id: data.artifact.id },
            };
        },
    },
    actions: {
        async updateProcessList(context) {
            return new Promise(function (resolve, reject) {
                apiMfpManagerSimple()
                    .then((res) => {
                        context.commit('setProcessList', res.data);
                        resolve(res);
                    })
                    .catch((err) => {
                        console.log(err);
                        reject();
                    });
            });
        },
        updateProcSelectedType(context, type) {
            context.commit('setProcSelectedType', type);
        },
        updateViewType(context, type) {
            context.commit('setViewType', type);
        },
        updateProcSelectedProId(context, proId) {
            context.commit('setProcSelectedProId', proId);
        },
        updateProcSelectedArtId(context, artId) {
            context.commit('setProcSelectedArtId', artId);
        },
        updateSelectedSpecProId(context, proId) {
            context.commit('setSelectedSpecProId', proId);
        },
        async getMfpManagerByProId({ commit }, proId) {
            return new Promise(function (resolve, reject) {
                apiMfpManagerByProId(proId)
                    .then((res) => {
                        commit('setSpecMfp', res.data);
                        resolve(res);
                    })
                    .catch((err) => {
                        console.log(err);
                        reject();
                    });
            });
        },
        async getProcessByProId({}, proId) {
            return new Promise(function (resolve, reject) {
                apiProcess(proId)
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        console.log(err);
                        reject();
                    });
            });
        },
    },
    getters: {
        getSearchCards: (state) => (field, disableSelectedType) => {
            if (typeof field === 'string' || field instanceof String) {
                return state.processList.filter((data) => {
                    return data.proName.includes(field) && (state.selectedType == 0 || state.selectedType == data.type || disableSelectedType);
                });
            } else if (field && typeof field === 'object' && field.constructor === Object) {
                return state.processList.filter((data) => {
                    return compare(field, data, state.selectedType, disableSelectedType);
                });
            }
        },
        getProcessByProId: (state) => (proId) => {
            const list = state.processList.filter((data) => data.id == proId);
            return list.length == 0 ? {} : list[0];
        },
        getStatusCards: (state) => () => {
            const processList = state.processList;
            const selectedType = state.selectedType;
            return Object.keys(statusMap).map((statusKey) => {
                statusKey = parseInt(statusKey);
                const count = statusKey == 0 ? processList.length : processList.filter((val) => val.type == statusKey).length;
                return {
                    type: statusKey,
                    count,
                    selected: selectedType == statusKey,
                };
            });
        },
        getSpecMfpPanel: (state) => {
            return state.specMfp.process == undefined ? {} : convertProToViewData(state.specMfp, state.categories);
        },
    },
};

export default process;
