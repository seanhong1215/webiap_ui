// ─────────────────────────────────────────────────
// Mock Data Layer — 作品集展示用假資料
// 日期基準：2026-06-01
// ─────────────────────────────────────────────────

// type 1 (初始): startTime='9999-12-31'
// type 2 (就緒): startTime 未來
// type 3 (執行中): startTime 過去, endTime 未來
// type 4 (關閉): endTime 過去

// ─────────────────────────────────────────────────
// 使用者帳號
// ─────────────────────────────────────────────────
export const MOCK_USERS = [
    { id: 'U001', account: 'user', password: '123456', name: '王小明', dept: '人力資源部', role: 'user', avatar: '王' },
    { id: 'A001', account: 'admin', password: 'admin', name: '李管理員', dept: '資訊管理部', role: 'admin', avatar: '李' },
];

export const MOCK_CATEGORIES = {
    PRJ001: '人事管理',
    PRJ002: '財務管理',
    PRJ003: '行政管理',
    PRJ004: '資產管理',
};

export const MOCK_CARDS = [
    {
        proID: 'PRO001',
        artID: 'ART001',
        proName: '請假申請流程',
        prjID: 'PRJ001',
        proSynopsis: '員工請假申請與主管審核流程，支援特休、事假、病假等類型',
        proRoleIDList: ['ROLE001'],
        versionIndex: 'v4',
        startTime: '2026-01-01',
        endTime: '2027-12-31',
        accessMemInfo: [{ memName: '王小明', depName: '人力資源部' }],
        deleteArtEnable: false,
    },
    {
        proID: 'PRO002',
        artID: 'ART002',
        proName: '加班申請流程',
        prjID: 'PRJ001',
        proSynopsis: '員工加班申請與工時認定，需主管及人資雙重確認',
        proRoleIDList: ['ROLE001'],
        versionIndex: 'v2',
        startTime: '2026-08-01',
        endTime: '2027-12-31',
        accessMemInfo: [{ memName: '陳美玲', depName: '人力資源部' }],
        deleteArtEnable: true,
    },
    {
        proID: 'PRO003',
        artID: 'ART003',
        proName: '費用報銷申請',
        prjID: 'PRJ002',
        proSynopsis: '差旅費、業務費等費用報銷申請，金額逾萬需財務長審核',
        proRoleIDList: ['ROLE002'],
        versionIndex: 'v6',
        startTime: '2025-06-01',
        endTime: '2027-12-31',
        accessMemInfo: [{ memName: '林志豪', depName: '財務部' }],
        deleteArtEnable: false,
    },
    {
        proID: 'PRO004',
        artID: 'ART004',
        proName: '採購申請流程',
        prjID: 'PRJ002',
        proSynopsis: '辦公用品及設備採購申請，依採購金額決定審核層級',
        proRoleIDList: ['ROLE002', 'ROLE003'],
        versionIndex: 'v1',
        startTime: '9999-12-31',
        endTime: '9999-12-31',
        accessMemInfo: [{ memName: '張雅婷', depName: '財務部' }],
        deleteArtEnable: true,
    },
    {
        proID: 'PRO005',
        artID: 'ART005',
        proName: '會議室申請流程',
        prjID: 'PRJ003',
        proSynopsis: '會議室使用申請與時段衝突確認，支援外部訪客會議申請',
        proRoleIDList: ['ROLE003'],
        versionIndex: 'v5',
        startTime: '2026-03-01',
        endTime: '2027-12-31',
        accessMemInfo: [{ memName: '吳建宏', depName: '行政部' }],
        deleteArtEnable: false,
    },
    {
        proID: 'PRO006',
        artID: 'ART006',
        proName: '車輛申請流程',
        prjID: 'PRJ003',
        proSynopsis: '公務車輛借用申請與行程安排，含駕駛人安排與回報機制',
        proRoleIDList: ['ROLE003'],
        versionIndex: 'v3',
        startTime: '2024-01-01',
        endTime: '2025-12-31',
        accessMemInfo: [{ memName: '吳建宏', depName: '行政部' }],
        deleteArtEnable: true,
    },
    {
        proID: 'PRO007',
        artID: 'ART007',
        proName: '資源借用申請',
        prjID: 'PRJ004',
        proSynopsis: '儀器設備短期借用申請，含歸還確認與損壞賠償處理流程',
        proRoleIDList: ['ROLE004'],
        versionIndex: 'v3',
        startTime: '2026-02-01',
        endTime: '2027-12-31',
        accessMemInfo: [{ memName: '劉雅惠', depName: '資產管理部' }],
        deleteArtEnable: false,
    },
    {
        proID: 'PRO008',
        artID: 'ART008',
        proName: '設備維修申請',
        prjID: 'PRJ004',
        proSynopsis: '辦公室設備故障報修申請，連結廠商維修派單系統',
        proRoleIDList: ['ROLE004'],
        versionIndex: 'v2',
        startTime: '2024-06-01',
        endTime: '2025-11-30',
        accessMemInfo: [{ memName: '劉雅惠', depName: '資產管理部' }],
        deleteArtEnable: true,
    },
];

// 版本歷史（每個流程 2-4 個版本）
const VERSION_HISTORY = {
    PRO001: [
        { proId: 'PRO001_v1', versionIndex: 'v1', proName: '請假申請流程', roleNameList: ['全公司'], prjName: '人事管理', managerDepNameList: ['人力資源部'], managerNameList: ['王小明'], createTime: '2024-03-01', startTime: '2024-03-01', endTime: '2024-09-30', executable: true, taskCount: 0, deleteArtEnable: true },
        { proId: 'PRO001_v2', versionIndex: 'v2', proName: '請假申請流程', roleNameList: ['全公司'], prjName: '人事管理', managerDepNameList: ['人力資源部'], managerNameList: ['王小明'], createTime: '2024-10-01', startTime: '2024-10-01', endTime: '2025-03-31', executable: true, taskCount: 0, deleteArtEnable: true },
        { proId: 'PRO001_v3', versionIndex: 'v3', proName: '請假申請流程', roleNameList: ['全公司'], prjName: '人事管理', managerDepNameList: ['人力資源部'], managerNameList: ['王小明'], createTime: '2025-04-01', startTime: '2025-04-01', endTime: '2025-12-31', executable: true, taskCount: 0, deleteArtEnable: true },
        { proId: 'PRO001', versionIndex: 'v4', proName: '請假申請流程', roleNameList: ['全公司'], prjName: '人事管理', managerDepNameList: ['人力資源部'], managerNameList: ['王小明'], createTime: '2026-01-01', startTime: '2026-01-01', endTime: '2027-12-31', executable: true, taskCount: 15, deleteArtEnable: false },
    ],
    PRO002: [
        { proId: 'PRO002_v1', versionIndex: 'v1', proName: '加班申請流程', roleNameList: ['全公司'], prjName: '人事管理', managerDepNameList: ['人力資源部'], managerNameList: ['陳美玲'], createTime: '2025-12-01', startTime: '2025-12-01', endTime: '2026-07-31', executable: true, taskCount: 0, deleteArtEnable: true },
        { proId: 'PRO002', versionIndex: 'v2', proName: '加班申請流程', roleNameList: ['全公司'], prjName: '人事管理', managerDepNameList: ['人力資源部'], managerNameList: ['陳美玲'], createTime: '2026-05-01', startTime: '2026-08-01', endTime: '2027-12-31', executable: true, taskCount: 0, deleteArtEnable: true },
    ],
    PRO003: [
        { proId: 'PRO003_v1', versionIndex: 'v1', proName: '費用報銷申請', roleNameList: ['全公司'], prjName: '財務管理', managerDepNameList: ['財務部'], managerNameList: ['林志豪'], createTime: '2023-01-01', startTime: '2023-01-01', endTime: '2023-06-30', executable: true, taskCount: 0, deleteArtEnable: true },
        { proId: 'PRO003_v2', versionIndex: 'v2', proName: '費用報銷申請', roleNameList: ['全公司'], prjName: '財務管理', managerDepNameList: ['財務部'], managerNameList: ['林志豪'], createTime: '2023-07-01', startTime: '2023-07-01', endTime: '2023-12-31', executable: true, taskCount: 0, deleteArtEnable: true },
        { proId: 'PRO003_v3', versionIndex: 'v3', proName: '費用報銷申請', roleNameList: ['全公司'], prjName: '財務管理', managerDepNameList: ['財務部'], managerNameList: ['林志豪'], createTime: '2024-01-01', startTime: '2024-01-01', endTime: '2024-12-31', executable: true, taskCount: 0, deleteArtEnable: true },
        { proId: 'PRO003_v4', versionIndex: 'v4', proName: '費用報銷申請', roleNameList: ['全公司'], prjName: '財務管理', managerDepNameList: ['財務部'], managerNameList: ['林志豪'], createTime: '2025-01-01', startTime: '2025-01-01', endTime: '2025-05-31', executable: true, taskCount: 0, deleteArtEnable: true },
        { proId: 'PRO003_v5', versionIndex: 'v5', proName: '費用報銷申請', roleNameList: ['全公司'], prjName: '財務管理', managerDepNameList: ['財務部'], managerNameList: ['林志豪'], createTime: '2025-06-01', startTime: '2025-06-01', endTime: '2025-12-31', executable: true, taskCount: 0, deleteArtEnable: true },
        { proId: 'PRO003', versionIndex: 'v6', proName: '費用報銷申請', roleNameList: ['全公司'], prjName: '財務管理', managerDepNameList: ['財務部'], managerNameList: ['林志豪'], createTime: '2025-06-01', startTime: '2025-06-01', endTime: '2027-12-31', executable: true, taskCount: 42, deleteArtEnable: false },
    ],
    PRO004: [
        { proId: 'PRO004_v1', versionIndex: 'v1', proName: '採購申請流程', roleNameList: ['採購人員', '主管'], prjName: '財務管理', managerDepNameList: ['財務部'], managerNameList: ['張雅婷'], createTime: '2026-04-01', startTime: '2026-04-01', endTime: '2026-05-14', executable: true, taskCount: 0, deleteArtEnable: true },
        { proId: 'PRO004', versionIndex: 'v2', proName: '採購申請流程', roleNameList: ['採購人員', '主管'], prjName: '財務管理', managerDepNameList: ['財務部'], managerNameList: ['張雅婷'], createTime: '2026-05-15', startTime: '2026-09-01', endTime: '2027-12-31', executable: false, taskCount: 0, deleteArtEnable: true },
    ],
    PRO005: [
        { proId: 'PRO005_v1', versionIndex: 'v1', proName: '會議室申請流程', roleNameList: ['全公司'], prjName: '行政管理', managerDepNameList: ['行政部'], managerNameList: ['吳建宏'], createTime: '2024-03-01', startTime: '2024-03-01', endTime: '2024-12-31', executable: true, taskCount: 0, deleteArtEnable: true },
        { proId: 'PRO005_v2', versionIndex: 'v2', proName: '會議室申請流程', roleNameList: ['全公司'], prjName: '行政管理', managerDepNameList: ['行政部'], managerNameList: ['吳建宏'], createTime: '2025-01-01', startTime: '2025-01-01', endTime: '2025-06-30', executable: true, taskCount: 0, deleteArtEnable: true },
        { proId: 'PRO005_v3', versionIndex: 'v3', proName: '會議室申請流程', roleNameList: ['全公司'], prjName: '行政管理', managerDepNameList: ['行政部'], managerNameList: ['吳建宏'], createTime: '2025-07-01', startTime: '2025-07-01', endTime: '2025-12-31', executable: true, taskCount: 0, deleteArtEnable: true },
        { proId: 'PRO005_v4', versionIndex: 'v4', proName: '會議室申請流程', roleNameList: ['全公司'], prjName: '行政管理', managerDepNameList: ['行政部'], managerNameList: ['吳建宏'], createTime: '2026-01-01', startTime: '2026-01-01', endTime: '2026-02-28', executable: true, taskCount: 0, deleteArtEnable: true },
        { proId: 'PRO005', versionIndex: 'v5', proName: '會議室申請流程', roleNameList: ['全公司'], prjName: '行政管理', managerDepNameList: ['行政部'], managerNameList: ['吳建宏'], createTime: '2026-03-01', startTime: '2026-03-01', endTime: '2027-12-31', executable: true, taskCount: 28, deleteArtEnable: false },
    ],
    PRO006: [
        { proId: 'PRO006_v1', versionIndex: 'v1', proName: '車輛申請流程', roleNameList: ['全公司'], prjName: '行政管理', managerDepNameList: ['行政部'], managerNameList: ['吳建宏'], createTime: '2024-01-01', startTime: '2024-01-01', endTime: '2024-12-31', executable: true, taskCount: 0, deleteArtEnable: true },
        { proId: 'PRO006_v2', versionIndex: 'v2', proName: '車輛申請流程', roleNameList: ['全公司'], prjName: '行政管理', managerDepNameList: ['行政部'], managerNameList: ['吳建宏'], createTime: '2025-01-01', startTime: '2025-01-01', endTime: '2025-06-30', executable: true, taskCount: 0, deleteArtEnable: true },
        { proId: 'PRO006', versionIndex: 'v3', proName: '車輛申請流程', roleNameList: ['全公司'], prjName: '行政管理', managerDepNameList: ['行政部'], managerNameList: ['吳建宏'], createTime: '2025-07-01', startTime: '2025-07-01', endTime: '2025-12-31', executable: true, taskCount: 0, deleteArtEnable: true },
    ],
    PRO007: [
        { proId: 'PRO007_v1', versionIndex: 'v1', proName: '資源借用申請', roleNameList: ['研發人員', '主管'], prjName: '資產管理', managerDepNameList: ['資產管理部'], managerNameList: ['劉雅惠'], createTime: '2025-08-01', startTime: '2025-08-01', endTime: '2026-01-31', executable: true, taskCount: 0, deleteArtEnable: true },
        { proId: 'PRO007_v2', versionIndex: 'v2', proName: '資源借用申請', roleNameList: ['研發人員', '主管'], prjName: '資產管理', managerDepNameList: ['資產管理部'], managerNameList: ['劉雅惠'], createTime: '2026-01-15', startTime: '2026-01-15', endTime: '2026-01-31', executable: true, taskCount: 0, deleteArtEnable: true },
        { proId: 'PRO007', versionIndex: 'v3', proName: '資源借用申請', roleNameList: ['研發人員', '主管'], prjName: '資產管理', managerDepNameList: ['資產管理部'], managerNameList: ['劉雅惠'], createTime: '2026-02-01', startTime: '2026-02-01', endTime: '2027-12-31', executable: true, taskCount: 7, deleteArtEnable: false },
    ],
    PRO008: [
        { proId: 'PRO008_v1', versionIndex: 'v1', proName: '設備維修申請', roleNameList: ['全公司'], prjName: '資產管理', managerDepNameList: ['資產管理部'], managerNameList: ['劉雅惠'], createTime: '2024-06-01', startTime: '2024-06-01', endTime: '2024-11-30', executable: true, taskCount: 0, deleteArtEnable: true },
        { proId: 'PRO008', versionIndex: 'v2', proName: '設備維修申請', roleNameList: ['全公司'], prjName: '資產管理', managerDepNameList: ['資產管理部'], managerNameList: ['劉雅惠'], createTime: '2024-12-01', startTime: '2024-12-01', endTime: '2025-11-30', executable: true, taskCount: 0, deleteArtEnable: true },
    ],
};

// 條件設定資料（流程狀態機）
export const CONDITION_DATA = {
    PRO001: {
        id: 'ROOT_PRO001',
        prjID: 'PRJ001',
        subProcessList: [{
            id: 'PRO001',
            name: '請假申請流程',
            outProcessList: [
                {
                    toProcessID: 'MFP001',
                    fromProcessID: 'PRO001',
                    linkTerm: {
                        artStateList: [{
                            id: 'STATE001',
                            name: '主管核准',
                            condition: 'LeaveType == "特休" && Days <= 3',
                        }],
                    },
                },
                {
                    toProcessID: 'MFP002',
                    fromProcessID: 'PRO001',
                    linkTerm: {
                        artStateList: [{
                            id: 'STATE002',
                            name: '主管與HR審核',
                            condition: 'Days > 3 || LeaveType == "病假"',
                        }],
                    },
                },
                {
                    toProcessID: 'MFP003',
                    fromProcessID: 'PRO001',
                    linkTerm: {
                        artStateList: [{
                            id: 'STATE003',
                            name: '事假核准',
                            condition: 'LeaveType == "事假" && Days <= 1',
                        }],
                    },
                },
            ],
        }],
    },
    PRO003: {
        id: 'ROOT_PRO003',
        prjID: 'PRJ002',
        subProcessList: [{
            id: 'PRO003',
            name: '費用報銷申請',
            outProcessList: [
                {
                    toProcessID: 'MFP003_1',
                    fromProcessID: 'PRO003',
                    linkTerm: {
                        artStateList: [{
                            id: 'STATE003_1',
                            name: '主管審核',
                            condition: 'Amount <= 10000',
                        }],
                    },
                },
                {
                    toProcessID: 'MFP003_2',
                    fromProcessID: 'PRO003',
                    linkTerm: {
                        artStateList: [{
                            id: 'STATE003_2',
                            name: '財務長審核',
                            condition: 'Amount > 10000 && ExpenseType == "差旅"',
                        }],
                    },
                },
                {
                    toProcessID: 'MFP003_3',
                    fromProcessID: 'PRO003',
                    linkTerm: {
                        artStateList: [{
                            id: 'STATE003_3',
                            name: '董事長審核',
                            condition: 'Amount > 50000',
                        }],
                    },
                },
            ],
        }],
    },
    PRO005: {
        id: 'ROOT_PRO005',
        prjID: 'PRJ003',
        subProcessList: [{
            id: 'PRO005',
            name: '會議室申請流程',
            outProcessList: [
                {
                    toProcessID: 'MFP005_1',
                    fromProcessID: 'PRO005',
                    linkTerm: {
                        artStateList: [{
                            id: 'STATE005_1',
                            name: '一般申請核准',
                            condition: 'HasExternalGuest == "false" && Duration <= 120',
                        }],
                    },
                },
                {
                    toProcessID: 'MFP005_2',
                    fromProcessID: 'PRO005',
                    linkTerm: {
                        artStateList: [{
                            id: 'STATE005_2',
                            name: '含外賓申請審核',
                            condition: 'HasExternalGuest == "true"',
                        }],
                    },
                },
            ],
        }],
    },
    PRO007: {
        id: 'ROOT_PRO007',
        prjID: 'PRJ004',
        subProcessList: [{
            id: 'PRO007',
            name: '資源借用申請',
            outProcessList: [
                {
                    toProcessID: 'MFP007_1',
                    fromProcessID: 'PRO007',
                    linkTerm: {
                        artStateList: [{
                            id: 'STATE007_1',
                            name: '短期借用核准',
                            condition: 'BorrowDays <= 7 && ItemType != "精密儀器"',
                        }],
                    },
                },
                {
                    toProcessID: 'MFP007_2',
                    fromProcessID: 'PRO007',
                    linkTerm: {
                        artStateList: [{
                            id: 'STATE007_2',
                            name: '長期借用審核',
                            condition: 'BorrowDays > 7 || ItemType == "精密儀器"',
                        }],
                    },
                },
            ],
        }],
    },
};

// 表單欄位（按流程）
export const ARTIFACT_ITEMS = {
    ART001: [
        { name: 'LeaveType', synopsis: '請假類型', dbType: 'VARCHAR', type: 'ChoiceBox', id: 'ART001_ITEM1' },
        { name: 'Days', synopsis: '請假天數', dbType: 'NUMBER', type: 'NumberField', id: 'ART001_ITEM2' },
        { name: 'StartDate', synopsis: '開始日期', dbType: 'DATE', type: 'DateField', id: 'ART001_ITEM3' },
        { name: 'EndDate', synopsis: '結束日期', dbType: 'DATE', type: 'DateField', id: 'ART001_ITEM4' },
        { name: 'Reason', synopsis: '請假原因', dbType: 'VARCHAR', type: 'TextField', id: 'ART001_ITEM5' },
    ],
    ART003: [
        { name: 'ExpenseType', synopsis: '費用類型', dbType: 'VARCHAR', type: 'ChoiceBox', id: 'ART003_ITEM1' },
        { name: 'Amount', synopsis: '金額', dbType: 'NUMBER', type: 'NumberField', id: 'ART003_ITEM2' },
        { name: 'ExpenseDate', synopsis: '費用日期', dbType: 'DATE', type: 'DateField', id: 'ART003_ITEM3' },
        { name: 'Description', synopsis: '費用說明', dbType: 'VARCHAR', type: 'TextField', id: 'ART003_ITEM4' },
    ],
    ART005: [
        { name: 'RoomId', synopsis: '會議室', dbType: 'VARCHAR', type: 'ChoiceBox', id: 'ART005_ITEM1' },
        { name: 'Duration', synopsis: '使用時數(分)', dbType: 'NUMBER', type: 'NumberField', id: 'ART005_ITEM2' },
        { name: 'Attendees', synopsis: '預計人數', dbType: 'NUMBER', type: 'NumberField', id: 'ART005_ITEM3' },
        { name: 'HasExternalGuest', synopsis: '是否有外部訪客', dbType: 'VARCHAR', type: 'ChoiceBox', id: 'ART005_ITEM4' },
        { name: 'Purpose', synopsis: '會議目的', dbType: 'VARCHAR', type: 'TextField', id: 'ART005_ITEM5' },
    ],
    ART007: [
        { name: 'ItemType', synopsis: '借用品項類型', dbType: 'VARCHAR', type: 'ChoiceBox', id: 'ART007_ITEM1' },
        { name: 'ItemName', synopsis: '借用品項名稱', dbType: 'VARCHAR', type: 'TextField', id: 'ART007_ITEM2' },
        { name: 'BorrowDays', synopsis: '借用天數', dbType: 'NUMBER', type: 'NumberField', id: 'ART007_ITEM3' },
        { name: 'ReturnDate', synopsis: '預計歸還日期', dbType: 'DATE', type: 'DateField', id: 'ART007_ITEM4' },
        { name: 'Purpose', synopsis: '借用用途', dbType: 'VARCHAR', type: 'TextField', id: 'ART007_ITEM5' },
    ],
};

const ARTIFACT_NAMES = {
    ART001: '請假申請單',
    ART002: '加班申請單',
    ART003: '費用報銷單',
    ART004: '採購申請單',
    ART005: '會議室申請單',
    ART006: '車輛申請單',
    ART007: '資源借用申請單',
    ART008: '設備維修申請單',
};

// ─────────────────────────────────────────────────
// Mock API Response Builders
// ─────────────────────────────────────────────────

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockMfpManagerSimple = async () => {
    await delay();
    return {
        data: {
            data: {
                categories: MOCK_CATEGORIES,
                cards: MOCK_CARDS,
            },
        },
    };
};

export const mockVersionList = async (proId) => {
    await delay();
    const versions = VERSION_HISTORY[proId] || [];
    return {
        status: 200,
        data: { data: versions },
    };
};

export const mockProcessDetail = async (proId) => {
    await delay();
    const data = CONDITION_DATA[proId] || CONDITION_DATA['PRO001'];
    return {
        data: { data },
    };
};

export const mockArtifact = async (artId) => {
    await delay();
    return {
        data: { data: { name: ARTIFACT_NAMES[artId] || '申請單' } },
    };
};

export const mockArtifactItems = async (artId) => {
    await delay();
    const items = ARTIFACT_ITEMS[artId] || ARTIFACT_ITEMS['ART001'];
    return {
        data: { data: items },
    };
};

// ─────────────────────────────────────────────────
// 流程月均申請量
// ─────────────────────────────────────────────────
export const MOCK_PROCESS_MONTHLY_COUNT = {
    PRO001: 18, PRO002: 7, PRO003: 12, PRO004: 0,
    PRO005: 28, PRO006: 3, PRO007: 9, PRO008: 0,
};

// ─────────────────────────────────────────────────
// 管理後台申請記錄（所有使用者）
// ─────────────────────────────────────────────────
export const MOCK_ADMIN_RECORDS = [
    {
        id: 'REC001', serialNo: 'LEAVE-2026-0528-001',
        submitterName: '王小明', submitterDept: '人力資源部',
        proId: 'PRO001', formName: '請假申請流程', category: '人事管理',
        submittedAt: '2026-05-28', status: 'pending', currentStep: '主管審核',
        steps: [
            { name: '申請送出', actor: '王小明', date: '2026-05-28', status: 'done' },
            { name: '主管審核', actor: '李建國 部長', date: '', status: 'current' },
            { name: 'HR 確認', actor: '陳美玲 人資', date: '', status: 'waiting' },
        ],
        formData: { LeaveType: '特休', Days: '3', StartDate: '2026-06-05', EndDate: '2026-06-07', Reason: '家庭旅遊' },
    },
    {
        id: 'REC002', serialNo: 'EXP-2026-0520-003',
        submitterName: '王小明', submitterDept: '人力資源部',
        proId: 'PRO003', formName: '費用報銷申請', category: '財務管理',
        submittedAt: '2026-05-20', status: 'approved', currentStep: '完成',
        steps: [
            { name: '申請送出', actor: '王小明', date: '2026-05-20', status: 'done' },
            { name: '主管審核', actor: '李建國 部長', date: '2026-05-21', status: 'done', remark: '同意報銷' },
            { name: '財務審核', actor: '林志豪 財務長', date: '2026-05-22', status: 'done', remark: '已核帳' },
        ],
        formData: { ExpenseType: '差旅費', Amount: '4500', ExpenseDate: '2026-05-18', Description: '北部出差住宿費用' },
    },
    {
        id: 'REC003', serialNo: 'ROOM-2026-0601-002',
        submitterName: '王小明', submitterDept: '人力資源部',
        proId: 'PRO005', formName: '會議室申請流程', category: '行政管理',
        submittedAt: '2026-06-01', status: 'approved', currentStep: '完成',
        steps: [
            { name: '申請送出', actor: '王小明', date: '2026-06-01', status: 'done' },
            { name: '行政確認', actor: '吳建宏 行政', date: '2026-06-01', status: 'done', remark: 'A會議室已確保' },
        ],
        formData: { RoomId: 'A會議室', Duration: '90', Attendees: '8', HasExternalGuest: 'false', Purpose: '季度業績檢討' },
    },
    {
        id: 'REC004', serialNo: 'BORROW-2026-0525-001',
        submitterName: '王小明', submitterDept: '人力資源部',
        proId: 'PRO007', formName: '資源借用申請', category: '資產管理',
        submittedAt: '2026-05-25', status: 'rejected', currentStep: '退回',
        steps: [
            { name: '申請送出', actor: '王小明', date: '2026-05-25', status: 'done' },
            { name: '主管審核', actor: '李建國 部長', date: '2026-05-26', status: 'rejected', remark: '借用期間過長，請重新申請' },
        ],
        formData: { ItemType: '精密儀器', ItemName: '示波器 DS1054Z', BorrowDays: '30', ReturnDate: '2026-06-24', Purpose: '研發測試用途' },
    },
    {
        id: 'REC005', serialNo: 'LEAVE-2026-0601-002',
        submitterName: '王小明', submitterDept: '人力資源部',
        proId: 'PRO001', formName: '請假申請流程', category: '人事管理',
        submittedAt: '2026-06-01', status: 'pending', currentStep: '主管審核',
        steps: [
            { name: '申請送出', actor: '王小明', date: '2026-06-01', status: 'done' },
            { name: '主管審核', actor: '李建國 部長', date: '', status: 'current' },
        ],
        formData: { LeaveType: '病假', Days: '1', StartDate: '2026-06-03', EndDate: '2026-06-03', Reason: '身體不適' },
    },
    {
        id: 'REC006', serialNo: 'LEAVE-2026-0601-005',
        submitterName: '張雅婷', submitterDept: '財務部',
        proId: 'PRO001', formName: '請假申請流程', category: '人事管理',
        submittedAt: '2026-06-01', status: 'pending', currentStep: '主管審核',
        steps: [
            { name: '申請送出', actor: '張雅婷', date: '2026-06-01', status: 'done' },
            { name: '主管審核', actor: '李建國 部長', date: '', status: 'current' },
        ],
        formData: { LeaveType: '事假', Days: '2', StartDate: '2026-06-04', EndDate: '2026-06-05', Reason: '家庭事宜' },
    },
    {
        id: 'REC007', serialNo: 'EXP-2026-0531-002',
        submitterName: '吳建宏', submitterDept: '行政部',
        proId: 'PRO003', formName: '費用報銷申請', category: '財務管理',
        submittedAt: '2026-05-31', status: 'pending', currentStep: '財務審核',
        steps: [
            { name: '申請送出', actor: '吳建宏', date: '2026-05-31', status: 'done' },
            { name: '主管審核', actor: '李建國 部長', date: '2026-05-31', status: 'done', remark: '同意' },
            { name: '財務審核', actor: '林志豪 財務長', date: '', status: 'current' },
        ],
        formData: { ExpenseType: '業務費', Amount: '12500', ExpenseDate: '2026-05-30', Description: '客戶餐敘費用' },
    },
    {
        id: 'REC008', serialNo: 'BORROW-2026-0530-001',
        submitterName: '林志豪', submitterDept: '財務部',
        proId: 'PRO007', formName: '資源借用申請', category: '資產管理',
        submittedAt: '2026-05-30', status: 'pending', currentStep: '主管審核',
        steps: [
            { name: '申請送出', actor: '林志豪', date: '2026-05-30', status: 'done' },
            { name: '主管審核', actor: '李建國 部長', date: '', status: 'current' },
        ],
        formData: { ItemType: '一般設備', ItemName: '投影機 EPSON X41', BorrowDays: '5', ReturnDate: '2026-06-04', Purpose: '外部簡報使用' },
    },
    {
        id: 'REC009', serialNo: 'LEAVE-2026-0529-003',
        submitterName: '劉雅惠', submitterDept: '資產管理部',
        proId: 'PRO001', formName: '請假申請流程', category: '人事管理',
        submittedAt: '2026-05-29', status: 'pending', currentStep: '主管審核',
        steps: [
            { name: '申請送出', actor: '劉雅惠', date: '2026-05-29', status: 'done' },
            { name: '主管審核', actor: '李建國 部長', date: '', status: 'current' },
        ],
        formData: { LeaveType: '特休', Days: '5', StartDate: '2026-06-08', EndDate: '2026-06-12', Reason: '出國旅遊' },
    },
    {
        id: 'REC010', serialNo: 'EXP-2026-0510-001',
        submitterName: '陳美玲', submitterDept: '人力資源部',
        proId: 'PRO003', formName: '費用報銷申請', category: '財務管理',
        submittedAt: '2026-05-10', status: 'approved', currentStep: '完成',
        steps: [
            { name: '申請送出', actor: '陳美玲', date: '2026-05-10', status: 'done' },
            { name: '主管審核', actor: '李建國 部長', date: '2026-05-11', status: 'done', remark: '核准' },
            { name: '財務審核', actor: '林志豪 財務長', date: '2026-05-12', status: 'done', remark: '已入帳' },
        ],
        formData: { ExpenseType: '差旅費', Amount: '2800', ExpenseDate: '2026-05-08', Description: '南部客戶拜訪交通費' },
    },
    {
        id: 'REC011', serialNo: 'ROOM-2026-0520-001',
        submitterName: '林志豪', submitterDept: '財務部',
        proId: 'PRO005', formName: '會議室申請流程', category: '行政管理',
        submittedAt: '2026-05-20', status: 'approved', currentStep: '完成',
        steps: [
            { name: '申請送出', actor: '林志豪', date: '2026-05-20', status: 'done' },
            { name: '行政確認', actor: '吳建宏 行政', date: '2026-05-20', status: 'done', remark: 'B會議室確認' },
        ],
        formData: { RoomId: 'B會議室', Duration: '120', Attendees: '15', HasExternalGuest: 'true', Purpose: '年度財務報告' },
    },
    {
        id: 'REC012', serialNo: 'LEAVE-2026-0515-002',
        submitterName: '劉雅惠', submitterDept: '資產管理部',
        proId: 'PRO001', formName: '請假申請流程', category: '人事管理',
        submittedAt: '2026-05-15', status: 'approved', currentStep: '完成',
        steps: [
            { name: '申請送出', actor: '劉雅惠', date: '2026-05-15', status: 'done' },
            { name: '主管審核', actor: '李建國 部長', date: '2026-05-15', status: 'done', remark: '核准' },
            { name: 'HR 確認', actor: '陳美玲 人資', date: '2026-05-16', status: 'done', remark: '已登記' },
        ],
        formData: { LeaveType: '事假', Days: '1', StartDate: '2026-05-22', EndDate: '2026-05-22', Reason: '個人事項' },
    },
];

// ─────────────────────────────────────────────────
// 使用者申請紀錄（我的申請）
// ─────────────────────────────────────────────────
export const MOCK_SUBMISSIONS = [
    {
        id: 'SUB001',
        serialNo: 'LEAVE-2026-0528-001',
        proId: 'PRO001',
        formName: '請假申請流程',
        category: '人事管理',
        submittedAt: '2026-05-28',
        status: 'pending',
        currentStep: '主管審核',
        steps: [
            { name: '申請送出', actor: '本人', date: '2026-05-28', status: 'done' },
            { name: '主管審核', actor: '李建國 部長', date: '', status: 'current' },
            { name: 'HR 確認', actor: '陳美玲 人資', date: '', status: 'waiting' },
        ],
        formData: { LeaveType: '特休', Days: '3', StartDate: '2026-06-05', EndDate: '2026-06-07', Reason: '家庭旅遊' },
    },
    {
        id: 'SUB002',
        serialNo: 'EXP-2026-0520-003',
        proId: 'PRO003',
        formName: '費用報銷申請',
        category: '財務管理',
        submittedAt: '2026-05-20',
        status: 'approved',
        currentStep: '完成',
        steps: [
            { name: '申請送出', actor: '本人', date: '2026-05-20', status: 'done' },
            { name: '主管審核', actor: '李建國 部長', date: '2026-05-21', status: 'done', remark: '同意報銷' },
            { name: '財務審核', actor: '林志豪 財務長', date: '2026-05-22', status: 'done', remark: '已核帳' },
        ],
        formData: { ExpenseType: '差旅費', Amount: '4500', ExpenseDate: '2026-05-18', Description: '北部出差住宿費用' },
    },
    {
        id: 'SUB003',
        serialNo: 'ROOM-2026-0601-002',
        proId: 'PRO005',
        formName: '會議室申請流程',
        category: '行政管理',
        submittedAt: '2026-06-01',
        status: 'approved',
        currentStep: '完成',
        steps: [
            { name: '申請送出', actor: '本人', date: '2026-06-01', status: 'done' },
            { name: '行政確認', actor: '吳建宏 行政', date: '2026-06-01', status: 'done', remark: 'A會議室已確保' },
        ],
        formData: { RoomId: 'A會議室', Duration: '90', Attendees: '8', HasExternalGuest: 'false', Purpose: '季度業績檢討' },
    },
    {
        id: 'SUB004',
        serialNo: 'BORROW-2026-0525-001',
        proId: 'PRO007',
        formName: '資源借用申請',
        category: '資產管理',
        submittedAt: '2026-05-25',
        status: 'rejected',
        currentStep: '退回',
        steps: [
            { name: '申請送出', actor: '本人', date: '2026-05-25', status: 'done' },
            { name: '主管審核', actor: '李建國 部長', date: '2026-05-26', status: 'rejected', remark: '借用期間過長，請重新申請' },
        ],
        formData: { ItemType: '精密儀器', ItemName: '示波器 DS1054Z', BorrowDays: '30', ReturnDate: '2026-06-24', Purpose: '研發測試用途' },
    },
    {
        id: 'SUB005',
        serialNo: 'LEAVE-2026-0601-002',
        proId: 'PRO001',
        formName: '請假申請流程',
        category: '人事管理',
        submittedAt: '2026-06-01',
        status: 'pending',
        currentStep: '主管審核',
        steps: [
            { name: '申請送出', actor: '本人', date: '2026-06-01', status: 'done' },
            { name: '主管審核', actor: '李建國 部長', date: '', status: 'current' },
            { name: 'HR 確認', actor: '陳美玲 人資', date: '', status: 'waiting' },
        ],
        formData: { LeaveType: '病假', Days: '1', StartDate: '2026-06-03', EndDate: '2026-06-03', Reason: '身體不適' },
    },
];

// ─────────────────────────────────────────────────
// 待我審核的申請（審核中心）
// ─────────────────────────────────────────────────
export const MOCK_PENDING_APPROVALS = [
    {
        id: 'APPR001',
        serialNo: 'LEAVE-2026-0601-005',
        submittedBy: '張雅婷',
        submittedByDept: '財務部',
        submittedAt: '2026-06-01',
        proId: 'PRO001',
        formName: '請假申請流程',
        category: '人事管理',
        urgency: 'normal',
        currentStep: '主管審核',
        formData: { LeaveType: '事假', Days: '2', StartDate: '2026-06-04', EndDate: '2026-06-05', Reason: '家庭事宜' },
    },
    {
        id: 'APPR002',
        serialNo: 'EXP-2026-0531-002',
        submittedBy: '吳建宏',
        submittedByDept: '行政部',
        submittedAt: '2026-05-31',
        proId: 'PRO003',
        formName: '費用報銷申請',
        category: '財務管理',
        urgency: 'urgent',
        currentStep: '財務審核',
        formData: { ExpenseType: '業務費', Amount: '12500', ExpenseDate: '2026-05-30', Description: '客戶餐敘費用' },
    },
    {
        id: 'APPR003',
        serialNo: 'BORROW-2026-0530-001',
        submittedBy: '林志豪',
        submittedByDept: '財務部',
        submittedAt: '2026-05-30',
        proId: 'PRO007',
        formName: '資源借用申請',
        category: '資產管理',
        urgency: 'normal',
        currentStep: '主管審核',
        formData: { ItemType: '一般設備', ItemName: '投影機 EPSON X41', BorrowDays: '5', ReturnDate: '2026-06-04', Purpose: '外部簡報使用' },
    },
    {
        id: 'APPR004',
        serialNo: 'LEAVE-2026-0529-003',
        submittedBy: '劉雅惠',
        submittedByDept: '資產管理部',
        submittedAt: '2026-05-29',
        proId: 'PRO001',
        formName: '請假申請流程',
        category: '人事管理',
        urgency: 'normal',
        currentStep: '主管審核',
        formData: { LeaveType: '特休', Days: '5', StartDate: '2026-06-08', EndDate: '2026-06-12', Reason: '出國旅遊' },
    },
];

// ─────────────────────────────────────────────────
// Dashboard 統計資料
// ─────────────────────────────────────────────────
export const MOCK_DASHBOARD_STATS = {
    pendingMyAction: 4,
    mySubmissions: { total: 5, pending: 2, approved: 2, rejected: 1 },
    thisMonthApproved: 18,
    avgApprovalHours: 6.5,
    recentActivity: [
        { time: '2 小時前', text: '費用報銷申請 EXP-2026-0531-002 等待您審核', type: 'urgent' },
        { time: '今天 09:15', text: '您的請假申請 LEAVE-2026-0601-002 已送出', type: 'info' },
        { time: '昨天 17:30', text: '會議室申請 ROOM-2026-0601-002 已核准', type: 'success' },
        { time: '昨天 14:20', text: '資源借用申請 BORROW-2026-0525-001 已被退回', type: 'error' },
        { time: '05/22', text: '費用報銷申請 EXP-2026-0520-003 已核准匯款', type: 'success' },
    ],
};

export const mockMfpManagerByProId = async (proId) => {
    await delay();
    const rootProId = proId.split('_')[0];
    const card = MOCK_CARDS.find((c) => c.proID === rootProId) || MOCK_CARDS[0];
    const condData = CONDITION_DATA[rootProId] || null;
    const artItems = ARTIFACT_ITEMS[card.artID] || [];
    return {
        data: {
            data: {
                accessMemInfo: card.accessMemInfo.map((m) => ({ memName: m.memName, depName: m.depName })),
                process: {
                    id: card.proID,
                    name: card.proName,
                    prjID: card.prjID,
                    synopsis: card.proSynopsis,
                    roleIDList: card.proRoleIDList,
                    subProcessList: condData ? condData.subProcessList : [],
                    version: {
                        number: parseInt(card.versionIndex.replace('v', '')),
                        startTime: card.startTime,
                        endTime: card.endTime,
                        executable: card.endTime === '9999-12-31' ? false : true,
                    },
                },
                artifact: {
                    id: card.artID,
                    artFormItemList: artItems.map((item) => ({
                        id: item.id,
                        name: item.name,
                        dbtype: item.dbType,
                        dbsize: '',
                        properties: { labelText: item.synopsis },
                        synopsis: item.synopsis,
                        javaType: item.dbType.toLowerCase(),
                    })),
                },
            },
        },
    };
};
