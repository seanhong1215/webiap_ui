# FlowRing 作品集 — 企業級改善路線圖

## Context(背景)

使用者想確認這個 Vue 3 前端作品(FlowRing 企業智慧簽核平台)是否達到「企業級面試作品」水準,目標職級為**全端**,並要求一份**評估 + 可分階段執行的改善路線圖**(本次先不動程式碼)。

現況評估:專案展現扎實的 Vue 架構直覺(分層清楚、Vuex 命名空間模組、路由角色守衛、可抽換的 API 抽象層、自製元件庫 + Ant Design 相容層、i18n 實際使用、真實領域邏輯 `processTypeConverter`、雙語 README + 使用手冊),**明顯高於 bootcamp 等級**;但尚未達企業標準,且有一個必須優先處理的機密外洩問題。以全端職缺而言,本專案目前只呈現「前端 + mock data」單一面向,缺少後端/API/DB/部署等全端證據。

---

## 評分現況(對照企業標準)

| 面向 | 現況 | 等級 |
|------|------|------|
| 架構分層 / 狀態管理 | views/store/components/utils 清楚;Vuex 命名空間 + 持久化 | ✅ 良好 |
| 領域建模 | `processTypeConverter` 依起訖日推導流程狀態(1~4) | ✅ 亮點 |
| API 抽象層 | `src/utils/api.js` 可抽換 mock/真實 HTTP | ✅ 好設計(但含大量 dead code) |
| Git 歷史 / provenance | ⚠️ **公開 repo 殘留前公司內部分支與 commit** | 🔴 嚴重 |
| 自動化測試 | ❌ 僅一支截圖腳本,無單元/元件/e2e | 🔴 缺 |
| Lint / 格式化 / hooks | ❌ 無 ESLint / Prettier / husky | 🔴 缺 |
| CI/CD | ❌ 無 GitHub Actions | 🔴 缺 |
| TypeScript | ❌ 全 JS,無型別 | ⚠️ 缺 |
| 全端證據(後端/DB/部署) | ❌ 純前端 + mock,無 live demo | 🔴 全端職缺關鍵缺口 |
| 程式碼衛生 | ⚠️ 49 處 console.log;假相依 `"package.json"`;jquery/bootstrap 全域載入但 0 使用;根目錄 verify-*.png | ⚠️ |
| 建構設定 | ⚠️ Vue esm-bundler 執行期編譯,production 不理想 | ⚠️ |
| commit 敘事 | ⚠️ master 僅 2 個 commit | ⚠️ |

---

## 改善路線圖(分階段)

### Phase 0 — 🔴 最優先:清理 provenance 與機密外洩
> 這是面試 red flag 也是法務風險,必須先做。
- 以**全新乾淨歷史**重啟 repo:`git checkout --orphan` 或建新 repo,只保留單一 squash commit(或重寫成合理的開發歷程 commit)。
- 移除所有內部分支:`AF-8203`、`release/v1.0.0`、`qts/v1.0.0/build/01~05`、`bugfix/v1.0.0`、`dev`、`stale/*` 等,並刪掉遠端對應分支。
- 全域搜尋並清除內部字樣:`gitlab.flowring.com`、內部 ticket 代號、產品內部代稱(如「智雲版」)於 commit 訊息、README、`.doc/`、原始碼註解。
- 檢查 `.doc/` 手冊與截圖是否含內部資訊。
- 重新 `git remote set-url` 指向新的乾淨 repo。
- 關鍵檔案:`.git/`(歷史)、`README.md`、`.doc/01-user-manual.md`、`.doc/02-admin-manual.md`。

### Phase 1 — 工程化基線(投報率最高)
- 加入 **ESLint(eslint-plugin-vue)+ Prettier**,設定 `lint` script;加 `.editorconfig`。
- 加入 **husky + lint-staged** pre-commit(lint + format)。
- 清程式碼衛生:
  - 移除 src 內 49 處 `console.log`(保留必要者改用可控 logger)。
  - 移除 `package.json` 中的假相依 `"package.json": "^2.0.1"`,以及未使用的 `jquery`、`bootstrap`、`popper.js`(main.js 全域載入但 src 內 0 使用)、確認 `vuex-map-fields`、`vuedraggable`、`axios` 是否仍需。
  - 刪除根目錄 `verify-*.png` 除錯截圖(移入 `.doc/` 或刪除)。
  - 精簡 `src/utils/api.js` 的 noop dead code,只保留實際使用的 `api*`。
- 建構:改用 SFC 預編譯,移除 `main.js` 對 `vue/dist/vue.esm-bundler.js` 的依賴(除非有執行期編譯需求)。

### Phase 2 — 自動化測試 + CI
- 導入 **Vitest + @vue/test-utils**:
  - 單元測試:`src/utils/global.js` 的 `processTypeConverter`(4 種狀態邊界)、`statusMap`、Vuex getters(`process.js` 的篩選/狀態統計)。
  - 元件測試:`Login.vue`(帳密驗證)、路由守衛(`router/index.js` 角色隔離)。
- **Playwright e2e**:把現有截圖腳本升級為斷言式 e2e(user/admin 登入 → 各主要頁面流程)。
- **GitHub Actions**:PR 觸發 `lint → test → build` 三段。
- 關鍵檔案:新增 `vitest.config.js`、`tests/`、`.github/workflows/ci.yml`。

### Phase 3 — 補齊「全端」面向(針對全端職缺,關鍵)
> 目前只有前端 + mock,全端面試官會想看後端/API/DB/部署。擇一:
- **方案 A(推薦,展現全端):** 加一層真實輕量後端(Node + Express 或 NestJS),提供 REST API + JWT 驗證,資料落地到 SQLite/PostgreSQL,把 `src/utils/api.js` 的 mock 換成真實 `axios` 呼叫(抽象層已就位,改動集中)。撰寫 API 文件(OpenAPI/README)。
- **方案 B(較省力):** 明確定位為「前端作品」,以 mock server(json-server / MSW)呈現,並於 README 誠實框定範圍;另補其他全端專案佐證後端能力。
- 選配:漸進式 **TypeScript** 遷移(先 `jsconfig`→`tsconfig`,新檔用 TS,或型別化 store 與 api 層)。

### Phase 4 — 打磨與敘事
- 拆分過大的 view:`AdminProcesses.vue`(814 行)、`AdminRecords.vue`(659 行)、`ApprovalCenter.vue`(503 行)抽出子元件 / composables。
- 補齊 loading / empty / error 三態與全域錯誤處理慣例。
- 基本無障礙(a11y):語意標籤、鍵盤操作、對比。
- **部署 live demo**(Vercel / Netlify / GitHub Pages),README 置頂放線上連結。
- README 增補:架構圖、技術決策(為何自製元件庫 + Ant 相容層)、螢幕錄影/截圖、已知限制。

---

## 驗證方式(改造後如何檢驗)
- `npm run lint` 零錯誤;pre-commit 能擋下未格式化的 commit。
- `npm run test` 綠燈,涵蓋 `processTypeConverter` 四狀態與路由守衛。
- `npx playwright test` user/admin 兩條 e2e 流程通過。
- GitHub Actions 於 PR 上三段全綠。
- `git log --all` 與 `git branch -a` **不再出現**任何內部代號/分支。
- (方案 A)前端串真實後端可完成登入 → 送申請 → 審核全流程;live demo 連結可開啟。

---

## 一句話總評
架構直覺與領域建模是亮點、值得保留;但要成為「企業級全端作品」,**第一步必須清乾淨 git provenance**,接著補上測試/lint/CI 這組工程化基線,最後為全端職缺補一層真實後端與 live demo。前三個 🔴 項目補齊後,即可從「不錯的前端練習」升級為「能過企業初篩的作品」。
