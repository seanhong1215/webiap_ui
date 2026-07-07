<template>
    <template v-if="isLoginPage">
        <router-view></router-view>
    </template>
    <template v-else>
        <app-shell>
            <router-view v-slot="{ Component }">
                <transition name="page" mode="out-in">
                    <component :is="Component" :key="$route.name" />
                </transition>
            </router-view>
        </app-shell>
    </template>
    <div id="portal-target"></div>
</template>

<script>
import AppShell from './components/Layout/AppShell.vue';
export default {
    name: 'App',
    components: { AppShell },
    computed: {
        isLoginPage() {
            return this.$route.name === 'Login';
        },
    },
};
</script>

<style>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang TC', sans-serif;
    background: #f4f5f9;
}

/* 換頁淡入淡出 + 輕微上浮過場 */
.page-enter-active,
.page-leave-active {
    transition:
        opacity 0.22s ease,
        transform 0.22s ease;
}
.page-enter-from {
    opacity: 0;
    transform: translateY(8px);
}
.page-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

/* 尊重使用者「減少動態效果」偏好 */
@media (prefers-reduced-motion: reduce) {
    .page-enter-active,
    .page-leave-active {
        transition: none;
    }
}
</style>
