import { createApp } from 'vue/dist/vue.esm-bundler.js'; // vue
import Antd from 'ant-design-vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import i18n from './i18n';
import 'ant-design-vue/dist/antd.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import './assets/css/scrollbar.css'; // Import customed scrollbar css
import browserDetect from './utils/browserDetect.js';
import vClickOutside from 'click-outside-vue3';
import antDesignCompat from './plugins/antDesignCompat';

createApp(App)
    .use(store)
    .use(router)
    .use(Antd)
    .use(antDesignCompat)
    .use(i18n)
    .use(browserDetect)
    .use(VueLoading, {
        color: '#666666',
        loader: 'dots',
    })
    .use(vClickOutside)
    .mount('#app');
