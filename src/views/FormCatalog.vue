<template>
    <div class="form-catalog">
        <div class="catalog-header">
            <div>
                <h2 class="catalog-title">選擇申請表單</h2>
                <p class="catalog-sub">選擇需要的申請類型，系統將自動帶入對應的審核流程</p>
            </div>
            <div class="catalog-search">
                <i class="fal fa-search search-icon"></i>
                <input v-model="keyword" placeholder="搜尋表單名稱..." class="search-input" />
            </div>
        </div>

        <!-- 分類篩選 -->
        <div class="category-tabs">
            <button
                v-for="cat in categories"
                :key="cat"
                :class="['cat-tab', { active: selectedCat === cat }]"
                @click="selectedCat = cat"
            >{{ cat }}</button>
        </div>

        <!-- 表單卡片 -->
        <div class="forms-grid">
            <div
                v-for="form in filteredForms"
                :key="form.id"
                class="form-card"
                @click="goToForm(form)"
            >
                <div class="form-card-top">
                    <div class="form-icon" :style="{ background: form.color + '18', color: form.color }">
                        <i :class="form.icon"></i>
                    </div>
                    <span class="form-status-badge" :class="'status-' + form.status">{{ statusLabel(form.status) }}</span>
                </div>
                <div class="form-card-body">
                    <div class="form-name">{{ form.name }}</div>
                    <div class="form-cat">{{ form.category }}</div>
                    <div class="form-desc">{{ form.desc }}</div>
                </div>
                <div class="form-card-footer">
                    <div class="form-meta">
                        <span><i class="fal fa-user"></i> {{ form.manager }}</span>
                        <span><i class="fal fa-layer-group"></i> {{ form.version }}</span>
                    </div>
                    <button class="apply-btn">申請 <i class="fal fa-arrow-right"></i></button>
                </div>
            </div>
        </div>

        <div class="empty-state" v-if="filteredForms.length === 0">
            <i class="fal fa-search empty-icon"></i>
            <div>找不到符合「{{ keyword }}」的表單</div>
        </div>
    </div>
</template>

<script>
import { MOCK_CARDS, MOCK_CATEGORIES } from '@/utils/mockData';
import global from '@/utils/global';

const FORM_ICONS = {
    PRJ001: { icon: 'fal fa-user-clock', color: '#6e5faf' },
    PRJ002: { icon: 'fal fa-file-invoice-dollar', color: '#0070d1' },
    PRJ003: { icon: 'fal fa-building', color: '#00a76f' },
    PRJ004: { icon: 'fal fa-box', color: '#f4a42c' },
};

export default {
    name: 'FormCatalog',
    data() {
        return {
            keyword: '',
            selectedCat: '全部',
        };
    },
    computed: {
        categories() {
            const cats = ['全部', ...new Set(MOCK_CARDS.map(c => MOCK_CATEGORIES[c.prjID]))];
            return cats;
        },
        allForms() {
            return MOCK_CARDS.map(card => {
                const status = global.processTypeConverter(card.startTime, card.endTime);
                const prjMeta = FORM_ICONS[card.prjID] || { icon: 'fal fa-file-alt', color: '#6e5faf' };
                return {
                    id: card.proID,
                    artId: card.artID,
                    name: card.proName,
                    category: MOCK_CATEGORIES[card.prjID],
                    desc: card.proSynopsis,
                    manager: card.accessMemInfo[0]?.memName || '-',
                    version: card.versionIndex,
                    status,
                    icon: prjMeta.icon,
                    color: prjMeta.color,
                };
            });
        },
        filteredForms() {
            return this.allForms.filter(f => {
                const matchCat = this.selectedCat === '全部' || f.category === this.selectedCat;
                const matchKw = !this.keyword || f.name.includes(this.keyword) || f.desc.includes(this.keyword);
                return matchCat && matchKw;
            });
        },
    },
    methods: {
        statusLabel(type) {
            return { 1: '草稿', 2: '即將生效', 3: '可申請', 4: '已停用' }[type] || '-';
        },
        goToForm(form) {
            this.$store.dispatch('process/updateSelectedSpecProId', form.id);
            this.$router.push({ name: 'FormDetail', params: { id: form.id } });
        },
    },
};
</script>

<style lang="scss" scoped>
$accent: #6e5faf;

.form-catalog { }

.catalog-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
    gap: 16px;

    .catalog-title { font-size: 20px; font-weight: 700; color: #333; margin-bottom: 6px; }
    .catalog-sub { font-size: 14px; color: #919191; }
}

.catalog-search {
    position: relative;
    flex-shrink: 0;

    .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #aaa; }
    .search-input {
        border: 1.5px solid #eaecf0;
        border-radius: 10px;
        padding: 9px 14px 9px 36px;
        font-size: 14px;
        width: 240px;
        outline: none;
        &:focus { border-color: $accent; }
    }
}

.category-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.cat-tab {
    padding: 6px 16px;
    border-radius: 20px;
    border: 1.5px solid #eaecf0;
    background: #fff;
    font-size: 14px;
    color: #5c6466;
    cursor: pointer;
    transition: all 0.15s;

    &:hover { border-color: $accent; color: $accent; }
    &.active { background: $accent; border-color: $accent; color: #fff; font-weight: 600; }
}

.forms-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.form-card {
    background: #fff;
    border-radius: 14px;
    border: 1.5px solid #eaecf0;
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    gap: 14px;

    &:hover {
        border-color: $accent;
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(110, 95, 175, 0.12);
    }
}

.form-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .form-icon {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
    }
}

.form-status-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 12px;
    &.status-1 { background: #f5f5f5; color: #aaa; }
    &.status-2 { background: #fff8ec; color: #f4a42c; }
    &.status-3 { background: #f0faf5; color: #00a76f; }
    &.status-4 { background: #fff0f0; color: #e44d55; }
}

.form-card-body {
    .form-name { font-size: 16px; font-weight: 700; color: #333; margin-bottom: 4px; }
    .form-cat { font-size: 12px; color: #aaa; margin-bottom: 8px; }
    .form-desc { font-size: 13px; color: #666; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
}

.form-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;

    .form-meta {
        display: flex;
        gap: 12px;
        font-size: 12px;
        color: #aaa;
        i { margin-right: 3px; }
    }
}

.apply-btn {
    background: $accent;
    color: #fff;
    border: none;
    padding: 7px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: opacity 0.15s;
    &:hover { opacity: 0.88; }
}

.empty-state {
    text-align: center;
    padding: 60px 0;
    color: #aaa;
    font-size: 14px;
    .empty-icon { font-size: 40px; display: block; margin-bottom: 12px; }
}
</style>
