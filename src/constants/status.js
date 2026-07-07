// ─────────────────────────────────────────────────
// 狀態設計 token —— 全站狀態顏色/標籤的單一事實來源
// 過去這些對應散落在各 view,且顏色不一致;集中於此確保一致性。
// ─────────────────────────────────────────────────

// 流程生命週期狀態(對應 global.processTypeConverter 回傳的 type 1~4)
// adminLabel:管理端用語;userLabel:使用者端(申請表單)用語
export const PROCESS_STATUS = {
    1: { key: 'init', adminLabel: '初始', userLabel: '草稿', color: '#a99de0', bg: '#f4f2fb' },
    2: { key: 'ready', adminLabel: '待生效', userLabel: '即將生效', color: '#f4a42c', bg: '#fff8ec' },
    3: { key: 'running', adminLabel: '已生效', userLabel: '可申請', color: '#00a76f', bg: '#f0faf5' },
    4: { key: 'closed', adminLabel: '已關閉', userLabel: '已停用', color: '#9ca3af', bg: '#f4f4f5' },
};

// 申請單審核狀態
export const SUBMISSION_STATUS = {
    pending: { label: '待審核', color: '#f4a42c', bg: '#fff8ec' },
    approved: { label: '已核准', color: '#00a76f', bg: '#f0faf5' },
    rejected: { label: '已退回', color: '#e44d55', bg: '#fff0f0' },
    recalled: { label: '已撤回', color: '#8a8a8a', bg: '#f4f4f5' },
};
