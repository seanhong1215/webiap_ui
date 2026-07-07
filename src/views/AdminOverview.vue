<template>
    <div class="admin-overview">
        <!-- Stats Cards -->
        <div class="stats-grid">
            <div v-for="stat in statCards" :key="stat.key" class="stat-card">
                <div class="stat-icon" :style="{ background: stat.bg }">
                    <i :class="stat.icon" :style="{ color: stat.color }"></i>
                </div>
                <div class="stat-body">
                    <div class="stat-value">{{ stat.value }}</div>
                    <div class="stat-label">{{ stat.label }}</div>
                </div>
                <div class="stat-trend" :class="stat.trendDir">
                    <i :class="stat.trendDir === 'up' ? 'ti ti-arrow-up' : 'ti ti-arrow-down'"></i>
                    {{ stat.trend }}
                </div>
            </div>
        </div>

        <!-- Bottom Grid -->
        <div class="bottom-grid">
            <!-- Category Distribution -->
            <div class="panel">
                <div class="panel-title"><i class="ti ti-chart-bar"></i> 流程分類分布</div>

                <!-- Category cards grid -->
                <div class="cat-grid">
                    <div v-for="cat in categoryStats" :key="cat.name" class="cat-card" :style="{ borderTopColor: cat.catColor }">
                        <div class="cat-header">
                            <div class="cat-dot" :style="{ background: cat.catColor }"></div>
                            <span class="cat-name">{{ cat.name }}</span>
                            <span class="cat-total">共 {{ cat.total }} 個</span>
                        </div>
                        <div class="cat-status-grid">
                            <div
                                v-for="seg in cat.segments"
                                :key="seg.type"
                                class="cat-status-item"
                                :class="{ 'is-zero': seg.count === 0 }"
                            >
                                <div class="csi-num" :style="seg.count > 0 ? { color: seg.color } : {}">
                                    {{ seg.count }}
                                </div>
                                <div class="csi-label">{{ seg.name }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Status Legend with descriptions -->
                <div class="status-legend">
                    <div v-for="s in statusLegend" :key="s.type" class="legend-item">
                        <div class="legend-dot" :style="{ background: s.color }"></div>
                        <div class="legend-text">
                            <span class="legend-name">{{ s.name }}</span>
                            <span class="legend-desc">{{ s.desc }}</span>
                        </div>
                        <span class="legend-count" :style="{ color: s.color }">{{ s.count }}</span>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="panel">
                <div class="panel-title"><i class="ti ti-history"></i> 近期申請動態</div>
                <div class="activity-list">
                    <div v-for="item in recentActivities" :key="item.id" class="activity-item">
                        <div class="activity-avatar">{{ item.submitterName[0] }}</div>
                        <div class="activity-body">
                            <div class="activity-main">
                                <strong>{{ item.submitterName }}</strong>
                                <span class="activity-dept">{{ item.submitterDept }}</span>
                            </div>
                            <div class="activity-sub">{{ item.formName }} · {{ item.currentStep }}</div>
                            <div class="activity-time">{{ item.submittedAt }}</div>
                        </div>
                        <span class="status-chip" :class="`chip--${item.status}`">{{ statusTextMap[item.status] }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { MOCK_CARDS, MOCK_CATEGORIES, MOCK_ADMIN_RECORDS } from '@/utils/mockData';
import global from '@/utils/global';

const TYPE_COLOR = { 1: '#a99de0', 2: '#6e5faf', 3: '#00a76f', 4: '#c4c4c4' };
const TYPE_NAME = { 1: '初始', 2: '待生效', 3: '已生效', 4: '已關閉' };
const CAT_COLOR = { PRJ001: '#6e5faf', PRJ002: '#f4a42c', PRJ003: '#00a76f', PRJ004: '#e05c5c' };
const TYPE_DESC = {
    1: '已建立，尚未設定生效時間',
    2: '已排程，等待生效日期到來',
    3: '開放申請，使用者可提交此流程',
    4: '已超過結束時間，不再受理新申請',
};

export default {
    name: 'AdminOverview',
    computed: {
        processesWithType() {
            return MOCK_CARDS.map((c) => ({
                ...c,
                typeCode: global.processTypeConverter(c.startTime, c.endTime, true),
            }));
        },
        statCards() {
            const active = this.processesWithType.filter((p) => p.typeCode === 3).length;
            const total = MOCK_ADMIN_RECORDS.length;
            const approved = MOCK_ADMIN_RECORDS.filter((r) => r.status === 'approved').length;
            const rejected = MOCK_ADMIN_RECORDS.filter((r) => r.status === 'rejected').length;
            const pending = MOCK_ADMIN_RECORDS.filter((r) => r.status === 'pending').length;
            const rate = approved + rejected > 0 ? Math.round((approved / (approved + rejected)) * 100) : 0;
            return [
                {
                    key: 'active',
                    value: active,
                    label: '已生效流程',
                    icon: 'ti ti-sitemap',
                    color: '#6e5faf',
                    bg: '#f0eeff',
                    trend: '較上月 +0',
                    trendDir: 'up',
                },
                {
                    key: 'total',
                    value: total,
                    label: '本月申請總量',
                    icon: 'ti ti-file-text',
                    color: '#f4a42c',
                    bg: '#fff8ee',
                    trend: '較上月 +3',
                    trendDir: 'up',
                },
                {
                    key: 'approved',
                    value: approved,
                    label: '本月核准件數',
                    icon: 'ti ti-circle-check',
                    color: '#00a76f',
                    bg: '#edfbf5',
                    trend: `核准率 ${rate}%`,
                    trendDir: 'up',
                },
                {
                    key: 'pending',
                    value: pending,
                    label: '目前待審核數',
                    icon: 'ti ti-hourglass',
                    color: '#e05c5c',
                    bg: '#fff0f0',
                    trend: '需盡快處理',
                    trendDir: 'up',
                },
            ];
        },
        categoryStats() {
            const groups = {};
            this.processesWithType.forEach((p) => {
                if (!groups[p.prjID]) groups[p.prjID] = { total: 0, byType: { 1: 0, 2: 0, 3: 0, 4: 0 } };
                groups[p.prjID].total++;
                groups[p.prjID].byType[p.typeCode] = (groups[p.prjID].byType[p.typeCode] || 0) + 1;
            });
            return Object.entries(groups).map(([prjId, g]) => ({
                name: MOCK_CATEGORIES[prjId],
                total: g.total,
                catColor: CAT_COLOR[prjId] || '#6e5faf',
                segments: [1, 2, 3, 4].map((t) => ({
                    type: t,
                    count: g.byType[t] || 0,
                    color: TYPE_COLOR[t],
                    name: TYPE_NAME[t],
                })),
            }));
        },
        statusLegend() {
            return [1, 2, 3, 4].map((t) => ({
                type: t,
                name: TYPE_NAME[t],
                desc: TYPE_DESC[t],
                color: TYPE_COLOR[t],
                count: this.processesWithType.filter((p) => p.typeCode === t).length,
            }));
        },
        recentActivities() {
            return [...MOCK_ADMIN_RECORDS].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).slice(0, 6);
        },
        statusTextMap() {
            return { pending: '待審核', approved: '已核准', rejected: '已退回' };
        },
    },
};
</script>

<style lang="scss" scoped>
$purple: #483e72;
$accent: #6e5faf;

.admin-overview {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

// ── Stats Grid ────────────────────────────────────
.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}

.stat-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    box-shadow: 0 2px 8px rgba(72, 62, 114, 0.07);
    position: relative;
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, $accent, transparent);
        opacity: 0.4;
    }

    .stat-icon {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        i {
            font-size: 18px;
        }
    }

    .stat-body {
        flex: 1;
        min-width: 0;
        .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: #333;
            line-height: 1.1;
        }
        .stat-label {
            font-size: 12px;
            color: #888;
            margin-top: 4px;
        }
    }

    .stat-trend {
        position: absolute;
        bottom: 12px;
        right: 16px;
        font-size: 11px;
        color: #aaa;
        display: flex;
        align-items: center;
        gap: 3px;
        i {
            font-size: 10px;
        }
        &.up {
            color: #00a76f;
        }
        &.down {
            color: #e05c5c;
        }
    }
}

// ── Bottom Grid ───────────────────────────────────
.bottom-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.panel {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(72, 62, 114, 0.07);

    .panel-title {
        font-size: 15px;
        font-weight: 700;
        color: #333;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
        i {
            color: $accent;
            font-size: 16px;
        }
    }
}

// ── Category Cards Grid ───────────────────────────
.cat-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
}

.cat-card {
    border: 1px solid #ede9f7;
    border-top: 3px solid transparent;
    border-radius: 10px;
    padding: 14px 14px 12px;
    background: #faf9fd;
    transition: box-shadow 0.15s;

    &:hover {
        box-shadow: 0 3px 12px rgba(72, 62, 114, 0.1);
    }

    .cat-header {
        display: flex;
        align-items: center;
        gap: 7px;
        margin-bottom: 12px;

        .cat-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .cat-name {
            font-size: 13px;
            font-weight: 700;
            color: #333;
            flex: 1;
        }

        .cat-total {
            font-size: 11px;
            color: #aaa;
        }
    }

    .cat-status-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
    }

    .cat-status-item {
        background: #fff;
        border: 1px solid #ede9f7;
        border-radius: 7px;
        padding: 8px 10px;
        text-align: center;

        &.is-zero {
            .csi-num {
                color: #ddd !important;
            }
            .csi-label {
                color: #ddd;
            }
        }

        .csi-num {
            font-size: 20px;
            font-weight: 700;
            line-height: 1.1;
            color: #ccc;
        }

        .csi-label {
            font-size: 11px;
            color: #aaa;
            margin-top: 3px;
        }
    }
}

// ── Status Legend ─────────────────────────────────
.status-legend {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 16px;
    border-top: 1px solid #f5f3fb;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 10px;

    .legend-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
    }

    .legend-text {
        flex: 1;
        display: flex;
        align-items: baseline;
        gap: 6px;
        min-width: 0;

        .legend-name {
            font-size: 13px;
            font-weight: 600;
            color: #444;
            white-space: nowrap;
        }
        .legend-desc {
            font-size: 11px;
            color: #aaa;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    .legend-count {
        font-size: 15px;
        font-weight: 700;
        flex-shrink: 0;
    }
}

// ── Activity List ─────────────────────────────────
.activity-list {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.activity-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #f5f3fb;

    &:last-child {
        border-bottom: 0;
    }

    .activity-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, $purple, $accent);
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .activity-body {
        flex: 1;
        min-width: 0;

        .activity-main {
            font-size: 13px;
            color: #333;
            display: flex;
            align-items: center;
            gap: 6px;
            strong {
                font-weight: 600;
            }
            .activity-dept {
                font-size: 11px;
                color: #aaa;
                background: #f5f3fb;
                padding: 1px 6px;
                border-radius: 10px;
            }
        }
        .activity-sub {
            font-size: 12px;
            color: #888;
            margin-top: 2px;
        }
        .activity-time {
            font-size: 11px;
            color: #bbb;
            margin-top: 2px;
        }
    }
}

.status-chip {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    white-space: nowrap;

    &.chip--pending {
        background: #fff8ee;
        color: #f4a42c;
    }
    &.chip--approved {
        background: #edfbf5;
        color: #00a76f;
    }
    &.chip--rejected {
        background: #fff0f0;
        color: #e05c5c;
    }
}
</style>
