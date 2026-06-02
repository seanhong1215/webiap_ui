import * as VueI18n from 'vue-i18n';
import zhTw from './zhTw.json';
import store from '../store';

const messages = {
    zh_TW: zhTw,
};

const i18n = VueI18n.createI18n({
    locale: store.state.lang,
    fallbackLocale: 'zh_TW',
    messages,
});

export default i18n;
