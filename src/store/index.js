import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import process from './modules/process';
import condition from './modules/condition';
import user from './modules/user';

export default createStore({
    state: {
        lang: 'zh_TW',
    },
    mutations: {
        setLang(state, payload) {
            state.lang = payload;
        },
    },
    actions: {
        updateLang(context, lang) {
            context.commit('setLang', lang);
        },
    },
    getters: {},
    modules: { process, condition, user },
    plugins: [
        createPersistedState({
            storage: window.sessionStorage,
            paths: [
                'process.categories',
                'process.processList',
                'process.viewType',
                'process.selectedProId',
                'process.selectedArtId',
                'process.selectedSpecProId',
                'process.specMfp',
                'condition',
                'user.currentUser',
            ],
        }),
    ],
});
