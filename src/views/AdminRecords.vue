<template>
    <div class="admin-records">
        <!-- Summary Bar -->
        <div class="summary-bar">
            <StatCard
                v-for="s in summaryStats"
                :key="s.key"
                :value="s.count"
                :label="s.label"
                :icon="s.icon"
                :color="s.color"
                :bg="s.bg"
                value-color
                clickable
                :active="filterStatus === s.key"
                @click="toggleStatusFilter(s.key)"
            />
        </div>

        <!-- Filter Bar -->
        <div class="filter-bar">
            <div class="filter-item">
                <label>流程分類</label>
                <select v-model="filterCategory">
                    <option value="">全部分類</option>
                    <option v-for="(name, id) in MOCK_CATEGORIES" :key="id" :value="name">{{ name }}</option>
                </select>
            </div>
            <div class="filter-item">
                <label>申請部門</label>
                <select v-model="filterDept">
                    <option value="">全部部門</option>
                    <option v-for="d in uniqueDepts" :key="d" :value="d">{{ d }}</option>
                </select>
            </div>
            <div class="filter-item search-item">
                <label>搜尋</label>
                <div class="search-wrapper">
                    <i class="ti ti-search"></i>
                    <input v-model="searchText" placeholder="申請人、序號或流程名稱" />
                </div>
            </div>
            <button v-if="hasFilter" class="btn-reset" @click="resetFilters"><i class="ti ti-x"></i> 重設篩選</button>
        </div>

        <!-- Records Count -->
        <div class="result-info">
            顯示 <strong>{{ filteredRecords.length }}</strong> 筆記錄
            <span v-if="hasFilter" class="filter-hint">（已套用篩選）</span>
        </div>

        <!-- Records Table -->
        <div class="table-wrapper">
            <!-- 載入中:骨架列 -->
            <div v-if="loading" class="skeleton-rows">
                <div v-for="n in 8" :key="n" class="skeleton-row">
                    <Skeleton width="16px" height="16px" radius="4px" />
                    <Skeleton width="110px" />
                    <Skeleton width="80px" />
                    <Skeleton width="70px" />
                    <Skeleton width="150px" />
                    <Skeleton width="64px" height="20px" radius="12px" />
                    <Skeleton width="80px" />
                </div>
            </div>

            <!-- 載入失敗 -->
            <EmptyState v-else-if="error" icon="circle-x" title="資料載入失敗" hint="請稍後再試一次">
                <button class="retry-btn" @click="reload"><i class="ti ti-refresh"></i> 重新載入</button>
            </EmptyState>

            <!-- 載入完成 -->
            <template v-else>
                <table class="records-table">
                    <thead>
                        <tr>
                            <th class="col-expand"></th>
                            <th class="col-serial">序號</th>
                            <th class="col-person">申請人</th>
                            <th class="col-dept">部門</th>
                            <th class="col-flow">流程名稱</th>
                            <th class="col-status">狀態</th>
                            <th class="col-date">申請時間</th>
                            <th class="col-step">目前步驟</th>
                        </tr>
                    </thead>
                    <tbody v-if="paginatedRecords.length > 0">
                        <template v-for="rec in paginatedRecords" :key="rec.id">
                            <!-- Main Row -->
                            <tr
                                class="record-row"
                                :class="{ expanded: expandedId === rec.id, [`status-${rec.status}`]: true }"
                                @click="toggleExpand(rec.id)"
                            >
                                <td class="col-expand">
                                    <i
                                        class="ti"
                                        :class="expandedId === rec.id ? 'ti-chevron-down' : 'ti-chevron-right'"
                                        style="color: #c9c2e8; font-size: 11px"
                                    ></i>
                                </td>
                                <td class="mono">{{ rec.serialNo }}</td>
                                <td>
                                    <div class="person-cell">
                                        <div class="person-avatar">{{ rec.submitterName[0] }}</div>
                                        {{ rec.submitterName }}
                                    </div>
                                </td>
                                <td class="dept-cell">{{ rec.submitterDept }}</td>
                                <td>{{ rec.formName }}</td>
                                <td>
                                    <StatusBadge variant="submission" :value="rec.status" />
                                </td>
                                <td class="date-cell">{{ rec.submittedAt }}</td>
                                <td class="step-cell">{{ rec.currentStep }}</td>
                            </tr>

                            <!-- Expanded Detail Row -->
                            <tr v-if="expandedId === rec.id" class="detail-row">
                                <td colspan="8">
                                    <div class="detail-content">
                                        <!-- Form Data -->
                                        <div class="detail-section">
                                            <div class="detail-section-title"><i class="ti ti-file-text"></i> 表單內容</div>
                                            <div class="form-grid">
                                                <div v-for="(val, key) in rec.formData" :key="key" class="form-field">
                                                    <div class="field-key">{{ key }}</div>
                                                    <div class="field-val">{{ val }}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Approval Steps -->
                                        <div class="detail-section">
                                            <div class="detail-section-title"><i class="ti ti-timeline"></i> 審核軌跡</div>
                                            <div class="steps-timeline">
                                                <div
                                                    v-for="step in rec.steps"
                                                    :key="step.name"
                                                    class="step-item"
                                                    :class="`step--${step.status}`"
                                                >
                                                    <div class="step-connector"></div>
                                                    <div class="step-dot"></div>
                                                    <div class="step-body">
                                                        <div class="step-header">
                                                            <span class="step-name">{{ step.name }}</span>
                                                            <span class="step-actor">{{ step.actor }}</span>
                                                        </div>
                                                        <div class="step-meta">
                                                            <span>{{ step.date || '待處理' }}</span>
                                                            <span v-if="step.remark" class="step-remark">· {{ step.remark }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>

                <!-- Empty State -->
                <EmptyState
                    v-if="filteredRecords.length === 0"
                    icon="search"
                    title="查無符合條件的申請記錄"
                    hint="調整篩選條件或清除搜尋"
                />
            </template>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && !error && totalPages > 1" class="pagination-bar">
            <button class="pag-btn" :disabled="currentPage === 1" @click="currentPage--">
                <i class="ti ti-chevron-left"></i>
            </button>
            <span class="pag-info">第 {{ currentPage }} 頁，共 {{ totalPages }} 頁</span>
            <button class="pag-btn" :disabled="currentPage === totalPages" @click="currentPage++">
                <i class="ti ti-chevron-right"></i>
            </button>
        </div>
    </div>
</template>

<script>
import { MOCK_ADMIN_RECORDS, MOCK_CATEGORIES } from '@/utils/mockData';
import StatCard from '@/components/ui/StatCard.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import Skeleton from '@/components/ui/Skeleton.vue';
import { useAsyncData } from '@/composables/useAsyncData';

const PAGE_SIZE = 8;

export default {
    name: 'AdminRecords',
    components: { StatCard, StatusBadge, EmptyState, Skeleton },
    // 以 useAsyncData 載入基礎資料,提供 loading / error / data 三態
    setup() {
        const { data: records, loading, error, reload } = useAsyncData(() => [...MOCK_ADMIN_RECORDS], { delay: 700 });
        return { records, loading, error, reload };
    },
    data() {
        return {
            filterStatus: '',
            filterCategory: '',
            filterDept: '',
            searchText: '',
            expandedId: null,
            currentPage: 1,
            MOCK_CATEGORIES,
        };
    },
    computed: {
        summaryStats() {
            const all = this.records || [];
            return [
                { key: '', label: '全部記錄', count: all.length, icon: 'clipboard-list', color: '#6e5faf', bg: '#f0eeff' },
                {
                    key: 'pending',
                    label: '待審核',
                    count: all.filter((r) => r.status === 'pending').length,
                    icon: 'hourglass',
                    color: '#f4a42c',
                    bg: '#fff8ee',
                },
                {
                    key: 'approved',
                    label: '已核准',
                    count: all.filter((r) => r.status === 'approved').length,
                    icon: 'circle-check',
                    color: '#00a76f',
                    bg: '#edfbf5',
                },
                {
                    key: 'rejected',
                    label: '已退回',
                    count: all.filter((r) => r.status === 'rejected').length,
                    icon: 'circle-x',
                    color: '#e05c5c',
                    bg: '#fff0f0',
                },
            ];
        },
        uniqueDepts() {
            return [...new Set((this.records || []).map((r) => r.submitterDept))].sort();
        },
        hasFilter() {
            return !!(this.filterStatus || this.filterCategory || this.filterDept || this.searchText);
        },
        filteredRecords() {
            let list = this.records || [];
            if (this.filterStatus) list = list.filter((r) => r.status === this.filterStatus);
            if (this.filterCategory) list = list.filter((r) => r.category === this.filterCategory);
            if (this.filterDept) list = list.filter((r) => r.submitterDept === this.filterDept);
            if (this.searchText.trim()) {
                const kw = this.searchText.toLowerCase();
                list = list.filter(
                    (r) =>
                        r.submitterName.toLowerCase().includes(kw) ||
                        r.serialNo.toLowerCase().includes(kw) ||
                        r.formName.toLowerCase().includes(kw)
                );
            }
            return [...list].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
        },
        totalPages() {
            return Math.ceil(this.filteredRecords.length / PAGE_SIZE);
        },
        paginatedRecords() {
            const start = (this.currentPage - 1) * PAGE_SIZE;
            return this.filteredRecords.slice(start, start + PAGE_SIZE);
        },
    },
    watch: {
        filterStatus() {
            this.currentPage = 1;
            this.expandedId = null;
        },
        filterCategory() {
            this.currentPage = 1;
            this.expandedId = null;
        },
        filterDept() {
            this.currentPage = 1;
            this.expandedId = null;
        },
        searchText() {
            this.currentPage = 1;
            this.expandedId = null;
        },
    },
    methods: {
        toggleStatusFilter(key) {
            this.filterStatus = this.filterStatus === key ? '' : key;
            this.currentPage = 1;
        },
        resetFilters() {
            this.filterStatus = '';
            this.filterCategory = '';
            this.filterDept = '';
            this.searchText = '';
            this.currentPage = 1;
        },
        toggleExpand(id) {
            this.expandedId = this.expandedId === id ? null : id;
        },
    },
};
</script>

<style lang="scss" scoped>
$purple: #483e72;
$accent: #6e5faf;

.admin-records {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

// ── Summary Bar ───────────────────────────────────
.summary-bar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 14px;
}

// ── Filter Bar ────────────────────────────────────
.filter-bar {
    display: flex;
    align-items: flex-end;
    gap: 16px;
    background: #fff;
    padding: 16px 20px;
    border-radius: 10px;
    box-shadow: 0 1px 6px rgba(72, 62, 114, 0.07);
    flex-wrap: wrap;
}

.filter-item {
    display: flex;
    flex-direction: column;
    gap: 5px;

    label {
        font-size: 12px;
        font-weight: 600;
        color: #888;
        text-transform: uppercase;
        letter-spacing: 0.3px;
    }

    select,
    input {
        height: 36px;
        border: 1.5px solid #e0ddf0;
        border-radius: 7px;
        padding: 0 10px;
        font-size: 13px;
        color: #333;
        outline: none;
        background: #fff;
        transition: border-color 0.15s;

        &:focus {
            border-color: $accent;
        }
    }

    select {
        min-width: 130px;
    }
    &.search-item {
        flex: 1;
        min-width: 200px;
    }
}

.search-wrapper {
    position: relative;
    display: flex;
    align-items: center;

    i {
        position: absolute;
        left: 10px;
        color: #c9c2e8;
        font-size: 13px;
    }

    input {
        width: 100%;
        padding-left: 32px;
    }
}

.btn-reset {
    height: 36px;
    padding: 0 14px;
    border: 1.5px solid #e0ddf0;
    border-radius: 7px;
    background: #fff;
    color: #888;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    align-self: flex-end;
    transition: all 0.15s;

    &:hover {
        border-color: #e05c5c;
        color: #e05c5c;
    }
}

// ── Result Info ───────────────────────────────────
.result-info {
    font-size: 13px;
    color: #888;

    strong {
        color: $accent;
    }
    .filter-hint {
        color: #c9c2e8;
        margin-left: 4px;
    }
}

// ── Table ─────────────────────────────────────────
.table-wrapper {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(72, 62, 114, 0.07);
    overflow-x: auto; // 窄螢幕時表格可橫向捲動
}

.records-table {
    width: 100%;
    min-width: 720px;
    border-collapse: collapse;

    thead tr {
        background: #ede9f7;

        th {
            padding: 13px 14px;
            text-align: left;
            font-size: 12px;
            font-weight: 700;
            color: $purple;
            white-space: nowrap;
        }
    }

    .record-row {
        cursor: pointer;
        transition: background 0.1s;

        td {
            padding: 13px 14px;
            font-size: 13px;
            color: #444;
            border-bottom: 1px solid #f5f3fb;
        }

        &:hover {
            background: #faf9fd;
        }
        &.expanded {
            background: #f5f3fb;
        }
        &.status-pending td {
            border-left: none;
        }
    }

    .detail-row td {
        padding: 0;
        background: #f9f8fc;
        border-bottom: 1px solid #e0ddf0;
    }
}

.col-expand {
    width: 32px;
    padding: 0 8px !important;
}
.col-serial {
    font-family: 'Courier New', monospace;
    font-size: 11px;
    color: #aaa;
}
.mono {
    font-family: 'Courier New', monospace;
    font-size: 11px;
    color: #aaa;
}
.dept-cell {
    font-size: 12px;
    color: #888;
}
.date-cell {
    font-size: 12px;
    color: #888;
    white-space: nowrap;
}
.step-cell {
    font-size: 12px;
    color: #666;
}

.person-cell {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;

    .person-avatar {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: linear-gradient(135deg, $purple, $accent);
        color: #fff;
        font-size: 11px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
}

// ── Detail Content ────────────────────────────────
.detail-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    padding: 20px 24px;

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
        gap: 16px;
    }
}

.detail-section {
    padding: 0 16px;

    &:first-child {
        padding-left: 0;
        border-right: 1px solid #e0ddf0;
    }
    &:last-child {
        padding-right: 0;
    }

    .detail-section-title {
        font-size: 12px;
        font-weight: 700;
        color: $accent;
        margin-bottom: 14px;
        display: flex;
        align-items: center;
        gap: 6px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
    }
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.form-field {
    .field-key {
        font-size: 11px;
        font-weight: 600;
        color: #aaa;
        margin-bottom: 2px;
        font-family: 'Courier New', monospace;
    }

    .field-val {
        font-size: 13px;
        color: #333;
        background: #fff;
        border: 1px solid #e0ddf0;
        border-radius: 5px;
        padding: 4px 8px;
    }
}

// ── Steps Timeline ────────────────────────────────
.steps-timeline {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
    padding-left: 16px;
}

.step-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    position: relative;
    padding-bottom: 16px;

    &:last-child {
        padding-bottom: 0;
    }

    .step-connector {
        position: absolute;
        left: 5px;
        top: 14px;
        bottom: 0;
        width: 2px;
        background: #e0ddf0;
    }

    &:last-child .step-connector {
        display: none;
    }

    .step-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #c9c2e8;
        background: #fff;
        flex-shrink: 0;
        margin-top: 3px;
        z-index: 1;
    }

    &.step--done {
        .step-dot {
            background: #00a76f;
            border-color: #00a76f;
        }
        .step-connector {
            background: #00a76f;
        }
    }

    &.step--current .step-dot {
        background: $accent;
        border-color: $accent;
        box-shadow: 0 0 0 3px rgba(110, 95, 175, 0.2);
    }

    &.step--rejected .step-dot {
        background: #e05c5c;
        border-color: #e05c5c;
    }

    .step-body {
        flex: 1;

        .step-header {
            display: flex;
            align-items: center;
            gap: 8px;

            .step-name {
                font-size: 13px;
                font-weight: 600;
                color: #333;
            }
            .step-actor {
                font-size: 12px;
                color: #888;
            }
        }

        .step-meta {
            font-size: 11px;
            color: #aaa;
            margin-top: 2px;

            .step-remark {
                color: #888;
            }
        }
    }
}

// ── Empty State ───────────────────────────────────
// ── Pagination ────────────────────────────────────
.pagination-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;

    .pag-btn {
        width: 32px;
        height: 32px;
        border: 1.5px solid #e0ddf0;
        border-radius: 7px;
        background: #fff;
        color: #888;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s;

        &:hover:not(:disabled) {
            border-color: $accent;
            color: $accent;
        }
        &:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }
    }

    .pag-info {
        font-size: 13px;
        color: #888;
    }
}

// ── 載入骨架 / 錯誤重試 ────────────────────────────
.skeleton-rows {
    padding: 8px 0;
}
.skeleton-row {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 14px 20px;
    border-bottom: 1px solid #f4f4f7;
}
.retry-btn {
    margin-top: 14px;
    background: $accent;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 18px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    &:hover {
        opacity: 0.9;
    }
}
</style>
