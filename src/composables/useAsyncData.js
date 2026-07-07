import { ref } from 'vue';

// 以 loading / error / data 三態封裝非同步資料載入。
// 本專案的 mock 資料是同步的,這裡刻意包一層延遲以呈現載入骨架;
// 未來接真實後端時,把 loader 換成回傳 Promise 的 API 呼叫即可,呼叫端不需改。
export function useAsyncData(loader, { delay = 450, immediate = true } = {}) {
    const data = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const run = async () => {
        loading.value = true;
        error.value = null;
        try {
            data.value = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    Promise.resolve().then(loader).then(resolve).catch(reject);
                }, delay);
            });
        } catch (e) {
            error.value = e;
        } finally {
            loading.value = false;
        }
    };

    if (immediate) run();

    return { data, loading, error, reload: run };
}
