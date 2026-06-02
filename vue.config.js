module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    pages: {
        index: {
            entry: 'src/main.js',
            title: 'FlowRing',
        },
    },
    chainWebpack: (config) => {
        config.plugin('copy').tap(([pathConfigs]) => {
            pathConfigs.unshift({
                from: 'config',
                to: 'config',
            });
            return [pathConfigs];
        });
    },
    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "~@/assets/scss/main.scss";`,
            },
        },
    },
};
