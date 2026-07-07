<template>
    <div class="my-requests">
        <div class="req-header">
            <h2 class="req-title">我的申請記錄</h2>
            <button class="new-btn" @click="$router.push({ name: 'FormCatalog' })"><i class="ti ti-plus"></i> 新增申請</button>
        </div>

        <!-- 狀態篩選 -->
        <div class="filter-row">
            <button
                v-for="f in filters"
                :key="f.value"
                :class="['filter-btn', { active: activeFilter === f.value }]"
                @click="activeFilter = f.value"
            >
                {{ f.label }}
                <span v-if="f.count > 0" class="filter-count">{{ f.count }}</span>
            </button>
        </div>

        <!-- 申請列表 -->
        <div class="request-list">
            <div v-for="sub in filteredSubs" :key="sub.id" class="req-card" @click="openDetail(sub)">
                <div class="req-status-bar" :class="'bar-' + sub.status"></div>
                <div class="req-body">
                    <div class="req-top">
                        <div class="req-name">{{ sub.formName }}</div>
                        <span class="req-status-badge" :class="'s-' + sub.status">{{ statusLabel(sub.status) }}</span>
                    </div>
                    <div class="req-serial"><i class="ti ti-hash"></i> {{ sub.serialNo }}</div>
                    <div class="req-meta">
                        <span><i class="ti ti-tag"></i> {{ sub.category }}</span>
                        <span><i class="ti ti-calendar-event"></i> 申請時間：{{ sub.submittedAt }}</span>
                        <span v-if="sub.status === 'pending'"><i class="ti ti-map-pin"></i> 目前關卡：{{ sub.currentStep }}</span>
                    </div>

                    <!-- 進度條 -->
                    <div class="req-steps">
                        <div v-for="(step, i) in sub.steps" :key="i" class="step-item" :class="step.status">
                            <div class="step-dot"></div>
                            <div v-if="i < sub.steps.length - 1" class="step-line"></div>
                            <div class="step-label">{{ step.name }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 詳情側滑 -->
        <teleport to="#portal-target">
            <div v-if="activeDetail" class="detail-overlay" @click.self="activeDetail = null">
                <div class="detail-panel">
                    <div class="dp-header">
                        <div>
                            <div class="dp-title">{{ activeDetail.formName }}</div>
                            <div class="dp-serial">{{ activeDetail.serialNo }}</div>
                        </div>
                        <button class="dp-close" @click="activeDetail = null"><i class="ti ti-x"></i></button>
                    </div>
                    <div class="dp-body">
                        <span class="req-status-badge large" :class="'s-' + activeDetail.status">{{
                            statusLabel(activeDetail.status)
                        }}</span>

                        <!-- 審核進度 -->
                        <div class="dp-section">
                            <div class="dp-sec-title">審核進度</div>
                            <div class="timeline">
                                <div v-for="(step, i) in activeDetail.steps" :key="i" class="tl-item" :class="step.status">
                                    <div class="tl-icon"><i :class="stepIcon(step.status)"></i></div>
                                    <div class="tl-content">
                                        <div class="tl-name">{{ step.name }}</div>
                                        <div class="tl-actor">{{ step.actor }}</div>
                                        <div v-if="step.date" class="tl-date">{{ step.date }}</div>
                                        <div v-if="step.remark" class="tl-remark">「{{ step.remark }}」</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 申請內容 -->
                        <div class="dp-section">
                            <div class="dp-sec-title">申請內容</div>
                            <div class="form-data">
                                <div v-for="(v, k) in labeledData(activeDetail)" :key="k" class="fd-row">
                                    <div class="fd-key">{{ k }}</div>
                                    <div class="fd-val">{{ v }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="activeDetail.status === 'rejected'" class="dp-footer">
                        <button class="reapply-btn" @click="reApply(activeDetail)"><i class="ti ti-refresh"></i> 重新申請</button>
                    </div>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script>
import { MOCK_SUBMISSIONS } from '@/utils/mockData';

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
    name: 'MyRequests',
    data() {
        return {
            submissions: [...MOCK_SUBMISSIONS],
            activeFilter: 'all',
            activeDetail: null,
        };
    },
    computed: {
        filters() {
            const subs = this.submissions;
            return [
                { label: '全部', value: 'all', count: 0 },
                { label: '待審核', value: 'pending', count: subs.filter((s) => s.status === 'pending').length },
                { label: '已核准', value: 'approved', count: 0 },
                { label: '已退回', value: 'rejected', count: subs.filter((s) => s.status === 'rejected').length },
            ];
        },
        filteredSubs() {
            if (this.activeFilter === 'all') return this.submissions;
            return this.submissions.filter((s) => s.status === this.activeFilter);
        },
    },
    methods: {
        statusLabel(s) {
            return { pending: '待審核', approved: '已核准', rejected: '已退回', recalled: '已撤回' }[s] || s;
        },
        stepIcon(s) {
            return { done: 'ti ti-check', current: 'ti ti-loader-2', waiting: 'ti ti-clock', rejected: 'ti ti-x' }[s] || 'ti ti-circle';
        },
        labeledData(sub) {
            const r = {};
            Object.entries(sub.formData).forEach(([k, v]) => {
                r[FIELD_LABELS[k] || k] = v;
            });
            return r;
        },
        openDetail(sub) {
            this.activeDetail = sub;
        },
        reApply(sub) {
            this.activeDetail = null;
            this.$router.push({ name: 'FormDetail', params: { id: sub.proId } });
        },
    },
};
</script>

<style lang="scss" scoped>
$accent: #6e5faf;

.my-requests {
}

.req-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}
.req-title {
    font-size: 20px;
    font-weight: 700;
    color: #333;
}
.new-btn {
    background: $accent;
    color: #fff;
    border: none;
    padding: 9px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    &:hover {
        opacity: 0.88;
    }
}

.filter-row {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
}
.filter-btn {
    padding: 7px 16px;
    border-radius: 20px;
    border: 1.5px solid #eaecf0;
    background: #fff;
    font-size: 14px;
    color: #5c6466;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s;
    .filter-count {
        background: #eaecf0;
        color: #666;
        font-size: 11px;
        min-width: 18px;
        height: 18px;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 4px;
    }
    &:hover {
        border-color: $accent;
        color: $accent;
    }
    &.active {
        background: $accent;
        border-color: $accent;
        color: #fff;
        .filter-count {
            background: rgba(255, 255, 255, 0.25);
            color: #fff;
        }
    }
}

.request-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.req-card {
    background: #fff;
    border-radius: 12px;
    border: 1.5px solid #eaecf0;
    display: flex;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.15s;
    &:hover {
        border-color: $accent;
        box-shadow: 0 4px 16px rgba(110, 95, 175, 0.08);
    }
}

.req-status-bar {
    width: 4px;
    flex-shrink: 0;
    &.bar-pending {
        background: #f4a42c;
    }
    &.bar-approved {
        background: #00a76f;
    }
    &.bar-rejected {
        background: #e44d55;
    }
    &.bar-recalled {
        background: #aaa;
    }
}

.req-body {
    flex: 1;
    padding: 16px 20px;
}
.req-top {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
}
.req-name {
    font-size: 16px;
    font-weight: 700;
    color: #333;
}
.req-serial {
    font-size: 12px;
    color: #aaa;
    margin-bottom: 8px;
    font-family: monospace;
}
.req-meta {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: #aaa;
    margin-bottom: 14px;
    i {
        margin-right: 3px;
    }
}

.req-status-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 10px;
    &.large {
        font-size: 13px;
        padding: 5px 14px;
        margin-bottom: 16px;
        display: inline-block;
    }
    &.s-pending {
        background: #fff8ec;
        color: #f4a42c;
    }
    &.s-approved {
        background: #f0faf5;
        color: #00a76f;
    }
    &.s-rejected {
        background: #fff0f0;
        color: #e44d55;
    }
    &.s-recalled {
        background: #f5f5f5;
        color: #aaa;
    }
}

.req-steps {
    display: flex;
    align-items: center;
    gap: 0;
}
.step-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;

    .step-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid #ddd;
        background: #fff;
        flex-shrink: 0;
    }
    .step-line {
        width: 32px;
        height: 2px;
        background: #eaecf0;
    }
    .step-label {
        color: #aaa;
    }

    &.done {
        .step-dot {
            border-color: #00a76f;
            background: #00a76f;
        }
        .step-line {
            background: #00a76f;
        }
        .step-label {
            color: #333;
        }
    }
    &.current {
        .step-dot {
            border-color: $accent;
            background: $accent;
        }
        .step-label {
            color: $accent;
            font-weight: 600;
        }
    }
    &.rejected {
        .step-dot {
            border-color: #e44d55;
            background: #e44d55;
        }
        .step-label {
            color: #e44d55;
        }
    }
}

// ── Detail Panel ──────────────────────────────────
.detail-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    justify-content: flex-end;
    z-index: 1000;
}
.detail-panel {
    background: #fff;
    width: 480px;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: -8px 0 32px rgba(0, 0, 0, 0.12);
}

.dp-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #eaecf0;
    .dp-title {
        font-size: 18px;
        font-weight: 700;
        color: #333;
        margin-bottom: 4px;
    }
    .dp-serial {
        font-size: 12px;
        color: #aaa;
        font-family: monospace;
    }
    .dp-close {
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

.dp-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
}
.dp-section {
    margin-bottom: 24px;
}
.dp-sec-title {
    font-size: 13px;
    font-weight: 600;
    color: #666;
    margin-bottom: 12px;
}

.timeline {
    display: flex;
    flex-direction: column;
    gap: 0;
}
.tl-item {
    display: flex;
    gap: 12px;
    padding-bottom: 16px;
    position: relative;

    &:not(:last-child)::after {
        content: '';
        position: absolute;
        left: 15px;
        top: 32px;
        bottom: 0;
        width: 2px;
        background: #eaecf0;
    }

    .tl-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        flex-shrink: 0;
        background: #f0f0f0;
        color: #aaa;
        z-index: 1;
    }
    .tl-name {
        font-size: 14px;
        font-weight: 600;
        color: #333;
        margin-bottom: 3px;
    }
    .tl-actor {
        font-size: 13px;
        color: #666;
    }
    .tl-date {
        font-size: 12px;
        color: #aaa;
        margin-top: 2px;
    }
    .tl-remark {
        font-size: 12px;
        color: #919191;
        margin-top: 4px;
        font-style: italic;
    }

    &.done .tl-icon {
        background: #f0faf5;
        color: #00a76f;
    }
    &.current .tl-icon {
        background: #f0eeff;
        color: $accent;
    }
    &.rejected .tl-icon {
        background: #fff0f0;
        color: #e44d55;
    }
}

.form-data {
    background: #fafafa;
    border-radius: 10px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.fd-row {
    display: flex;
    gap: 12px;
    font-size: 14px;
}
.fd-key {
    color: #aaa;
    min-width: 90px;
    flex-shrink: 0;
    font-size: 13px;
}
.fd-val {
    color: #333;
    font-weight: 500;
}

.dp-footer {
    padding: 16px 24px;
    border-top: 1px solid #eaecf0;
}
.reapply-btn {
    background: $accent;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    &:hover {
        opacity: 0.88;
    }
}
</style>
