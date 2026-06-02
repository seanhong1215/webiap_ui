import { apiArtifacts, apiProcess, apiArtifactItems } from '@/utils/api';

const condition = {
    namespaced: true,
    state: () => ({
        // 條件列表
        /*
                states:[{
                    name: 'state1',                    
                    conditions: [
                        {relationship: '',item: 'ITEM1',operation: '==',condition: 'true',},
                        {relationship: '&&',item: 'ITEM3',operation: '>=',condition: '10',},
                    ],
                }]            
            */
        states: [],
        // 表單物件列表
        /*
                processItems: [{name: '花費成本',id: 'ITEM1',}]
            */
        processItems: [],
        firstProcess: [],
        artId: '',
        artName: '',
        rootProId: '',
        proId: '',
        prjId: '',
        selectedMfpId: '', //for rule pattern
    }),
    mutations: {
        setConditionList(state, payload) {
            // console.log('setConditionList');
            //console.log(payload); //rootPro
            state.prjID = payload.prjID;
            state.rootProId = payload.id;
            const firstProcess = payload.subProcessList[0];
            state.proId = firstProcess.id;
            const outProcessList = firstProcess.outProcessList;

            let artStateList = outProcessList
                .filter(function(outProcess) {
                    if (!outProcess.linkTerm) {
                        console.log('setConditionList linkTerm error: toProcessID=' + outProcess.toProcessID + ',fromProcessID=' + outProcess.fromProcessID);
                        return false;
                    } else if (!outProcess.linkTerm.artStateList[0]) {
                        console.log('setConditionList linkTerm error: toProcessID=' + outProcess.toProcessID + ',fromProcessID=' + outProcess.fromProcessID);
                        return false;
                    }
                    return true;
                })
                .map((outProcess) => {
                    const mfpId = outProcess.toProcessID;
                    const ast = outProcess.linkTerm.artStateList[0];
                    const id = ast.id;
                    const name = ast.name;
                    const condition = ast.condition;
                    //const condition = 'Button1 == 123 && Label1 == "1 2 3" || TextField1 != 456';

                    //---parse condition
                    let conditionArr = [];
                    let conditionStrs = condition.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);
                    if (conditionStrs) {
                        for (let i = 0; i < conditionStrs.length; ) {
                            let condObj = { relationship: '', item: '', operation: '', condition: '' };
                            if (i == 0) {
                                condObj.relationship = '';
                                condObj.item = conditionStrs[i];
                                condObj.operation = conditionStrs[i + 1];
                                condObj.condition = conditionStrs[i + 2];
                                i = i + 3;
                            } else {
                                condObj.relationship = conditionStrs[i];
                                condObj.item = conditionStrs[i + 1];
                                condObj.operation = conditionStrs[i + 2];
                                condObj.condition = conditionStrs[i + 3];
                                i = i + 4;
                            }
                            if (condObj.condition.startsWith('"') && condObj.condition.endsWith('"')) {
                                condObj.condition = condObj.condition.substring(1, condObj.condition.length - 1);
                            }
                            conditionArr.push(condObj);
                        }
                    } else {
                        let condObj = { relationship: '', item: '', operation: '', condition: '' };
                        conditionArr.push(condObj);
                    }

                    //---
                    // console.log('conditionArr');
                    // console.log(conditionArr);

                    return {
                        id: id,
                        name: name,
                        conditions: conditionArr,
                        mfpId: mfpId,
                    };
                });
            // console.log('artStateList');
            // console.log(artStateList);
            state.states = artStateList;
        },
        setArtItemList(state, items) {
            //console.log('setArtItemList');
            //console.log(art);

            if (items) {
                state.processItems = items.map((item) => {
                    let fullName = '';
                    if (item.synopsis && item.synopsis.length > 0) {
                        fullName = `${item.synopsis}[${item.name}]`;
                    } else {
                        fullName = item.name;
                    }

                    let itemId = item.name;
                    if (item.type.startsWith('TableColumn')) {                        
                        itemId = item.id;
                    }

                    return {
                        id: itemId,
                        name: fullName,
                        dbType: item.dbType,
                        javaType: item.type,
                        itemId: item.id,
                    };
                });

                //console.log('state.processItems');
                //console.log(state.processItems);
            }
            for (let i = 0; i < state.processItems.length; i++) {
                if (state.processItems[i]['name'] === 'FormLayerPane') {
                    state.processItems.splice(i, 1);
                    break;
                }
            }
        },
        setSelectedMfpId(state, payload) {
            state.selectedMfpId = payload;
        },
        setFirstProcess(state, payload) {
            const firstProcess = payload.subProcessList[0];
            state.firstProcess = [
                {
                    id: firstProcess.id,
                    name: firstProcess.name,
                },
            ];
        },
    },
    actions: {
        async updateXConditionList(context, rootProId) {
            //console.log('updateXConditionList');
            //console.log(rootProId);
            let rootPorcessObj = {};
            await apiProcess(rootProId)
                .then((res) => {
                    rootPorcessObj = res.data.data;
                })
                .catch((err) => {
                    console.log(err);
                });
            //console.log('rootPorcessObj');
            //console.log(rootPorcessObj);

            if (rootPorcessObj !== {}) {
                context.commit('setConditionList', rootPorcessObj);
                context.commit('setFirstProcess', rootPorcessObj);
                //console.log('start process/getMfpManagerByProId');
                await context.dispatch('process/getMfpManagerByProId', rootProId, { root: true });
                //console.log('end process/getMfpManagerByProId');
                //console.log('context.rootState.process.specMfp.artifact.id');
                //console.log(context.rootState.process.specMfp.artifact.id);

                context.state.artId = context.rootState.process.specMfp.artifact.id;
                //console.log('context.state.artId');
                //console.log(context.state.artId);

                await apiArtifacts(context.state.artId)
                    .then((res) => {
                        context.state.artName = res.data.data.name;
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                await apiArtifactItems(context.state.artId)
                    .then((res) => {
                        context.commit('setArtItemList', res.data.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },
        updateXSelectedMfpId(context, mfpId) {
            context.commit('setSelectedMfpId', mfpId);
        },
    },
    getters: {
        getXStates: (state) => {
            return state.states;
        },
        getXProcessItems: (state) => {
            return state.processItems;
        },
        getXInfo: (state) => {
            return {
                artId: state.artId,
                rootProId: state.rootProId,
                proId: state.proId,
                prjID: state.prjID,
                selectedMfpId: state.selectedMfpId,
            };
        },
    },
};
export default condition;
