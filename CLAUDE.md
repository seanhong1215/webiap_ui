# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 指令

```bash
npm install            # 安裝相依套件
npm run serve          # 開發伺服器 http://localhost:8080（hash 路由,基底 URL 為 /#）
npm run build          # 產生正式版建構至 dist/（publicPath 為 './' 相對路徑,供靜態託管）
```

專案目前沒有單元測試(Phase 2 導入中)。截圖腳本需**先啟動開發伺服器**再執行:

```bash
node .doc/test/screenshot.js   # 將 PNG 輸出至 .doc/test/images/{user,admin}/
```

展示帳號(定義於 `src/utils/mockData.js`):`user` / `123456`(角色 `user`)、`admin` / `admin`(角色 `admin`)。

## 整體架構

FlowRing 是一套**純前端的 Vue 3(Vue CLI 4 / Webpack)作品集應用**,以企業簽核流程為情境。
**沒有後端** —— 所有資料皆來自 `src/utils/mockData.js` 的記憶體假資料。技術面是刻意精實的:
純手寫 Vue 3 SFC + Vuex + Vue Router + SCSS,不依賴任何 UI 元件庫。請記住以下貫穿全專案的重點:

- **UI 全為手寫。** 所有畫面(`src/views/` 的 10 個 view + `src/components/Layout/AppShell.vue`)
  都是手刻的原生 HTML + scoped SCSS,搭配 Font Awesome 圖示(`fal fa-*` / `fas fa-*` class),
  **沒有** Ant Design、Bootstrap、也沒有自製元件庫。要改樣式就直接改該 view 的 `<style scss>`。

- **假資料是資料的真實來源。** view 直接從 `@/utils/mockData.js` 具名匯入所需資料
  (`MOCK_CARDS`、`MOCK_CATEGORIES`、`MOCK_ADMIN_RECORDS`、`MOCK_SUBMISSIONS` 等)。
  日期基準為 **2026-06-01**;流程狀態相對「今天」計算,系統時鐘與該日期相差甚遠時狀態會漂移。

- **流程狀態是推導出來的,不會被儲存。** `src/utils/global.js` 的
  `processTypeConverter(startTime, endTime)` 依起訖日期回傳數字 `type`:
  `1` 初始(`startTime === '9999-12-31'`)、`2` 待生效(起始日在未來)、`3` 執行中(今日落在區間內)、
  `4` 已關閉(已過結束日)。使用原生 `Date`(不依賴 moment)。

- **Vuex 只保留一個 `user` 模組。** `src/store/modules/user.js` 保存 `currentUser`
  (含 `role`:`user` | `admin`),提供 `setUser` / `clearUser` mutation 與 `currentUser` / `isAdmin` getter。
  `vuex-persistedstate` 僅持久化 `user.currentUser` 至 **`sessionStorage`**(見 `src/store/index.js`),
  因此重新整理保留登入,關閉分頁則清除。Login 用 `setUser` 登入,AppShell 讀取顯示,router 守衛據此控管。

- **驗證與路由。** `src/router/index.js` 的全域守衛:未登入導向 `/login`,非管理員存取
  `meta.requiresAdmin` 路由則導向 `/dashboard`。路由使用 **hash history**(`createWebHashHistory`)。

- **View 與功能一對一對應**,位於 `src/views/`:使用者端(`Dashboard`、`FormCatalog`、`FormDetail`、
  `ApprovalCenter`、`MyRequests`)與管理員端(`AdminOverview`、`AdminProcesses`、`AdminRecords`)。

## 慣例與注意事項

- SCSS:`src/assets/scss/main.scss` 會透過 `vue.config.js`(`prependData`)**自動前置到每個元件的
  `<style scss>`**。**此檔只放 SCSS「變數」,勿放實際 CSS 規則** —— 規則會被重複輸出到每個元件。
- `main.js` 掛載執行期版本的 `vue`(非 esm-bundler),因為所有元件皆為預編譯 SFC,無執行期樣板編譯需求。
- `vue.config.js` 會將最上層的 `config/` 目錄複製到建構輸出;`config/config.js` 初始化空的 `window.__env`。
- Font Awesome 圖示字型放在 `public/static/`(gitignored,未進版控);`public/index.html` 以 `<link>` 引用。
- UI 文字與假資料皆為**繁體中文**,新增字串時請比照(專案為單一語系,無 i18n 框架)。
