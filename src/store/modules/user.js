export default {
    namespaced: true,
    state: {
        currentUser: null,
    },
    mutations: {
        setUser(state, user) {
            state.currentUser = user;
        },
        clearUser(state) {
            state.currentUser = null;
        },
    },
    getters: {
        currentUser: (state) => state.currentUser,
        isAdmin: (state) => state.currentUser?.role === 'admin',
        isLoggedIn: (state) => !!state.currentUser,
    },
};
