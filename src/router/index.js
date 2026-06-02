import { createRouter, createWebHashHistory } from 'vue-router';
import store from '../store';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import FormCatalog from '../views/FormCatalog.vue';
import FormDetail from '../views/FormDetail.vue';
import ApprovalCenter from '../views/ApprovalCenter.vue';
import MyRequests from '../views/MyRequests.vue';
import ProcessListManagement from '../views/ProcessListManagement.vue';
import VersionControlManagement from '../views/VersionControlManagement.vue';
import ProcessReview from '../views/ProcessReview.vue';
import ConditionSetting from '../views/ConditionSetting.vue';
import ProcessFlowView from '../views/ProcessFlowView.vue';
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

    // ── 流程管理（原有功能）────────────────────────
    { path: '/admin/processes', name: 'ProcessListManagement', component: ProcessListManagement, meta: { title: '流程設定' } },
    { path: '/admin/version', name: 'VersionControlManagement', component: VersionControlManagement, meta: { title: '版本管理' } },
    { path: '/admin/version/review', name: 'VersionProcessReview', component: ProcessReview, meta: { title: '查看版本' } },
    { path: '/admin/version/condition', name: 'VersionConditionSetting', component: ConditionSetting, meta: { title: '版本條件設定' } },
    { path: '/admin/review', name: 'ProcessReview', component: ProcessReview, meta: { title: '查看流程' } },
    { path: '/admin/review/flow', name: 'ProcessFlowView', component: ProcessFlowView, meta: { title: '流程圖' } },
    { path: '/admin/condition', name: 'ConditionSetting', component: ConditionSetting, meta: { title: '條件設定' } },

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
    if (to.path.startsWith('/admin') && currentUser.role !== 'admin') return { name: 'Dashboard' };
    return true;
});

export default router;
