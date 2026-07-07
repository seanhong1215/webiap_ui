# 圖示字型子集(Tabler Icons)

本專案的圖示採 [Tabler Icons](https://tabler.io/icons)(MIT),但**不**載入完整字型
(4,962 個圖示、多格式共約 6 MB)。改為只子集化實際使用的 61 個圖示,產出約 11 KB 的 woff2。

產物(皆已進版控,執行期自給自足,不需 `@tabler/icons-webfont`):

- `src/assets/fonts/tabler-icons-subset.woff2` — 子集字型(僅 61 字符)
- `src/assets/fonts/tabler-subset.css` — `@font-face` + 61 個 `.ti-*` class

`src/main.js` 只 import 上述 css。

## 何時需要重新產生

新增/更換圖示時。步驟:

1. 安裝來源套件與子集工具:

   ```bash
   npm i -D @tabler/icons-webfont@2   # 圖示來源(僅開發用)
   pip install fonttools brotli       # 子集工具
   ```

2. 更新使用清單:編輯 `scripts/gen-icon-subset.js` 內的 `USED` 陣列
   (值為 Tabler 圖示名稱,可在 https://tabler.io/icons 查),然後:

   ```bash
   node scripts/gen-icon-subset.js unicodes.txt   # 產生 tabler-subset.css 與 unicodes 清單
   python -m fontTools.subset node_modules/@tabler/icons-webfont/fonts/tabler-icons.ttf \
       --unicodes-file=unicodes.txt --drop-tables+=GSUB,GPOS,GDEF \
       --flavor=woff2 --output-file=src/assets/fonts/tabler-icons-subset.woff2
   ```

   > `--drop-tables+=GSUB,GPOS,GDEF`:略過字型的連字(ligature)表。本專案以 `content:`
   > codepoint 對應圖示,不使用文字連字,且該表在 fontTools 有解析相容性問題。

3. `npm run build` 確認圖示正常。
