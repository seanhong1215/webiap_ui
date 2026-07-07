<template>
    <div class="dashboard">
        <!-- 歡迎區塊 -->
        <div class="welcome-banner">
            <div class="welcome-text">
                <div class="greeting">早安，王小明 👋</div>
                <div class="sub">
                    今天有 <strong>{{ stats.pendingMyAction }}</strong> 份文件等待您審核
                </div>
            </div>
            <div class="quick-actions">
                <button class="qbtn primary" @click="$router.push({ name: 'FormCatalog' })"><i class="fal fa-plus"></i> 新增申請</button>
                <button class="qbtn outline" @click="$router.push({ name: 'ApprovalCenter' })">
                    <i class="fal fa-clipboard-check"></i> 審核中心
                    <span v-if="stats.pendingMyAction" class="badge">{{ stats.pendingMyAction }}</span>
                </button>
            </div>
        </div>

        <!-- 數字卡片 -->
        <div class="stat-row">
            <div v-for="s in statCards" :key="s.label" class="stat-card" @click="s.route && $router.push({ name: s.route })">
                <div class="stat-icon" :style="{ background: s.bg }"><i :class="s.icon"></i></div>
                <div class="stat-body">
                    <div class="stat-value">{{ s.value }}</div>
                    <div class="stat-label">{{ s.label }}</div>
                </div>
                <div v-if="s.route" class="stat-arrow"><i class="fal fa-chevron-right"></i></div>
            </div>
        </div>

        <!-- 下半部：活動紀錄 + 快速入口 -->
        <div class="dashboard-body">
            <!-- 最近活動 -->
            <div class="panel">
                <div class="panel-header">
                    <span class="panel-title"><i class="fal fa-history"></i> 最近活動</span>
                </div>
                <div class="activity-list">
                    <div v-for="(act, i) in stats.recentActivity" :key="i" class="activity-item">
                        <div class="act-dot" :class="act.type"></div>
                        <div class="act-body">
                            <div class="act-text">{{ act.text }}</div>
                            <div class="act-time">{{ act.time }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右欄 -->
            <div class="right-col">
                <!-- 我的申請狀態 -->
                <div class="panel">
                    <div class="panel-header">
                        <span class="panel-title"><i class="fal fa-chart-pie"></i> 我的申請狀態</span>
                        <span class="panel-link" @click="$router.push({ name: 'MyRequests' })">查看全部</span>
                    </div>
                    <div class="my-status">
                        <div v-for="ms in myStatusItems" :key="ms.label" class="ms-item">
                            <div class="ms-bar-wrap">
                                <div class="ms-bar" :style="{ width: ms.pct + '%', background: ms.color }"></div>
                            </div>
                            <div class="ms-label">{{ ms.label }}</div>
                            <div class="ms-value" :style="{ color: ms.color }">{{ ms.count }}</div>
                        </div>
                    </div>
                </div>

                <!-- 可申請的表單 -->
                <div class="panel">
                    <div class="panel-header">
                        <span class="panel-title"><i class="fal fa-rocket"></i> 快速申請</span>
                        <span class="panel-link" @click="$router.push({ name: 'FormCatalog' })">全部表單</span>
                    </div>
                    <div class="quick-forms">
                        <div v-for="f in quickForms" :key="f.id" class="qf-item" @click="goToForm(f)">
                            <div class="qf-icon" :style="{ background: f.color + '18', color: f.color }">
                                <i :class="f.icon"></i>
                            </div>
                            <div class="qf-body">
                                <div class="qf-name">{{ f.name }}</div>
                                <div class="qf-cat">{{ f.category }}</div>
                            </div>
                            <i class="fal fa-chevron-right qf-arrow"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { MOCK_DASHBOARD_STATS } from '@/utils/mockData';

export default {
    name: 'Dashboard',
    data() {
        return {
            stats: MOCK_DASHBOARD_STATS,
            quickForms: [
                { id: 'PRO001', name: '請假申請', category: '人事管理', icon: 'fal fa-umbrella-beach', color: '#6e5faf' },
                { id: 'PRO003', name: '費用報銷', category: '財務管理', icon: 'fal fa-receipt', color: '#0070d1' },
                { id: 'PRO005', name: '會議室申請', category: '行政管理', icon: 'fal fa-door-open', color: '#00a76f' },
                { id: 'PRO007', name: '資源借用', category: '資產管理', icon: 'fal fa-box-open', color: '#f4a42c' },
            ],
        };
    },
    computed: {
        statCards() {
            return [
                {
                    label: '待我審核',
                    value: this.stats.pendingMyAction,
                    icon: 'fal fa-inbox',
                    bg: '#fff0f0',
                    color: '#e44d55',
                    route: 'ApprovalCenter',
                },
                {
                    label: '我的申請（處理中）',
                    value: this.stats.mySubmissions.pending,
                    icon: 'fal fa-clock',
                    bg: '#fff8ec',
                    color: '#f4a42c',
                    route: 'MyRequests',
                },
                {
                    label: '本月已核准',
                    value: this.stats.thisMonthApproved,
                    icon: 'fal fa-check-circle',
                    bg: '#f0faf5',
                    color: '#00a76f',
                    route: null,
                },
                {
                    label: '平均審核時數',
                    value: this.stats.avgApprovalHours + 'h',
                    icon: 'fal fa-tachometer-fast',
                    bg: '#f0eeff',
                    color: '#6e5faf',
                    route: null,
                },
            ];
        },
        myStatusItems() {
            const s = this.stats.mySubmissions;
            const total = s.total || 1;
            return [
                { label: '待審核', count: s.pending, pct: (s.pending / total) * 100, color: '#f4a42c' },
                { label: '已核准', count: s.approved, pct: (s.approved / total) * 100, color: '#00a76f' },
                { label: '已退回', count: s.rejected, pct: (s.rejected / total) * 100, color: '#e44d55' },
            ];
        },
    },
    methods: {
        goToForm(form) {
            this.$router.push({ name: 'FormDetail', params: { id: form.id } });
        },
    },
};
</script>

<style lang="scss" scoped>
$primary: #483e72;
$accent: #6e5faf;

.dashboard {
}

// ── Welcome Banner ────────────────────────────────
.welcome-banner {
    background: linear-gradient(135deg, $primary 0%, $accent 100%);
    border-radius: 16px;
    padding: 28px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    color: #fff;

    .greeting {
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 6px;
    }
    .sub {
        font-size: 14px;
        opacity: 0.85;
        strong {
            font-weight: 700;
        }
    }

    .quick-actions {
        display: flex;
        gap: 10px;
    }
}

.qbtn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.15s;

    .badge {
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

    &.primary {
        background: #fff;
        color: $primary;
        &:hover {
            opacity: 0.9;
        }
    }
    &.outline {
        background: rgba(255, 255, 255, 0.15);
        color: #fff;
        border: 1.5px solid rgba(255, 255, 255, 0.5);
        &:hover {
            background: rgba(255, 255, 255, 0.25);
        }
    }
}

// ── Stats Row ─────────────────────────────────────
.stat-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 20px;
}

.stat-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    transition: all 0.15s;
    border: 1px solid #eaecf0;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }

    .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        flex-shrink: 0;
    }

    .stat-body {
        flex: 1;
    }
    .stat-value {
        font-size: 28px;
        font-weight: 700;
        color: #333;
        line-height: 1;
    }
    .stat-label {
        font-size: 13px;
        color: #919191;
        margin-top: 4px;
    }
    .stat-arrow {
        color: #ccc;
        font-size: 13px;
    }
}

// ── Dashboard Body ────────────────────────────────
.dashboard-body {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 16px;
    align-items: start;
}

.right-col {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

// ── Panel ─────────────────────────────────────────
.panel {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #eaecf0;
    overflow: hidden;
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #f0eeff;

    .panel-title {
        font-size: 14px;
        font-weight: 600;
        color: #333;
        i {
            margin-right: 6px;
            color: $accent;
        }
    }
    .panel-link {
        font-size: 13px;
        color: $accent;
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }
}

// ── Activity List ─────────────────────────────────
.activity-list {
    padding: 8px 0;
}

.activity-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 20px;
    transition: background 0.15s;
    &:hover {
        background: #fafafa;
    }

    .act-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-top: 6px;
        flex-shrink: 0;
        &.urgent {
            background: #e44d55;
        }
        &.info {
            background: #6e5faf;
        }
        &.success {
            background: #00a76f;
        }
        &.error {
            background: #f4a42c;
        }
    }

    .act-text {
        font-size: 14px;
        color: #333;
        margin-bottom: 3px;
    }
    .act-time {
        font-size: 12px;
        color: #aaa;
    }
}

// ── My Status ─────────────────────────────────────
.my-status {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.ms-item {
    display: flex;
    align-items: center;
    gap: 10px;

    .ms-bar-wrap {
        flex: 1;
        height: 6px;
        background: #f0f0f0;
        border-radius: 3px;
        overflow: hidden;
    }
    .ms-bar {
        height: 100%;
        border-radius: 3px;
        transition: width 0.5s;
    }
    .ms-label {
        font-size: 13px;
        color: #666;
        width: 60px;
        flex-shrink: 0;
    }
    .ms-value {
        font-size: 16px;
        font-weight: 700;
        width: 24px;
        text-align: right;
        flex-shrink: 0;
    }
}

// ── Quick Forms ───────────────────────────────────
.quick-forms {
    padding: 8px 0;
}

.qf-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    cursor: pointer;
    transition: background 0.15s;
    &:hover {
        background: #fafafa;
    }

    .qf-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        flex-shrink: 0;
    }

    .qf-body {
        flex: 1;
        min-width: 0;
    }
    .qf-name {
        font-size: 14px;
        font-weight: 500;
        color: #333;
    }
    .qf-cat {
        font-size: 12px;
        color: #aaa;
    }
    .qf-arrow {
        color: #ccc;
        font-size: 13px;
    }
}
</style>
