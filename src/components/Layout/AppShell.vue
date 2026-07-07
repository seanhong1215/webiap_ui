<template>
    <div class="app-shell">
        <!-- Sidebar -->
        <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
            <div class="sidebar-brand" @click="$router.push({ name: 'Dashboard' })">
                <div class="brand-icon"><i class="fal fa-network-wired"></i></div>
                <div v-show="!sidebarCollapsed" class="brand-text">
                    <div class="brand-name">FlowRing</div>
                    <div class="brand-sub">企業智慧簽核平台</div>
                </div>
            </div>

            <nav class="sidebar-nav">
                <!-- 使用者功能 -->
                <div v-show="!sidebarCollapsed" class="nav-section-label">使用者</div>

                <router-link :to="{ name: 'Dashboard' }" class="nav-item" active-class="active">
                    <i class="fal fa-chart-line nav-icon"></i>
                    <span v-show="!sidebarCollapsed" class="nav-label">控制台</span>
                </router-link>

                <router-link :to="{ name: 'FormCatalog' }" class="nav-item" active-class="active">
                    <i class="fal fa-file-edit nav-icon"></i>
                    <span v-show="!sidebarCollapsed" class="nav-label">申請表單</span>
                </router-link>

                <router-link :to="{ name: 'ApprovalCenter' }" class="nav-item" active-class="active">
                    <i class="fal fa-stamp nav-icon"></i>
                    <span v-show="!sidebarCollapsed" class="nav-label">審核中心</span>
                    <span v-if="pendingCount > 0" class="nav-badge">{{ pendingCount }}</span>
                </router-link>

                <router-link :to="{ name: 'MyRequests' }" class="nav-item" active-class="active">
                    <i class="fal fa-inbox nav-icon"></i>
                    <span v-show="!sidebarCollapsed" class="nav-label">我的申請</span>
                </router-link>

                <!-- 管理員功能 -->
                <template v-if="isAdmin">
                    <div v-show="!sidebarCollapsed" class="nav-section-label" style="margin-top: 16px">管理後台</div>
                    <div v-show="sidebarCollapsed" class="nav-divider"></div>

                    <router-link :to="{ name: 'AdminOverview' }" class="nav-item" active-class="active">
                        <i class="fal fa-th-large nav-icon"></i>
                        <span v-show="!sidebarCollapsed" class="nav-label">系統總覽</span>
                    </router-link>

                    <router-link :to="{ name: 'AdminProcesses' }" class="nav-item" active-class="active">
                        <i class="fal fa-sitemap nav-icon"></i>
                        <span v-show="!sidebarCollapsed" class="nav-label">流程總覽</span>
                    </router-link>

                    <router-link :to="{ name: 'AdminRecords' }" class="nav-item" active-class="active">
                        <i class="fal fa-clipboard-list nav-icon"></i>
                        <span v-show="!sidebarCollapsed" class="nav-label">申請記錄</span>
                    </router-link>
                </template>
            </nav>

            <div class="sidebar-footer">
                <div v-show="!sidebarCollapsed" class="user-info">
                    <div class="user-avatar">{{ userAvatar }}</div>
                    <div class="user-detail">
                        <div class="user-name">{{ userName }}</div>
                        <div class="user-dept">{{ userDept }}</div>
                    </div>
                </div>
                <div v-show="sidebarCollapsed" class="user-avatar-sm">{{ userAvatar }}</div>
                <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
                    <i :class="sidebarCollapsed ? 'fal fa-chevron-right' : 'fal fa-chevron-left'"></i>
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="main-area">
            <header class="top-bar">
                <div class="page-title">{{ pageTitle }}</div>
                <div class="top-bar-actions">
                    <div class="top-user">
                        <div class="user-avatar-sm">{{ userAvatar }}</div>
                        <span>{{ userName }}</span>
                        <span v-if="isAdmin" class="role-badge">管理員</span>
                    </div>
                    <button class="logout-btn" title="登出" @click="logout">
                        <i class="fal fa-sign-out"></i>
                    </button>
                </div>
            </header>
            <main class="content-area">
                <slot />
            </main>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { MOCK_PENDING_APPROVALS } from '@/utils/mockData';
export default {
    name: 'AppShell',
    data() {
        return {
            sidebarCollapsed: false,
            pendingCount: MOCK_PENDING_APPROVALS.length,
        };
    },
    computed: {
        ...mapGetters('user', ['currentUser', 'isAdmin']),
        userName() {
            return this.currentUser?.name || '訪客';
        },
        userDept() {
            return this.currentUser?.dept || '';
        },
        userAvatar() {
            return this.currentUser?.avatar || this.currentUser?.name?.[0] || '?';
        },
        pageTitle() {
            const titleMap = {
                Dashboard: '控制台',
                FormCatalog: '申請表單',
                FormDetail: '表單詳情',
                ApprovalCenter: '審核中心',
                ApprovalDetail: '審核表單',
                MyRequests: '我的申請',
                SubmissionDetail: '申請詳情',
                AdminOverview: '系統總覽',
                AdminProcesses: '流程總覽',
                AdminRecords: '申請記錄',
            };
            return titleMap[this.$route.name] || 'FlowRing';
        },
    },
    methods: {
        ...mapMutations('user', ['clearUser']),
        logout() {
            this.clearUser();
            this.$router.push({ name: 'Login' });
        },
    },
};
</script>

<style lang="scss" scoped>
$sidebar-width: 220px;
$sidebar-collapsed: 64px;
$primary: #483e72;
$accent: #6e5faf;
$bg: #f4f5f9;

.app-shell {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background: $bg;
}

// ── Sidebar ──────────────────────────────────────
.sidebar {
    width: $sidebar-width;
    min-width: $sidebar-width;
    background: #fff;
    border-right: 1px solid #eaecf0;
    display: flex;
    flex-direction: column;
    transition:
        width 0.25s,
        min-width 0.25s;
    overflow: hidden;

    &.collapsed {
        width: $sidebar-collapsed;
        min-width: $sidebar-collapsed;

        .nav-badge {
            display: none;
        }
    }
}

.sidebar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px 16px;
    cursor: pointer;
    border-bottom: 1px solid #f0eeff;

    .brand-icon {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, $primary, $accent);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        i {
            color: #fff;
            font-size: 14px;
        }
    }

    .brand-name {
        font-weight: 700;
        font-size: 15px;
        color: $primary;
        line-height: 1.2;
    }
    .brand-sub {
        font-size: 11px;
        color: #aaa;
    }
}

.sidebar-nav {
    flex: 1;
    overflow-y: auto;
    padding: 12px 8px;

    .nav-section-label {
        font-size: 11px;
        font-weight: 600;
        color: #aaa;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 4px 8px;
        margin-bottom: 4px;
    }

    .nav-divider {
        height: 1px;
        background: #eaecf0;
        margin: 8px 0;
    }
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border-radius: 8px;
    color: #5c6466;
    text-decoration: none;
    margin-bottom: 2px;
    position: relative;
    transition: all 0.15s;
    white-space: nowrap;

    &:hover {
        background: #f0eeff;
        color: $accent;
    }

    &.active {
        background: #f0eeff;
        color: $accent;
        font-weight: 600;

        .nav-icon {
            color: $accent;
        }

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 4px;
            bottom: 4px;
            width: 3px;
            background: $accent;
            border-radius: 0 2px 2px 0;
        }
    }

    .nav-icon {
        width: 20px;
        text-align: center;
        font-size: 15px;
        flex-shrink: 0;
        color: #919191;
    }

    .nav-label {
        font-size: 14px;
    }

    .nav-badge {
        margin-left: auto;
        background: #e44d55;
        color: #fff;
        font-size: 11px;
        font-weight: 600;
        min-width: 18px;
        height: 18px;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 4px;
    }
}

.sidebar-footer {
    border-top: 1px solid #eaecf0;
    padding: 12px 8px;
    display: flex;
    align-items: center;
    gap: 8px;

    .user-info {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
    }

    .user-detail {
        min-width: 0;
    }
    .user-name {
        font-size: 13px;
        font-weight: 600;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .user-dept {
        font-size: 11px;
        color: #aaa;
    }

    .collapse-btn {
        background: none;
        border: 1px solid #eaecf0;
        border-radius: 6px;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #919191;
        flex-shrink: 0;
        &:hover {
            background: #f0eeff;
            color: $accent;
        }
    }
}

// ── User Avatar ───────────────────────────────────
.user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, $primary, $accent);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.user-avatar-sm {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: linear-gradient(135deg, $primary, $accent);
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

// ── Main Area ─────────────────────────────────────
.main-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.top-bar {
    height: 56px;
    background: #fff;
    border-bottom: 1px solid #eaecf0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    flex-shrink: 0;

    .page-title {
        font-size: 16px;
        font-weight: 700;
        color: #333;
    }

    .top-bar-actions {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .top-user {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        color: #333;
    }

    .role-badge {
        font-size: 11px;
        font-weight: 600;
        background: $primary;
        color: #fff;
        border-radius: 20px;
        padding: 2px 8px;
    }

    .logout-btn {
        background: none;
        border: 1px solid #eaecf0;
        border-radius: 6px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #919191;
        &:hover {
            background: #fff0f0;
            color: #e44d55;
            border-color: #e44d55;
        }
    }
}

.content-area {
    flex: 1;
    overflow-y: auto;
    padding: 24px 32px;

    & > * {
        max-width: 1200px;
    }
}
</style>
