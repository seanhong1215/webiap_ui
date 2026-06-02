import i18n from '../i18n/index';
import cloneDeep from 'lodash/fp/cloneDeep';
const ruleTypeMap = {
    0: 'patternassign',
    1: 'roleassign',
    2: 'itemassign',
    4: 'sign',
    5: 'csign',
    6: 'csign',
    7: 'createProcess',
};
const getMember = (item) => {
    let depName = '';
    if (item != '') {
        if (item.includes('【')) {
            depName = item.split('【')[1].split('】')[0];
        }
    }
    return {
        name: item == '' ? item : item.split('【')[0],
        depName: depName,
    };
};
const rulePatternMap = {
    patternassign: (item) => {
        return {
            order: item.innerOrder + 1,
            member: convertMemberObj(item),
            pattern: item.patternString,
        };
    },
    roleassign: (item) => {
        return {
            order: item.innerOrder + 1,
            member: convertMemberObj(item),
        };
    },
    itemassign: (item) => {
        return {
            order: item.innerOrder + 1,
            item: convertMemberObj(item),
        };
    },
    sign: (item) => {
        return {
            order: item.innerOrder + 1,
            member: convertMemberObj(item),
            dispatch: item.policy,
            pick: item.queueType == '' ? 'N.A.' : item.queueType,
        };
    },
    csign: (item) => {
        return {
            order: item.innerOrder + 1,
            csignMember: convertMemberObj(item),
            csType: item.patternType == 5 ? '並會' : '並簽',
            signWeights: item.patternType == 5 ? 'N.A.' : item.patternString,
        };
    },
    createProcess: (item) => {
        return {
            order: item.innerOrder + 1,
            createProcess: convertProcessObj(item),
            member: convertMemberObj(item),
            endCondition: converEndCondition(item),
        };
    },
};

const convertMemberObj = (item) => {
    let memberObj = '';
    if (item.signFromName != '') {
        memberObj = item.signFromName;
    } else {
        if (item.speRole.roleFunction != '') {
            memberObj = item.speRole.roleFunctionFinalStr.replace('(', '【').replace(')', '】');
        } else {
            memberObj = item.speRole.roleFunctionFinalStr;
        }
    }
    return getMember(memberObj);
};
const convertProcessObj = (item) => {
    let cpInfo = item.createProInfo;
    let proName = '';
    let prjName = '';
    if (cpInfo != '' && cpInfo != undefined) {
        proName = cpInfo.createProcessName;
        prjName = cpInfo.createProcessPrjName;
    }
    return {
        name: proName,
        prjName: prjName,
    };
};
const converEndCondition = (item) => {
    let cpInfo = item.createProInfo;
    let endCondition = '';
    if (cpInfo != '' && cpInfo != undefined) {
        endCondition = cpInfo.endCondition;
        if (endCondition == 'ALL') {
            endCondition = 'ruleSetting.createProcess.endCondAll';
        } else if (endCondition == 'ANY') {
            endCondition = 'ruleSetting.createProcess.endCondAny';
        } else if (endCondition == 'NONE') {
            endCondition = 'ruleSetting.createProcess.endCondNone';
        }
    }
    return endCondition == '' ? '' : i18n.global.t(endCondition);
};
const combine = (siblingOrder, innerOrder, rowData, results) => {
    let combineData = [];
    const itemStep = `${siblingOrder + 1}-${innerOrder + 1}`;
    const resultsByFilter = results.filter((result) => {
        return siblingOrder + 1 == result.patternIndex;
    });
    resultsByFilter.forEach((result) => {
        const memberListByRuleStep = result.memberList.filter((member) => {
            return itemStep == member.matchPattern;
        });
        memberListByRuleStep.forEach((member) => {
            const rowStepData = cloneDeep(rowData);
            rowStepData['executor'] = {
                name: member.memName == undefined ? '' : member.memName,
                depName: member.depName == undefined ? '' : member.depName,
            };
            rowStepData['checked'] = true;
            combineData.push(rowStepData);
        });
    });
    return combineData;
};
const createRootNode = (rootMember) => {
    return {
        step: 0,
        title: '申請人填單',
        type: 'root',
        checked: true,
        rowList: [
            {
                order: 1,
                executor: getMember(rootMember),
            },
        ],
    };
};
export const flowNodeList = (rulePatterns, results, rootMember) => {
    let nodeList = rulePatterns.map((stepItem, index) => {
        const title = stepItem[0].synopsis;
        const type = ruleTypeMap[stepItem[0].patternType];
        let rowList = [];
        stepItem.forEach((item) => {
            const rowData = rulePatternMap[type](item);
            if (results != undefined) {
                const combineData = combine(item.siblingOrder, item.innerOrder, rowData, results);
                if (combineData.length == 0) {
                    rowList.push(Object.assign({}, rowData, { executor: { name: '', depName: '' } }));
                } else {
                    rowList = rowList.concat(combineData);
                }
            } else {
                rowList.push(rowData);
            }
        });
        return {
            step: index + 1,
            title: title,
            type: type,
            rowList: rowList,
        };
    });
    if (rootMember != undefined) {
        nodeList.unshift(createRootNode(rootMember));
    }
    console.log(`nodeList:`);
    console.log(nodeList);
    return nodeList;
};
