<template>
    <div v-if="form" class="form-detail">
        <!-- 返回 + 標題 -->
        <div class="fd-header">
            <button class="back-btn" @click="$router.push({ name: 'FormCatalog' })">
                <i class="ti ti-arrow-left"></i>
            </button>
            <div>
                <div class="fd-title">{{ form.proName }}</div>
                <div class="fd-path">申請表單 → {{ category }} → {{ form.proName }}</div>
            </div>
        </div>

        <div class="fd-layout">
            <!-- 左：表單填寫 -->
            <div class="fd-main">
                <div class="fd-card">
                    <div class="fd-card-title"><i class="ti ti-edit"></i> 填寫申請內容</div>

                    <div v-if="!submitted">
                        <div v-for="field in fields" :key="field.name" class="form-field">
                            <label class="field-label">
                                {{ field.label }}
                                <span class="required">*</span>
                            </label>

                            <select v-if="field.type === 'select'" v-model="formData[field.name]" class="field-input">
                                <option value="" disabled>請選擇...</option>
                                <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
                            </select>

                            <input
                                v-else-if="field.type === 'number'"
                                v-model="formData[field.name]"
                                type="number"
                                class="field-input"
                                :placeholder="field.placeholder"
                            />

                            <input v-else-if="field.type === 'date'" v-model="formData[field.name]" type="date" class="field-input" />

                            <textarea
                                v-else-if="field.type === 'textarea'"
                                v-model="formData[field.name]"
                                class="field-input textarea"
                                rows="3"
                                :placeholder="field.placeholder"
                            ></textarea>

                            <input v-else v-model="formData[field.name]" type="text" class="field-input" :placeholder="field.placeholder" />

                            <div v-if="field.help" class="field-help">{{ field.help }}</div>
                        </div>

                        <div class="submit-area">
                            <button class="cancel-btn" @click="$router.go(-1)">取消</button>
                            <button class="submit-btn" :disabled="!isValid" @click="submitForm"><i class="ti ti-send"></i> 送出申請</button>
                        </div>
                    </div>

                    <!-- 送出成功 -->
                    <div v-else class="success-state">
                        <div class="success-icon"><i class="ti ti-circle-check"></i></div>
                        <div class="success-title">申請已送出！</div>
                        <div class="success-sub">系統已自動通知審核人員，您可在「我的申請」中追蹤狀態</div>
                        <div class="success-serial">
                            申請編號：<strong>{{ newSerialNo }}</strong>
                        </div>
                        <div class="success-actions">
                            <button class="cancel-btn" @click="$router.push({ name: 'MyRequests' })">查看我的申請</button>
                            <button class="submit-btn" @click="$router.push({ name: 'FormCatalog' })">返回表單目錄</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右：審核流程說明 -->
            <div class="fd-side">
                <div class="fd-card">
                    <div class="fd-card-title"><i class="ti ti-route"></i> 審核流程</div>
                    <div class="flow-steps">
                        <div v-for="(step, i) in approvalFlow" :key="i" class="flow-step">
                            <div class="flow-step-num">{{ i + 1 }}</div>
                            <div class="flow-step-body">
                                <div class="flow-step-name">{{ step.name }}</div>
                                <div class="flow-step-actor">{{ step.actor }}</div>
                                <div v-if="step.condition" class="flow-step-cond">條件：{{ step.condition }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="fd-card">
                    <div class="fd-card-title"><i class="ti ti-info-circle"></i> 說明</div>
                    <div class="fd-desc">{{ form.proSynopsis }}</div>
                    <div class="fd-meta">
                        <div class="meta-row">
                            <span class="meta-key">負責人員</span><span class="meta-val">{{ form.accessMemInfo?.[0]?.memName }}</span>
                        </div>
                        <div class="meta-row">
                            <span class="meta-key">所屬部門</span><span class="meta-val">{{ form.accessMemInfo?.[0]?.depName }}</span>
                        </div>
                        <div class="meta-row">
                            <span class="meta-key">目前版本</span><span class="meta-val">{{ form.versionIndex }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { MOCK_CARDS, MOCK_CATEGORIES } from '@/utils/mockData';

const FORM_FIELDS = {
    PRO001: [
        { name: 'LeaveType', label: '請假類型', type: 'select', options: ['特休', '事假', '病假', '喪假', '婚假'] },
        { name: 'Days', label: '請假天數', type: 'number', placeholder: '輸入天數', help: '半天請假請填 0.5' },
        { name: 'StartDate', label: '開始日期', type: 'date' },
        { name: 'EndDate', label: '結束日期', type: 'date' },
        { name: 'Reason', label: '請假原因', type: 'textarea', placeholder: '請說明請假事由...' },
    ],
    PRO003: [
        { name: 'ExpenseType', label: '費用類型', type: 'select', options: ['差旅費', '業務費', '餐費', '材料費', '其他'] },
        { name: 'Amount', label: '金額（元）', type: 'number', placeholder: '請輸入報銷金額' },
        { name: 'ExpenseDate', label: '費用發生日期', type: 'date' },
        { name: 'Description', label: '費用說明', type: 'textarea', placeholder: '請說明費用用途及必要性...' },
    ],
    PRO005: [
        { name: 'RoomId', label: '申請會議室', type: 'select', options: ['A會議室（10人）', 'B會議室（20人）', 'C董事會議室（30人）'] },
        { name: 'Duration', label: '使用時間（分鐘）', type: 'number', placeholder: '例如 90 分鐘' },
        { name: 'Attendees', label: '預計出席人數', type: 'number', placeholder: '人數' },
        { name: 'HasExternalGuest', label: '是否有外部訪客', type: 'select', options: ['否', '是'] },
        { name: 'Purpose', label: '會議目的', type: 'textarea', placeholder: '請說明會議議題...' },
    ],
    PRO007: [
        { name: 'ItemType', label: '設備類型', type: 'select', options: ['一般設備', '精密儀器', '車輛', '電腦周邊'] },
        { name: 'ItemName', label: '設備名稱', type: 'text', placeholder: '例如：示波器 DS1054Z' },
        { name: 'BorrowDays', label: '借用天數', type: 'number', placeholder: '天數' },
        { name: 'ReturnDate', label: '預計歸還日期', type: 'date' },
        { name: 'Purpose', label: '借用用途', type: 'textarea', placeholder: '請說明借用目的...' },
    ],
};

const APPROVAL_FLOWS = {
    PRO001: [
        { name: '申請人送出', actor: '本人', condition: '' },
        { name: '主管審核', actor: '直屬主管', condition: '所有請假類型' },
        { name: 'HR 確認', actor: '人力資源部', condition: '天數 > 3 或病假' },
        { name: '完成', actor: '系統', condition: '' },
    ],
    PRO003: [
        { name: '申請人送出', actor: '本人', condition: '' },
        { name: '主管審核', actor: '直屬主管', condition: '金額 ≤ 10,000' },
        { name: '財務長審核', actor: '財務長', condition: '差旅費 & 金額 > 10,000' },
        { name: '完成', actor: '財務部門', condition: '核帳入帳' },
    ],
    PRO005: [
        { name: '申請人送出', actor: '本人', condition: '' },
        { name: '行政確認', actor: '行政部', condition: '一般申請 & 使用 ≤ 120 分' },
        { name: '主管審核', actor: '部門主管', condition: '含外部訪客' },
        { name: '完成', actor: '系統', condition: '會議室確認' },
    ],
    PRO007: [
        { name: '申請人送出', actor: '本人', condition: '' },
        { name: '主管審核', actor: '直屬主管', condition: '借用 ≤ 7 天 & 一般設備' },
        { name: '資產管理確認', actor: '資產管理部', condition: '精密儀器或 > 7 天' },
        { name: '完成', actor: '系統', condition: '設備確認' },
    ],
};

export default {
    name: 'FormDetail',
    data() {
        return {
            formData: {},
            submitted: false,
            newSerialNo: '',
        };
    },
    computed: {
        proId() {
            return this.$route.params.id;
        },
        form() {
            return MOCK_CARDS.find((c) => c.proID === this.proId) || null;
        },
        category() {
            return this.form ? MOCK_CATEGORIES[this.form.prjID] : '';
        },
        fields() {
            return FORM_FIELDS[this.proId] || FORM_FIELDS['PRO001'];
        },
        approvalFlow() {
            return APPROVAL_FLOWS[this.proId] || APPROVAL_FLOWS['PRO001'];
        },
        isValid() {
            return this.fields.every((f) => this.formData[f.name] && String(this.formData[f.name]).trim() !== '');
        },
    },
    created() {
        this.fields.forEach((f) => {
            this.formData[f.name] = '';
        });
    },
    methods: {
        submitForm() {
            if (!this.isValid) return;
            const prefix = { PRO001: 'LEAVE', PRO003: 'EXP', PRO005: 'ROOM', PRO007: 'BORROW' }[this.proId] || 'FORM';
            this.newSerialNo = `${prefix}-2026-0602-${String(Math.floor(Math.random() * 900) + 100)}`;
            this.submitted = true;
        },
    },
};
</script>

<style lang="scss" scoped>
$accent: #6e5faf;

.form-detail {
}

.fd-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    .back-btn {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        border: 1.5px solid #eaecf0;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #666;
        font-size: 15px;
        flex-shrink: 0;
        &:hover {
            border-color: $accent;
            color: $accent;
        }
    }
    .fd-title {
        font-size: 20px;
        font-weight: 700;
        color: #333;
        margin-bottom: 4px;
    }
    .fd-path {
        font-size: 13px;
        color: #aaa;
    }
}

.fd-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 16px;
    align-items: start;

    @media (max-width: 820px) {
        grid-template-columns: 1fr;
    }
}

.fd-main {
}

.fd-card {
    background: #fff;
    border-radius: 14px;
    border: 1px solid #eaecf0;
    padding: 24px;
    margin-bottom: 16px;
    .fd-card-title {
        font-size: 15px;
        font-weight: 700;
        color: #333;
        margin-bottom: 20px;
        i {
            color: $accent;
            margin-right: 8px;
        }
    }
}

.form-field {
    margin-bottom: 20px;
}
.field-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #555;
    margin-bottom: 6px;
    .required {
        color: #e44d55;
        margin-left: 3px;
    }
}
.field-input {
    width: 100%;
    border: 1.5px solid #eaecf0;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 14px;
    color: #333;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s;
    background: #fff;
    &:focus {
        border-color: $accent;
        box-shadow: 0 0 0 3px rgba(110, 95, 175, 0.1);
    }
    &.textarea {
        resize: vertical;
    }
}
select.field-input {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
    cursor: pointer;
}
.field-help {
    font-size: 12px;
    color: #aaa;
    margin-top: 4px;
}

.submit-area {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 28px;
    padding-top: 20px;
    border-top: 1px solid #eaecf0;
}
.cancel-btn {
    padding: 10px 24px;
    border-radius: 10px;
    border: 1.5px solid #eaecf0;
    background: #fff;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    font-weight: 500;
    &:hover {
        background: #f5f5f5;
    }
}
.submit-btn {
    padding: 10px 24px;
    border-radius: 10px;
    border: none;
    background: $accent;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    &:hover:not(:disabled) {
        opacity: 0.88;
    }
    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }
}

.success-state {
    text-align: center;
    padding: 32px 0;
}
.success-icon {
    font-size: 60px;
    color: #00a76f;
    margin-bottom: 16px;
}
.success-title {
    font-size: 22px;
    font-weight: 700;
    color: #333;
    margin-bottom: 8px;
}
.success-sub {
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
}
.success-serial {
    font-size: 14px;
    color: #aaa;
    margin-bottom: 24px;
    strong {
        color: $accent;
        font-family: monospace;
    }
}
.success-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
}

// ── Side ─────────────────────────────────────────
.flow-steps {
    display: flex;
    flex-direction: column;
    gap: 0;
}
.flow-step {
    display: flex;
    gap: 12px;
    padding-bottom: 16px;
    position: relative;
    &:not(:last-child)::after {
        content: '';
        position: absolute;
        left: 14px;
        top: 30px;
        bottom: 0;
        width: 2px;
        background: #f0eeff;
    }
    .flow-step-num {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: $accent;
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        z-index: 1;
    }
    .flow-step-name {
        font-size: 14px;
        font-weight: 600;
        color: #333;
        margin-bottom: 3px;
    }
    .flow-step-actor {
        font-size: 12px;
        color: #666;
    }
    .flow-step-cond {
        font-size: 11px;
        color: $accent;
        margin-top: 3px;
        font-style: italic;
    }
}

.fd-desc {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 16px;
}
.fd-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.meta-row {
    display: flex;
    gap: 10px;
    font-size: 13px;
}
.meta-key {
    color: #aaa;
    min-width: 70px;
}
.meta-val {
    color: #333;
    font-weight: 500;
}
</style>
