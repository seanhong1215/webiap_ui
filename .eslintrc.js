module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es2021: true,
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    extends: [
        'plugin:vue/vue3-recommended',
        // 關掉與 Prettier 衝突的格式規則,交給 Prettier 處理
        'eslint-config-prettier',
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        // 多字組件名慣例對本專案 view 命名(單字如 Dashboard)過嚴,關閉
        'vue/multi-word-component-names': 'off',
    },
};
