<template>
    <div class="admin-processes">
        <!-- Header -->
        <div class="page-header">
            <div class="header-left">
                <h2 class="page-title-text">流程總覽</h2>
                <span class="total-badge">共 {{ filteredProcesses.length }} 個流程</span>
            </div>
            <div class="header-right">
                <div class="search-wrapper">
                    <i class="fal fa-search search-icon"></i>
                    <input v-model="searchText" class="search-input" placeholder="搜尋流程名稱..." />
                </div>
            </div>
        </div>

        <!-- Info Banner -->
        <div class="info-banner">
            <div class="banner-header" @click="showGuide = !showGuide">
                <div class="banner-left">
                    <i class="fal fa-info-circle"></i>
                    <span>關於流程管理</span>
                </div>
                <i :class="showGuide ? 'fal fa-chevron-up' : 'fal fa-chevron-down'" class="banner-toggle"></i>
            </div>
            <div class="banner-body" v-show="showGuide">
                <p>一個<strong>流程</strong>代表一種簽核申請路徑（如「請假申請流程」、「費用報銷申請」），定義了使用者提交申請的完整過程。</p>
                <div class="banner-items">
                    <div class="banner-item">
                        <i class="fal fa-code-branch"></i>
                        <div>
                            <strong>條件規則</strong>：根據申請人填寫的表單欄位值，決定走哪條審核路徑。
                            例如：申請金額超過萬元時 → 需財務長審核；一般金額 → 主管審核即可。
                        </div>
                    </div>
                    <div class="banner-item">
                        <i class="fal fa-file-alt"></i>
                        <div>
                            <strong>表單欄位</strong>：申請人在提交申請時需要填寫的資料欄位（如請假類型、天數、原因），決定條件規則能判斷的依據。
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Status Tabs -->
        <div class="status-tabs">
            <button
                v-for="tab in statusTabs"
                :key="tab.value"
                class="tab-btn"
                :class="{ active: selectedStatus === tab.value }"
                @click="selectedStatus = tab.value"
            >
                <span class="tab-dot" :style="{ background: tab.color }"></span>
                {{ tab.label }}
                <span class="tab-count">{{ tab.count }}</span>
            </button>
        </div>

        <!-- Process Cards Grid -->
        <div class="process-grid" v-if="filteredProcesses.length > 0">
            <div class="proc-card" v-for="proc in filteredProcesses" :key="proc.proID">
                <div class="card-top">
                    <div class="card-name">{{ proc.proName }}</div>
                    <div class="type-badge" :class="`type--${proc.typeCode}`">{{ typeLabel[proc.typeCode] }}</div>
                </div>
                <div class="card-meta">
                    <span class="meta-item"><i class="fal fa-tag"></i>{{ getCategoryName(proc.prjID) }}</span>
                    <span class="meta-item"><i class="fal fa-code-branch"></i>{{ proc.versionIndex }}</span>
                    <span class="meta-item"><i class="fal fa-user"></i>{{ getManager(proc) }}</span>
                </div>
                <div class="card-stats">
                    <div class="stat-box">
                        <div class="stat-num">{{ getMonthlyCount(proc.proID) }}</div>
                        <div class="stat-label">本月申請</div>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-box">
                        <div class="stat-num">{{ getConditionCount(proc.proID) }}</div>
                        <div class="stat-label">條件規則</div>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-box">
                        <div class="stat-num">{{ getFormFieldCount(proc.artID) }}</div>
                        <div class="stat-label">表單欄位</div>
                    </div>
                </div>
                <div class="card-time" v-if="proc.startTime !== '9999-12-31'">
                    <i class="fal fa-calendar-alt"></i>
                    <span>{{ formatDate(proc.startTime) }}</span>
                    <span class="time-sep">→</span>
                    <span>{{ proc.endTime === '9999-12-31' ? '不限' : formatDate(proc.endTime) }}</span>
                </div>
                <div class="card-actions">
                    <button class="btn-rules" @click="openRuleModal(proc)">
                        <i class="fal fa-code-branch"></i> 管理條件規則
                    </button>
                    <button class="btn-form" @click="openFormModal(proc)">
                        <i class="fal fa-file-alt"></i> 管理表單欄位
                    </button>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div class="empty-state" v-else>
            <i class="fal fa-inbox"></i>
            <p>查無符合條件的流程</p>
        </div>

        <!-- ── Rule Modal (CRUD) ─────────────────────── -->
        <transition name="modal">
            <div class="modal-overlay" v-if="ruleModal.show" @click.self="closeRuleModal">
                <div class="modal-box modal-box--wide">
                    <div class="modal-header">
                        <div class="modal-title">
                            <i class="fal fa-code-branch"></i>
                            {{ ruleModal.procName }} — 條件規則管理
                        </div>
                        <div class="modal-header-actions">
                            <button class="btn-add-rule" @click="showAddRuleForm = true" v-if="!showAddRuleForm">
                                <i class="fal fa-plus"></i> 新增規則
                            </button>
                            <button class="modal-close" @click="closeRuleModal"><i class="fal fa-times"></i></button>
                        </div>
                    </div>
                    <div class="modal-body">
                        <!-- 說明提示 -->
                        <div class="rule-hint">
                            <i class="fal fa-lightbulb"></i>
                            條件規則決定申請人送出後走哪條審核路徑，條件表達式支援比較運算（
                            <code>==</code>、<code>!=</code>、<code>&gt;</code>、<code>&lt;</code>）
                            與邏輯運算（<code>&amp;&amp;</code>、<code>||</code>）。
                        </div>

                        <!-- 新增表單 -->
                        <div class="add-rule-form" v-if="showAddRuleForm">
                            <div class="form-row">
                                <div class="form-field">
                                    <label>規則名稱</label>
                                    <input v-model="newRuleForm.name" placeholder="例：主管審核、財務長審核" class="form-input" @keyup.enter="addRule" />
                                </div>
                                <div class="form-field form-field--wide">
                                    <label>條件表達式 <span class="optional">（選填，留空表示所有申請皆適用）</span></label>
                                    <input v-model="newRuleForm.condition" placeholder='例：Amount > 10000 && ExpenseType == "差旅"' class="form-input" @keyup.enter="addRule" />
                                </div>
                            </div>
                            <div class="form-actions">
                                <button class="btn-confirm" @click="addRule" :disabled="!newRuleForm.name.trim()">
                                    <i class="fal fa-check"></i> 新增
                                </button>
                                <button class="btn-cancel" @click="cancelAddRule">取消</button>
                            </div>
                        </div>

                        <!-- Rules list -->
                        <div v-if="localRules.length > 0">
                            <div class="rule-item" v-for="(rule, i) in localRules" :key="rule.id">
                                <div class="rule-index">{{ i + 1 }}</div>

                                <!-- View mode -->
                                <div class="rule-content" v-if="!rule.editing">
                                    <div class="rule-name">{{ rule.name }}</div>
                                    <div class="rule-cond" v-if="rule.condition">
                                        <i class="fal fa-filter"></i>
                                        <code>{{ rule.condition }}</code>
                                    </div>
                                    <div class="rule-cond no-cond" v-else>
                                        <i class="fal fa-check"></i> 無條件，所有申請皆適用
                                    </div>
                                </div>

                                <!-- Edit mode -->
                                <div class="rule-edit" v-else>
                                    <input v-model="rule.editName" class="edit-input" placeholder="規則名稱" />
                                    <input v-model="rule.editCondition" class="edit-input edit-input--wide" placeholder="條件表達式（選填）" />
                                    <div class="edit-actions">
                                        <button class="btn-confirm-sm" @click="saveEditRule(i)" :disabled="!rule.editName.trim()">
                                            <i class="fal fa-check"></i> 儲存
                                        </button>
                                        <button class="btn-cancel-sm" @click="cancelEditRule(i)">取消</button>
                                    </div>
                                </div>

                                <!-- Row actions -->
                                <div class="rule-row-actions" v-if="!rule.editing">
                                    <button class="row-btn" @click="startEditRule(i)" title="編輯">
                                        <i class="fal fa-edit"></i>
                                    </button>
                                    <button class="row-btn row-btn--danger" @click="deleteRule(i)" title="刪除">
                                        <i class="fal fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="no-rules" v-else-if="!showAddRuleForm">
                            <i class="fal fa-info-circle"></i> 此流程尚未設定條件規則，點右上角「新增規則」開始建立
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- ── Form Fields Modal (CRUD) ──────────────── -->
        <transition name="modal">
            <div class="modal-overlay" v-if="formModal.show" @click.self="closeFormModal">
                <div class="modal-box modal-box--wide">
                    <div class="modal-header">
                        <div class="modal-title">
                            <i class="fal fa-file-alt"></i>
                            {{ formModal.procName }} — 表單欄位管理
                        </div>
                        <div class="modal-header-actions">
                            <button class="btn-add-rule" @click="showAddFieldForm = true" v-if="!showAddFieldForm">
                                <i class="fal fa-plus"></i> 新增欄位
                            </button>
                            <button class="modal-close" @click="closeFormModal"><i class="fal fa-times"></i></button>
                        </div>
                    </div>
                    <div class="modal-body">
                        <!-- 新增表單 -->
                        <div class="add-rule-form" v-if="showAddFieldForm">
                            <div class="form-row">
                                <div class="form-field">
                                    <label>欄位名稱</label>
                                    <input v-model="newFieldForm.name" placeholder="例：Amount" class="form-input" @keyup.enter="addField" />
                                </div>
                                <div class="form-field form-field--wide">
                                    <label>顯示說明</label>
                                    <input v-model="newFieldForm.synopsis" placeholder="例：申請金額" class="form-input" @keyup.enter="addField" />
                                </div>
                            </div>
                            <div class="form-actions">
                                <button class="btn-confirm" @click="addField" :disabled="!newFieldForm.name.trim() || !newFieldForm.synopsis.trim()">
                                    <i class="fal fa-check"></i> 新增
                                </button>
                                <button class="btn-cancel" @click="cancelAddField">取消</button>
                            </div>
                        </div>

                        <!-- Fields table -->
                        <table class="fields-table" v-if="localFields.length > 0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>欄位名稱</th>
                                    <th>顯示說明</th>
                                    <th class="col-actions">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(f, i) in localFields" :key="f.id">
                                    <!-- View row -->
                                    <tr v-if="!f.editing">
                                        <td>{{ i + 1 }}</td>
                                        <td><code>{{ f.name }}</code></td>
                                        <td>{{ f.synopsis }}</td>
                                        <td class="col-actions">
                                            <button class="row-btn" @click="startEditField(i)" title="編輯"><i class="fal fa-edit"></i></button>
                                            <button class="row-btn row-btn--danger" @click="deleteField(i)" title="刪除"><i class="fal fa-trash-alt"></i></button>
                                        </td>
                                    </tr>
                                    <!-- Edit row -->
                                    <tr v-else class="editing-row">
                                        <td>{{ i + 1 }}</td>
                                        <td><input v-model="f.editName" class="inline-input" placeholder="欄位名稱" /></td>
                                        <td><input v-model="f.editSynopsis" class="inline-input" placeholder="顯示說明" /></td>
                                        <td class="col-actions">
                                            <button class="btn-confirm-sm" @click="saveEditField(i)" :disabled="!f.editName.trim()">
                                                <i class="fal fa-check"></i>
                                            </button>
                                            <button class="btn-cancel-sm" @click="cancelEditField(i)">取消</button>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>

                        <div class="no-rules" v-else-if="!showAddFieldForm">
                            <i class="fal fa-info-circle"></i> 此流程尚未設定表單欄位，點右上角「新增欄位」開始建立
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { MOCK_CARDS, MOCK_CATEGORIES, CONDITION_DATA, ARTIFACT_ITEMS, MOCK_PROCESS_MONTHLY_COUNT } from '@/utils/mockData';
import global from '@/utils/global';

const TYPE_LABEL = { 1: '初始', 2: '待生效', 3: '已生效', 4: '已關閉' };

export default {
    name: 'AdminProcesses',
    data() {
        return {
            searchText: '',
            selectedStatus: 0,
            showGuide: true,

            // Rule modal state
            ruleModal: { show: false, procName: '' },
            localRules: [],
            showAddRuleForm: false,
            newRuleForm: { name: '', condition: '' },

            // Form fields modal state
            formModal: { show: false, procName: '' },
            localFields: [],
            showAddFieldForm: false,
            newFieldForm: { name: '', synopsis: '' },
        };
    },
    computed: {
        processesWithType() {
            return MOCK_CARDS.map((c) => ({
                ...c,
                typeCode: global.processTypeConverter(c.startTime, c.endTime, true),
            }));
        },
        statusTabs() {
            const tabs = [
                { label: '全部',   value: 0, color: '#aaa'    },
                { label: '已生效', value: 3, color: '#00a76f' },
                { label: '待生效', value: 2, color: '#6e5faf' },
                { label: '初始',   value: 1, color: '#a99de0' },
                { label: '已關閉', value: 4, color: '#c4c4c4' },
            ];
            return tabs.map((t) => ({
                ...t,
                count: t.value === 0
                    ? this.processesWithType.length
                    : this.processesWithType.filter((p) => p.typeCode === t.value).length,
            }));
        },
        filteredProcesses() {
            let list = this.processesWithType;
            if (this.selectedStatus !== 0) list = list.filter((p) => p.typeCode === this.selectedStatus);
            if (this.searchText.trim()) {
                const kw = this.searchText.toLowerCase();
                list = list.filter((p) => p.proName.toLowerCase().includes(kw));
            }
            return list;
        },
        typeLabel() { return TYPE_LABEL; },
    },
    methods: {
        getCategoryName(prjID) { return MOCK_CATEGORIES[prjID] || prjID; },
        getManager(proc) { return proc.accessMemInfo?.[0]?.memName || '-'; },
        getMonthlyCount(proId) { return MOCK_PROCESS_MONTHLY_COUNT[proId] ?? 0; },
        getConditionCount(proId) {
            return CONDITION_DATA[proId]?.subProcessList?.[0]?.outProcessList?.length ?? 0;
        },
        getFormFieldCount(artId) { return ARTIFACT_ITEMS[artId]?.length ?? 0; },
        formatDate(dateStr) { return dateStr.replace(/-/g, '/').slice(0, 10); },

        // ── Rule Modal ──────────────────────────────
        openRuleModal(proc) {
            const outList = CONDITION_DATA[proc.proID]?.subProcessList?.[0]?.outProcessList || [];
            this.localRules = outList.map((item) => ({
                id: item.toProcessID,
                name: item.linkTerm?.artStateList?.[0]?.name || '-',
                condition: item.linkTerm?.artStateList?.[0]?.condition || '',
                editing: false, editName: '', editCondition: '',
            }));
            this.showAddRuleForm = false;
            this.newRuleForm = { name: '', condition: '' };
            this.ruleModal = { show: true, procName: proc.proName };
        },
        closeRuleModal() { this.ruleModal.show = false; },
        startEditRule(i) {
            this.localRules[i].editing = true;
            this.localRules[i].editName = this.localRules[i].name;
            this.localRules[i].editCondition = this.localRules[i].condition;
        },
        saveEditRule(i) {
            if (!this.localRules[i].editName.trim()) return;
            this.localRules[i].name = this.localRules[i].editName;
            this.localRules[i].condition = this.localRules[i].editCondition;
            this.localRules[i].editing = false;
        },
        cancelEditRule(i) { this.localRules[i].editing = false; },
        deleteRule(i) { this.localRules.splice(i, 1); },
        addRule() {
            if (!this.newRuleForm.name.trim()) return;
            this.localRules.push({
                id: 'NEW_' + Date.now(),
                name: this.newRuleForm.name,
                condition: this.newRuleForm.condition,
                editing: false, editName: '', editCondition: '',
            });
            this.cancelAddRule();
        },
        cancelAddRule() {
            this.showAddRuleForm = false;
            this.newRuleForm = { name: '', condition: '' };
        },

        // ── Form Fields Modal ───────────────────────
        openFormModal(proc) {
            const raw = ARTIFACT_ITEMS[proc.artID] || [];
            this.localFields = raw.map((f) => ({
                ...f,
                editing: false, editName: f.name, editSynopsis: f.synopsis,
            }));
            this.showAddFieldForm = false;
            this.newFieldForm = { name: '', synopsis: '', dbType: 'VARCHAR', type: 'TextField' };
            this.formModal = { show: true, procName: proc.proName };
        },
        closeFormModal() { this.formModal.show = false; },
        startEditField(i) {
            this.localFields[i].editing = true;
            this.localFields[i].editName     = this.localFields[i].name;
            this.localFields[i].editSynopsis = this.localFields[i].synopsis;
            this.localFields[i].editDbType   = this.localFields[i].dbType;
            this.localFields[i].editType     = this.localFields[i].type;
        },
        saveEditField(i) {
            if (!this.localFields[i].editName.trim()) return;
            const f = this.localFields[i];
            f.name = f.editName; f.synopsis = f.editSynopsis;
            f.editing = false;
        },
        cancelEditField(i) { this.localFields[i].editing = false; },
        deleteField(i) { this.localFields.splice(i, 1); },
        addField() {
            if (!this.newFieldForm.name.trim() || !this.newFieldForm.synopsis.trim()) return;
            this.localFields.push({
                id: 'NEW_' + Date.now(),
                name: this.newFieldForm.name, synopsis: this.newFieldForm.synopsis,
                editing: false, editName: '', editSynopsis: '',
            });
            this.cancelAddField();
        },
        cancelAddField() {
            this.showAddFieldForm = false;
            this.newFieldForm = { name: '', synopsis: '' };
        },
    },
};
</script>

<style lang="scss" scoped>
$purple: #483e72;
$accent: #6e5faf;

.admin-processes {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

// ── Header ────────────────────────────────────────
.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-left {
        display: flex; align-items: center; gap: 12px;
        .page-title-text { font-size: 20px; font-weight: 700; color: #333; margin: 0; }
        .total-badge { background: #f0eeff; color: $accent; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
    }

    .search-wrapper {
        position: relative;
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #aaa; font-size: 14px; }
        .search-input {
            border: 1.5px solid #e0ddf0; border-radius: 8px;
            padding: 8px 12px 8px 36px; font-size: 14px; color: #333;
            outline: none; width: 240px; transition: border-color 0.2s;
            &:focus { border-color: $accent; box-shadow: 0 0 0 3px rgba(110, 95, 175, 0.1); }
        }
    }
}

// ── Info Banner ───────────────────────────────────
.info-banner {
    background: #faf9fd;
    border: 1px solid #e0ddf0;
    border-radius: 10px;
    overflow: hidden;

    .banner-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 12px 16px;
        cursor: pointer;
        transition: background 0.15s;

        &:hover { background: #f0eeff; }

        .banner-left {
            display: flex; align-items: center; gap: 8px;
            font-size: 13px; font-weight: 600; color: $accent;
            i { font-size: 14px; }
        }

        .banner-toggle { color: #c9c2e8; font-size: 12px; }
    }

    .banner-body {
        padding: 0 16px 16px;
        border-top: 1px solid #e0ddf0;

        p {
            font-size: 13px; color: #555; margin: 12px 0 12px;
            strong { color: $accent; }
        }

        .banner-items {
            display: flex; flex-direction: column; gap: 10px;
        }

        .banner-item {
            display: flex; gap: 10px; align-items: flex-start;
            font-size: 13px; color: #666; line-height: 1.5;

            i {
                color: $accent; font-size: 14px; margin-top: 2px; flex-shrink: 0;
            }

            strong { color: #333; }
        }
    }
}

// ── Status Tabs ───────────────────────────────────
.status-tabs {
    display: flex; gap: 8px;
    background: #fff; padding: 6px; border-radius: 10px;
    width: fit-content;
    box-shadow: 0 1px 4px rgba(72, 62, 114, 0.07);
}

.tab-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 16px; border: none; border-radius: 7px;
    background: transparent; color: #888; font-size: 13px;
    cursor: pointer; transition: all 0.15s;

    .tab-dot { width: 7px; height: 7px; border-radius: 50%; }
    .tab-count { background: #f0eeff; color: $accent; font-size: 11px; font-weight: 700; padding: 1px 6px; border-radius: 10px; }

    &:hover:not(.active) { background: #f5f3fb; color: #555; }
    &.active {
        background: $accent; color: #fff; font-weight: 600;
        .tab-count { background: rgba(255,255,255,0.25); color: #fff; }
    }
}

// ── Process Grid ──────────────────────────────────
.process-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
}

.proc-card {
    background: #fff; border-radius: 12px; padding: 20px;
    box-shadow: 0 2px 8px rgba(72, 62, 114, 0.08);
    display: flex; flex-direction: column; gap: 14px;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(110, 95, 175, 0.14); }

    .card-top {
        display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;
        .card-name { font-size: 15px; font-weight: 700; color: #333; line-height: 1.3; }
    }

    .card-meta {
        display: flex; flex-wrap: wrap; gap: 8px;
        .meta-item { font-size: 12px; color: #888; display: flex; align-items: center; gap: 4px; i { color: #c9c2e8; } }
    }

    .card-stats {
        display: flex; align-items: center;
        background: #faf9fd; border-radius: 8px; overflow: hidden;

        .stat-box { flex: 1; text-align: center; padding: 10px 0;
            .stat-num { font-size: 20px; font-weight: 700; color: $accent; }
            .stat-label { font-size: 11px; color: #aaa; margin-top: 2px; }
        }
        .stat-divider { width: 1px; height: 32px; background: #ede9f7; }
    }

    .card-time {
        font-size: 12px; color: #aaa; display: flex; align-items: center; gap: 6px;
        i { color: #c9c2e8; } .time-sep { color: #ddd; }
    }

    .card-actions {
        display: flex; gap: 8px; padding-top: 4px; border-top: 1px solid #f5f3fb;

        button {
            flex: 1; height: 32px; border-radius: 6px; border: 1.5px solid #e0ddf0;
            background: #fff; color: #666; font-size: 12px; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 5px;
            transition: all 0.15s;
            i { color: #c9c2e8; }
            &:hover { border-color: $accent; color: $accent; background: #f0eeff; i { color: $accent; } }
        }
    }
}

.type-badge {
    font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 20px; white-space: nowrap; flex-shrink: 0;
    &.type--1 { background: #f0eeff; color: #a99de0; }
    &.type--2 { background: #f0eeff; color: $accent; }
    &.type--3 { background: #edfbf5; color: #00a76f; }
    &.type--4 { background: #f5f5f5; color: #aaa; }
}

.empty-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 0; color: #ccc;
    i { font-size: 48px; margin-bottom: 12px; } p { font-size: 15px; }
}

// ── Modals ────────────────────────────────────────
.modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.35);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; backdrop-filter: blur(2px);
}

.modal-box {
    background: #fff; border-radius: 16px;
    width: 560px; max-width: 90vw; max-height: 85vh;
    display: flex; flex-direction: column; overflow: hidden;
    box-shadow: 0 20px 60px rgba(72, 62, 114, 0.2);

    &.modal-box--wide { width: 680px; }
}

.modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 24px; border-bottom: 1px solid #f0eeff; flex-shrink: 0;

    .modal-title {
        font-size: 15px; font-weight: 700; color: #333;
        display: flex; align-items: center; gap: 8px;
        i { color: $accent; }
    }

    .modal-header-actions { display: flex; align-items: center; gap: 8px; }

    .btn-add-rule {
        display: flex; align-items: center; gap: 5px;
        background: $accent; color: #fff; border: none;
        padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;
        cursor: pointer; transition: opacity 0.15s;
        &:hover { opacity: 0.88; }
        i { font-size: 11px; }
    }

    .modal-close {
        background: none; border: none; width: 28px; height: 28px; border-radius: 6px;
        cursor: pointer; color: #aaa; display: flex; align-items: center; justify-content: center;
        &:hover { background: #f5f3fb; color: $accent; }
    }
}

.modal-body { padding: 0 24px 20px; overflow-y: auto; flex: 1; }

// ── Rule hint ─────────────────────────────────────
.rule-hint {
    margin: 16px 0 12px;
    background: #faf9fd; border: 1px solid #e0ddf0; border-radius: 8px;
    padding: 10px 14px; font-size: 12px; color: #888;
    display: flex; align-items: flex-start; gap: 8px;
    i { color: $accent; flex-shrink: 0; margin-top: 1px; }
    code { background: #f0eeff; color: $accent; padding: 1px 4px; border-radius: 3px; font-size: 11px; }
}

// ── Add form ──────────────────────────────────────
.add-rule-form {
    background: #faf9fd; border: 1px solid #e0ddf0; border-radius: 10px;
    padding: 16px; margin: 12px 0;
}

.form-row {
    display: flex; flex-wrap: wrap; gap: 12px;
}

.form-field {
    display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 140px;

    &.form-field--wide { flex: 2; }

    label {
        font-size: 11px; font-weight: 600; color: #888;
        text-transform: uppercase; letter-spacing: 0.3px;

        .optional { font-weight: 400; text-transform: none; color: #bbb; }
    }
}

.form-input, .form-select {
    height: 34px; border: 1.5px solid #e0ddf0; border-radius: 6px;
    padding: 0 10px; font-size: 13px; color: #333; outline: none; background: #fff;
    transition: border-color 0.15s;
    &:focus { border-color: $accent; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.form-actions { display: flex; align-items: center; gap: 8px; margin-top: 12px; }

.btn-confirm {
    display: flex; align-items: center; gap: 5px;
    background: $accent; color: #fff; border: none;
    padding: 7px 16px; border-radius: 6px; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: opacity 0.15s;
    &:hover:not(:disabled) { opacity: 0.88; }
    &:disabled { opacity: 0.45; cursor: not-allowed; }
}
.btn-cancel { background: none; border: none; color: #aaa; font-size: 13px; cursor: pointer; padding: 7px 8px; &:hover { color: #555; } }

// ── Rule items ────────────────────────────────────
.rule-item {
    display: flex; gap: 12px; align-items: flex-start;
    padding: 14px 0; border-bottom: 1px solid #f5f3fb;
    &:first-child { margin-top: 8px; }
    &:last-child { border-bottom: 0; }

    .rule-index {
        width: 22px; height: 22px; border-radius: 50%;
        background: $accent; color: #fff;
        font-size: 11px; font-weight: 700;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; margin-top: 2px;
    }

    .rule-content { flex: 1;
        .rule-name { font-size: 14px; font-weight: 600; color: #333; margin-bottom: 5px; }
        .rule-cond {
            font-size: 12px; color: #888; display: flex; align-items: center; gap: 6px;
            i { color: #c9c2e8; }
            code { background: #f5f3fb; border: 1px solid #e0ddf0; border-radius: 4px; padding: 2px 7px; font-size: 11px; color: $accent; font-family: 'Courier New', monospace; }
            &.no-cond { color: #00a76f; i { color: #00a76f; } }
        }
    }

    .rule-edit {
        flex: 1; display: flex; flex-wrap: wrap; gap: 8px; align-items: flex-start;
        .edit-input { height: 32px; border: 1.5px solid #e0ddf0; border-radius: 6px; padding: 0 9px; font-size: 13px; outline: none; width: 160px; &:focus { border-color: $accent; } &.edit-input--wide { flex: 1; min-width: 180px; } }
        .edit-actions { width: 100%; display: flex; gap: 8px; }
    }

    .rule-row-actions { display: flex; gap: 4px; flex-shrink: 0; }
}

// ── Fields table ──────────────────────────────────
.fields-table {
    width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 8px;

    thead { background: #ede9f7;
        th { padding: 10px 12px; text-align: left; font-weight: 600; color: $purple; white-space: nowrap; }
    }

    tbody tr {
        border-bottom: 1px solid #f5f3fb;
        &:hover:not(.editing-row) { background: #faf9fd; }
        &.editing-row { background: #faf9fd; }
        td { padding: 10px 12px; color: #555; vertical-align: middle;
            code { background: #f0eeff; color: $accent; padding: 2px 6px; border-radius: 4px; font-size: 11px; }
        }
    }
}

.col-actions { width: 90px; white-space: nowrap; }

.inline-input {
    height: 30px; border: 1.5px solid #e0ddf0; border-radius: 5px;
    padding: 0 8px; font-size: 12px; outline: none; width: 100%;
    &:focus { border-color: $accent; }
}
.inline-select {
    height: 30px; border: 1.5px solid #e0ddf0; border-radius: 5px;
    padding: 0 6px; font-size: 12px; outline: none; width: 100%;
    &:focus { border-color: $accent; }
}

// ── Shared buttons ────────────────────────────────
.row-btn {
    width: 26px; height: 26px; border-radius: 5px; border: 1px solid #e0ddf0;
    background: #fff; color: #aaa; cursor: pointer; display: inline-flex;
    align-items: center; justify-content: center; font-size: 12px; transition: all 0.15s;
    &:hover { border-color: $accent; color: $accent; background: #f0eeff; }
    &.row-btn--danger:hover { border-color: #e05c5c; color: #e05c5c; background: #fff0f0; }
}
.btn-confirm-sm {
    height: 26px; padding: 0 10px; border-radius: 5px; border: none;
    background: $accent; color: #fff; font-size: 12px; cursor: pointer;
    display: inline-flex; align-items: center; gap: 4px;
    &:disabled { opacity: 0.4; cursor: not-allowed; }
}
.btn-cancel-sm {
    height: 26px; padding: 0 8px; border-radius: 5px; border: 1px solid #e0ddf0;
    background: #fff; color: #aaa; font-size: 12px; cursor: pointer;
    &:hover { color: #555; }
}

.type-pill { background: #f0eeff; color: $accent; font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 4px; }

.no-rules { text-align: center; color: #aaa; padding: 32px 16px; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 8px; }

// ── Modal transition ──────────────────────────────
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
