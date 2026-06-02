import { createRouter, createWebHashHistory } from 'vue-router';
import store from '../store';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import FormCatalog from '../views/FormCatalog.vue';
import FormDetail from '../views/FormDetail.vue';
import ApprovalCenter from '../views/ApprovalCenter.vue';
import MyRequests from '../views/MyRequests.vue';
import AdminOverview from '../views/AdminOverview.vue';
import AdminProcesses from '../views/AdminProcesses.vue';
import AdminRecords from '../views/AdminRecords.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
    { path: '/', redirect: { name: 'Login' } },
    { path: '/login', name: 'Login', component: Login, meta: { title: '登入' } },

    // ── 使用者功能 ──────────────────────────────────
    { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { title: '控制台' } },
    { path: '/forms', name: 'FormCatalog', component: FormCatalog, meta: { title: '申請表單' } },
    { path: '/forms/:id', name: 'FormDetail', component: FormDetail, meta: { title: '表單詳情' } },
    { path: '/approvals', name: 'ApprovalCenter', component: ApprovalCenter, meta: { title: '審核中心' } },
    { path: '/my-requests', name: 'MyRequests', component: MyRequests, meta: { title: '我的申請' } },

    // ── 管理員功能 ──────────────────────────────────
    { path: '/admin', name: 'AdminOverview', component: AdminOverview, meta: { title: '系統總覽', requiresAdmin: true } },
    { path: '/admin/processes', name: 'AdminProcesses', component: AdminProcesses, meta: { title: '流程總覽', requiresAdmin: true } },
    { path: '/admin/records', name: 'AdminRecords', component: AdminRecords, meta: { title: '申請記錄', requiresAdmin: true } },

    { path: '/:patchMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to) => {
    const currentUser = store.getters['user/currentUser'];
    if (to.name === 'Login') return true;
    if (!currentUser) return { name: 'Login' };
    if (to.meta.requiresAdmin && currentUser.role !== 'admin') return { name: 'Dashboard' };
    return true;
});

export default router;
