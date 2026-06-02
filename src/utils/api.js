import {
    mockMfpManagerSimple,
    mockMfpManagerByProId,
    mockVersionList,
    mockProcessDetail,
    mockArtifact,
    mockArtifactItems,
} from './mockData';

const noop = () => Promise.resolve({ data: { data: {} } });
let _newIdCounter = 1000;
const mockNewId = () => Promise.resolve({ status: 200, data: { data: { newId: `MOCK_ID_${++_newIdCounter}` } } });
const mockSaveSuccess = () => Promise.resolve({ status: 200, data: {} });

// 取得使用者可編輯的 MFP 流程 & 表單資料(簡易版)
export const apiMfpManagerSimple = () => mockMfpManagerSimple();
// 取得特定的 MFP 流程 & 表單資料
export const apiMfpManagerByProId = (proId) => mockMfpManagerByProId(proId);

// 取得流程版本
export const apiVersion = (proId) => mockVersionList(proId);
// 取得指定流程
export const apiProcess = (proId) => mockProcessDetail(proId);
// 更新指定流程
export const apiUpdateProcess = noop;
// 刪除指定流程
export const apiDeleteProcess = noop;
// 流程下線
export const apiProcessOffline = noop;
// 另存新版流程
export const apiSaveAnotherVersion = noop;
// 儲存條件
export const apiStateSave = mockSaveSuccess;
// 發布條件
export const apiStateRelease = mockSaveSuccess;

// 取得指定表單元件資料
export const apiArtifacts = (artId) => mockArtifact(artId);
// 取得表單元件ITEM項目
export const apiArtifactItems = (artId) => mockArtifactItems(artId);
// 取得指定表單名稱
export const apiArtifactName = (artId) => mockArtifact(artId);
// 取得指定表單畫面連結 URL
export const apiArtifactView = noop;
export const apiArtifactViewWithTitle = noop;
// 取得所有狀態的資料進階設定資料
export const apiAdvItem = noop;
export const apiAdvItemSave = noop;
export const apiAdvCmp = noop;
// 刪除表單
export const apiDeleteMfpArtifact = noop;

// 取得 MFP 節點規則
export const apiRulePattern = noop;

// 以下為不使用功能，保留 export 避免引用錯誤
export const apiMfpManager = noop;
export const apiMailTemplate = () => Promise.resolve({ data: { data: {} } });
export const apiTimeCtrlFunc = () => Promise.resolve({ data: { data: {} } });
export const apiDownloadFlowDoc = noop;
export const apiOrgTree = noop;
export const apiOrgTreeSearch = noop;
export const apiNewId = mockNewId;
export const apiPrjWithRootProList = noop;
export const apiExportMfpProcess = noop;
export const apiImportMfpProcess = noop;
export const apiProjectRoles = noop;
export const apiSimulateProVariable = noop;
export const apiSimulateMfpVariable = noop;
export const apiSimulateResults = noop;
export const apiNotification = noop;
export const apiUpdateNotification = noop;
export const apiAddAdvform = noop;
export const apiGroupSignSetting = noop;
export const apiGroupSignItemList = noop;
export const apiGroupSignSettingSave = noop;
export const apiDtTemplate = noop;
export const apiDtTemplateInsert = noop;
export const apiDtTemplateUpdate = noop;
export const apiUpdateProcessByString = noop;
