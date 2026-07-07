<template>
    <template v-if="isLoginPage">
        <router-view></router-view>
    </template>
    <template v-else>
        <app-shell>
            <router-view></router-view>
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
</style>
