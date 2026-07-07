<template>
    <div class="approval-center">
        <!-- 標籤切換 -->
        <div class="tab-bar">
            <button :class="['tab-btn', { active: tab === 'pending' }]" @click="tab = 'pending'">
                待我審核
                <span class="tab-badge">{{ pendingApprovals.length }}</span>
            </button>
            <button :class="['tab-btn', { active: tab === 'history' }]" @click="tab = 'history'">已處理紀錄</button>
        </div>

        <!-- 待審核列表 -->
        <template v-if="tab === 'pending'">
            <div v-if="pendingApprovals.length === 0" class="empty-state">
                <i class="ti ti-circle-check empty-icon"></i>
                <div>目前沒有待審核的申請</div>
            </div>
            <div v-else class="approval-list">
                <div v-for="appr in pendingApprovals" :key="appr.id" class="appr-card" @click="openApproval(appr)">
                    <div class="appr-left">
                        <div class="appr-urgency" :class="appr.urgency">
                            <i :class="appr.urgency === 'urgent' ? 'ti ti-exclamation-circle' : 'ti ti-clock'"></i>
                        </div>
                    </div>
                    <div class="appr-body">
                        <div class="appr-title">
                            <span class="appr-form-name">{{ appr.formName }}</span>
                            <span v-if="appr.urgency === 'urgent'" class="urgency-tag">緊急</span>
                        </div>
                        <div class="appr-submitter"><i class="ti ti-user"></i> {{ appr.submittedBy }}（{{ appr.submittedByDept }}）</div>
                        <div class="appr-meta">
                            <span><i class="ti ti-hash"></i> {{ appr.serialNo }}</span>
                            <span><i class="ti ti-calendar"></i> {{ appr.submittedAt }}</span>
                            <span class="cat-tag">{{ appr.category }}</span>
                        </div>
                        <!-- 表單摘要 -->
                        <div class="form-preview">
                            <div v-for="(v, k) in previewData(appr)" :key="k" class="fp-item">
                                <span class="fp-key">{{ k }}：</span><span class="fp-val">{{ v }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="appr-actions" @click.stop>
                        <button class="act-btn approve" @click="doApprove(appr)"><i class="ti ti-check"></i> 核准</button>
                        <button class="act-btn reject" @click="doReject(appr)"><i class="ti ti-x"></i> 退回</button>
                    </div>
                </div>
            </div>
        </template>

        <!-- 已處理紀錄 -->
        <template v-if="tab === 'history'">
            <div class="history-table">
                <table>
                    <thead>
                        <tr>
                            <th>申請編號</th>
                            <th>表單類型</th>
                            <th>申請人</th>
                            <th>申請日期</th>
                            <th>我的決定</th>
                            <th>處理時間</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="h in historyList" :key="h.id">
                            <td class="serial">{{ h.serialNo }}</td>
                            <td>{{ h.formName }}</td>
                            <td>{{ h.submittedBy }}</td>
                            <td>{{ h.submittedAt }}</td>
                            <td>
                                <span class="decision-badge" :class="h.decision">{{
                                    h.decision === 'approved' ? '已核准' : '已退回'
                                }}</span>
                            </td>
                            <td class="time-col">{{ h.decidedAt }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 審核 Dialog -->
        <teleport to="#portal-target">
            <div v-if="activeApproval" class="appr-dialog-overlay" @click.self="activeApproval = null">
                <div class="appr-dialog">
                    <div class="dialog-header">
                        <div class="dialog-title">{{ activeApproval.formName }}</div>
                        <button class="dialog-close" @click="activeApproval = null"><i class="ti ti-x"></i></button>
                    </div>
                    <div class="dialog-body">
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-label">申請人</div>
                                <div class="info-value">{{ activeApproval.submittedBy }}（{{ activeApproval.submittedByDept }}）</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">申請編號</div>
                                <div class="info-value">{{ activeApproval.serialNo }}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">申請日期</div>
                                <div class="info-value">{{ activeApproval.submittedAt }}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">目前關卡</div>
                                <div class="info-value">{{ activeApproval.currentStep }}</div>
                            </div>
                        </div>
                        <div class="form-detail-section">
                            <div class="fds-title">申請內容</div>
                            <div class="fds-grid">
                                <div v-for="(v, k) in labeledFormData(activeApproval)" :key="k" class="fds-row">
                                    <div class="fds-key">{{ k }}</div>
                                    <div class="fds-val">{{ v }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="remark-section">
                            <label class="remark-label">審核備註（選填）</label>
                            <textarea v-model="remark" class="remark-input" rows="3" placeholder="輸入審核意見..."></textarea>
                        </div>
                    </div>
                    <div class="dialog-footer">
                        <button class="act-btn reject" @click="confirmReject"><i class="ti ti-x"></i> 退回申請</button>
                        <button class="act-btn approve" @click="confirmApprove"><i class="ti ti-check"></i> 核准通過</button>
                    </div>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script>
import { MOCK_PENDING_APPROVALS } from '@/utils/mockData';

const FIELD_LABELS = {
    LeaveType: '請假類型',
    Days: '天數',
    StartDate: '開始日期',
    EndDate: '結束日期',
    Reason: '原因',
    ExpenseType: '費用類型',
    Amount: '金額（元）',
    ExpenseDate: '費用日期',
    Description: '說明',
    RoomId: '會議室',
    Duration: '使用時數(分)',
    Attendees: '預計人數',
    HasExternalGuest: '含外部訪客',
    Purpose: '用途',
    ItemType: '品項類型',
    ItemName: '品項名稱',
    BorrowDays: '借用天數',
    ReturnDate: '歸還日期',
};

export default {
    name: 'ApprovalCenter',
    data() {
        return {
            tab: 'pending',
            pendingApprovals: [...MOCK_PENDING_APPROVALS],
            activeApproval: null,
            remark: '',
            historyList: [
                {
                    id: 'H001',
                    serialNo: 'EXP-2026-0520-003',
                    formName: '費用報銷申請',
                    submittedBy: '本人',
                    submittedAt: '2026-05-20',
                    decision: 'approved',
                    decidedAt: '2026-05-21 10:30',
                },
                {
                    id: 'H002',
                    serialNo: 'ROOM-2026-0515-001',
                    formName: '會議室申請流程',
                    submittedBy: '張雅婷',
                    submittedAt: '2026-05-15',
                    decision: 'approved',
                    decidedAt: '2026-05-15 14:10',
                },
                {
                    id: 'H003',
                    serialNo: 'BORROW-2026-0510-002',
                    formName: '資源借用申請',
                    submittedBy: '吳建宏',
                    submittedAt: '2026-05-10',
                    decision: 'rejected',
                    decidedAt: '2026-05-11 09:00',
                },
                {
                    id: 'H004',
                    serialNo: 'LEAVE-2026-0508-001',
                    formName: '請假申請流程',
                    submittedBy: '劉雅惠',
                    submittedAt: '2026-05-08',
                    decision: 'approved',
                    decidedAt: '2026-05-08 16:45',
                },
            ],
        };
    },
    methods: {
        previewData(appr) {
            const d = appr.formData;
            const keys = Object.keys(d).slice(0, 3);
            const result = {};
            keys.forEach((k) => {
                result[FIELD_LABELS[k] || k] = d[k];
            });
            return result;
        },
        labeledFormData(appr) {
            const result = {};
            Object.entries(appr.formData).forEach(([k, v]) => {
                result[FIELD_LABELS[k] || k] = v;
            });
            return result;
        },
        openApproval(appr) {
            this.activeApproval = appr;
            this.remark = '';
        },
        doApprove(appr) {
            this.activeApproval = appr;
            this.confirmApprove();
        },
        doReject(appr) {
            this.activeApproval = appr;
            this.confirmReject();
        },
        confirmApprove() {
            this.pendingApprovals = this.pendingApprovals.filter((a) => a.id !== this.activeApproval.id);
            this.historyList.unshift({
                id: this.activeApproval.id,
                serialNo: this.activeApproval.serialNo,
                formName: this.activeApproval.formName,
                submittedBy: this.activeApproval.submittedBy,
                submittedAt: this.activeApproval.submittedAt,
                decision: 'approved',
                decidedAt: '2026-06-02 (剛剛)',
            });
            this.activeApproval = null;
            this.$message?.success('已核准此申請');
        },
        confirmReject() {
            this.pendingApprovals = this.pendingApprovals.filter((a) => a.id !== this.activeApproval.id);
            this.historyList.unshift({
                id: this.activeApproval.id,
                serialNo: this.activeApproval.serialNo,
                formName: this.activeApproval.formName,
                submittedBy: this.activeApproval.submittedBy,
                submittedAt: this.activeApproval.submittedAt,
                decision: 'rejected',
                decidedAt: '2026-06-02 (剛剛)',
            });
            this.activeApproval = null;
            this.$message?.warning('已退回此申請');
        },
    },
};
</script>

<style lang="scss" scoped>
$accent: #6e5faf;
$approve: #00a76f;
$reject: #e44d55;

.approval-center {
}

// ── Tabs ─────────────────────────────────────────
.tab-bar {
    display: flex;
    gap: 4px;
    margin-bottom: 20px;
    background: #fff;
    border-radius: 10px;
    padding: 4px;
    border: 1px solid #eaecf0;
    width: fit-content;
}

.tab-btn {
    padding: 8px 20px;
    border-radius: 8px;
    border: none;
    background: transparent;
    font-size: 14px;
    color: #5c6466;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.15s;

    .tab-badge {
        background: #e44d55;
        color: #fff;
        font-size: 11px;
        min-width: 18px;
        height: 18px;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 4px;
    }

    &.active {
        background: $accent;
        color: #fff;
        font-weight: 600;
        .tab-badge {
            background: rgba(255, 255, 255, 0.25);
        }
    }
}

// ── Approval List ─────────────────────────────────
.approval-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.appr-card {
    background: #fff;
    border-radius: 12px;
    border: 1.5px solid #eaecf0;
    padding: 20px;
    display: flex;
    gap: 16px;
    align-items: flex-start;
    cursor: pointer;
    transition: all 0.15s;

    &:hover {
        border-color: $accent;
        box-shadow: 0 4px 16px rgba(110, 95, 175, 0.08);
    }
}

.appr-left {
    .appr-urgency {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        &.urgent {
            background: #fff0f0;
            color: $reject;
        }
        &.normal {
            background: #f0eeff;
            color: $accent;
        }
    }
}

.appr-body {
    flex: 1;
    min-width: 0;

    .appr-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
        .appr-form-name {
            font-size: 16px;
            font-weight: 700;
            color: #333;
        }
    }
    .urgency-tag {
        background: #fff0f0;
        color: $reject;
        font-size: 11px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 10px;
    }

    .appr-submitter {
        font-size: 13px;
        color: #666;
        margin-bottom: 8px;
        i {
            margin-right: 4px;
        }
    }
    .appr-meta {
        display: flex;
        gap: 12px;
        font-size: 12px;
        color: #aaa;
        margin-bottom: 10px;
        i {
            margin-right: 3px;
        }
        .cat-tag {
            background: #f0eeff;
            color: $accent;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 500;
        }
    }

    .form-preview {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        background: #fafafa;
        border-radius: 8px;
        padding: 10px 12px;
        .fp-key {
            font-size: 12px;
            color: #aaa;
        }
        .fp-val {
            font-size: 13px;
            color: #333;
            font-weight: 500;
        }
    }
}

.appr-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-shrink: 0;
}

.act-btn {
    padding: 8px 18px;
    border-radius: 8px;
    border: none;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s;
    white-space: nowrap;

    &.approve {
        background: $approve;
        color: #fff;
        &:hover {
            opacity: 0.88;
        }
    }
    &.reject {
        background: #fff;
        color: $reject;
        border: 1.5px solid $reject;
        &:hover {
            background: #fff0f0;
        }
    }
}

// ── History Table ─────────────────────────────────
.history-table {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #eaecf0;
    overflow: hidden;

    table {
        width: 100%;
        border-collapse: collapse;
    }
    th {
        background: #f8f8fb;
        padding: 12px 16px;
        font-size: 13px;
        font-weight: 600;
        color: #666;
        text-align: left;
        border-bottom: 1px solid #eaecf0;
    }
    td {
        padding: 14px 16px;
        font-size: 14px;
        color: #333;
        border-bottom: 1px solid #f0f0f0;
    }
    tr:last-child td {
        border-bottom: none;
    }
    tr:hover td {
        background: #fafafa;
    }
    .serial {
        font-family: monospace;
        color: $accent;
    }
    .time-col {
        color: #aaa;
        font-size: 13px;
    }
}

.decision-badge {
    font-size: 12px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 10px;
    &.approved {
        background: #f0faf5;
        color: $approve;
    }
    &.rejected {
        background: #fff0f0;
        color: $reject;
    }
}

// ── Dialog ────────────────────────────────────────
.appr-dialog-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.appr-dialog {
    background: #fff;
    border-radius: 16px;
    width: 560px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #eaecf0;

    .dialog-title {
        font-size: 18px;
        font-weight: 700;
        color: #333;
    }
    .dialog-close {
        background: none;
        border: none;
        font-size: 16px;
        color: #aaa;
        cursor: pointer;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        &:hover {
            background: #f0f0f0;
        }
    }
}

.dialog-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
}

.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;

    .info-item {
        background: #fafafa;
        border-radius: 8px;
        padding: 10px 14px;
    }
    .info-label {
        font-size: 11px;
        color: #aaa;
        margin-bottom: 4px;
    }
    .info-value {
        font-size: 14px;
        font-weight: 600;
        color: #333;
    }
}

.form-detail-section {
    margin-bottom: 20px;
    .fds-title {
        font-size: 13px;
        font-weight: 600;
        color: #666;
        margin-bottom: 10px;
    }
    .fds-grid {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .fds-row {
        display: flex;
        gap: 12px;
        font-size: 14px;
    }
    .fds-key {
        color: #aaa;
        min-width: 100px;
        flex-shrink: 0;
    }
    .fds-val {
        color: #333;
        font-weight: 500;
    }
}

.remark-section {
    .remark-label {
        font-size: 13px;
        font-weight: 600;
        color: #666;
        display: block;
        margin-bottom: 8px;
    }
    .remark-input {
        width: 100%;
        border: 1.5px solid #eaecf0;
        border-radius: 8px;
        padding: 10px 12px;
        font-size: 14px;
        resize: vertical;
        outline: none;
        box-sizing: border-box;
        &:focus {
            border-color: $accent;
        }
    }
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 24px;
    border-top: 1px solid #eaecf0;
}

.empty-state {
    text-align: center;
    padding: 60px 0;
    color: #aaa;
    font-size: 14px;
    .empty-icon {
        font-size: 48px;
        display: block;
        margin-bottom: 12px;
    }
}
</style>
