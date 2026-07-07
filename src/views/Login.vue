<template>
    <div class="login-page">
        <div class="login-card">
            <div class="login-logo">
                <div class="logo-icon"><i class="ti ti-network"></i></div>
                <div class="logo-title">FlowRing</div>
                <div class="logo-subtitle">企業智慧簽核平台</div>
            </div>
            <div class="login-form">
                <div class="form-field">
                    <label>帳號</label>
                    <input v-model="username" type="text" placeholder="user 或 admin" :class="{ error: loginError }" @keyup.enter="login" />
                </div>
                <div class="form-field">
                    <label>密碼</label>
                    <input
                        v-model="password"
                        type="password"
                        placeholder="請輸入密碼"
                        :class="{ error: loginError }"
                        @keyup.enter="login"
                    />
                </div>
                <div v-if="loginError" class="error-msg"><i class="ti ti-exclamation-circle"></i> 帳號或密碼錯誤，請重新輸入</div>
                <button class="login-btn" :disabled="!username || !password" @click="login">
                    <i class="ti ti-login"></i>
                    登入系統
                </button>
                <div class="demo-hints">
                    <div class="demo-hint-row">
                        <span class="hint-badge user">一般使用者</span>
                        <span class="hint-text">帳號：<code>user</code>　密碼：<code>123456</code></span>
                    </div>
                    <div class="demo-hint-row">
                        <span class="hint-badge admin">管理員</span>
                        <span class="hint-text">帳號：<code>admin</code>　密碼：<code>admin</code></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="login-bg-decoration">
            <div class="circle circle-1"></div>
            <div class="circle circle-2"></div>
            <div class="circle circle-3"></div>
        </div>
    </div>
</template>
<script>
import { MOCK_USERS } from '@/utils/mockData';
import { mapMutations } from 'vuex';
export default {
    name: 'Login',
    data() {
        return {
            username: '',
            password: '',
            loginError: false,
        };
    },
    methods: {
        ...mapMutations('user', ['setUser']),
        login() {
            if (!this.username || !this.password) return;
            const matched = MOCK_USERS.find((u) => u.account === this.username && u.password === this.password);
            if (!matched) {
                this.loginError = true;
                return;
            }
            this.loginError = false;
            this.setUser(matched);
            this.$router.push({ name: 'Dashboard' });
        },
    },
};
</script>
<style lang="scss" scoped>
.login-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #483e72 0%, #6e5faf 50%, #8b7dd4 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

.login-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24px;
    padding: 48px 56px;
    width: 420px;
    box-shadow: 0 20px 60px rgba(72, 62, 114, 0.3);
    position: relative;
    z-index: 10;
}

.login-logo {
    text-align: center;
    margin-bottom: 40px;

    .logo-icon {
        width: 64px;
        height: 64px;
        background: linear-gradient(135deg, #483e72, #6e5faf);
        border-radius: 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;

        i {
            font-size: 28px;
            color: #fff;
        }
    }

    .logo-title {
        font-size: 24px;
        font-weight: 700;
        color: #333;
        line-height: 1.2;
    }

    .logo-subtitle {
        font-size: 13px;
        color: #888;
        margin-top: 4px;
    }
}

.login-form {
    .form-field {
        margin-bottom: 20px;

        label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #555;
            margin-bottom: 6px;
        }

        input {
            width: 100%;
            height: 44px;
            border: 1.5px solid #ddd;
            border-radius: 8px;
            padding: 0 14px;
            font-size: 14px;
            color: #333;
            outline: none;
            transition: border-color 0.2s;
            box-sizing: border-box;

            &:focus {
                border-color: #6e5faf;
                box-shadow: 0 0 0 3px rgba(110, 95, 175, 0.12);
            }

            &.error {
                border-color: #da1414;
                box-shadow: 0 0 0 3px rgba(218, 20, 20, 0.08);
            }

            &::placeholder {
                color: #bbb;
            }
        }
    }
}

.error-msg {
    margin-top: -12px;
    margin-bottom: 16px;
    font-size: 13px;
    color: #da1414;
    display: flex;
    align-items: center;
    gap: 5px;
}

.login-btn {
    width: 100%;
    height: 48px;
    background: linear-gradient(135deg, #483e72, #6e5faf);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition:
        opacity 0.2s,
        transform 0.1s;
    margin-top: 8px;

    i {
        font-size: 16px;
    }

    &:hover:not(:disabled) {
        opacity: 0.9;
        transform: translateY(-1px);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }
}

.demo-hints {
    margin-top: 20px;
    background: #f8f7fc;
    border-radius: 10px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .demo-hint-row {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
        color: #555;
    }

    .hint-badge {
        font-size: 11px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 20px;
        white-space: nowrap;

        &.user {
            background: #ede9f7;
            color: #6e5faf;
        }
        &.admin {
            background: #483e72;
            color: #fff;
        }
    }

    .hint-text {
        color: #777;
        code {
            background: #fff;
            border: 1px solid #e0ddf0;
            border-radius: 4px;
            padding: 1px 6px;
            font-size: 12px;
            color: #483e72;
            font-family: 'Courier New', monospace;
        }
    }
}

.login-bg-decoration {
    position: absolute;
    inset: 0;
    pointer-events: none;

    .circle {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.06);
    }

    .circle-1 {
        width: 400px;
        height: 400px;
        top: -100px;
        right: -80px;
    }

    .circle-2 {
        width: 300px;
        height: 300px;
        bottom: -60px;
        left: -80px;
    }

    .circle-3 {
        width: 200px;
        height: 200px;
        top: 40%;
        left: 60%;
    }
}
</style>
