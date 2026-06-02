# IAP Flow — 智慧工作流程管理平台

> 個人作品集展示版本 · Personal Portfolio Project

## 簡介

IAP Flow 是一套以 **Vue 3** 建構的工作流程管理系統前端。本專案展示以下核心技術能力：

- **狀態機設計**：視覺化條件設定介面，支援多狀態流程轉換規則
- **大型列表管理**：流程卡片 / 列表雙視圖、多欄位篩選與分頁
- **版本控制 UI**：流程版本歷史追蹤與版本切換

> 本版本為**前端展示用途**，使用 Mock Data 模擬後端資料，無需任何後端服務即可完整體驗。

---

## 功能展示

| 功能模組 | 說明 |
|---------|------|
| **流程清單管理** | 狀態卡片統計、卡片/列表雙視圖、關鍵字與進階搜尋 |
| **條件設定（狀態機）** | 視覺化條件規則編輯、拖拉排序、儲存與發布 |
| **版本控制** | 版本歷史表格、版本對比、另存新版 |

---

## 技術棧

- **Frontend**: Vue 3 + Vuex 4 + Vue Router 4
- **UI Library**: Ant Design Vue 2 + 自製 Flowring UI 元件庫
- **Build Tool**: Vue CLI 4 + Webpack
- **Styling**: SCSS + Bootstrap 4
- **State**: Vuex with session persistence

---

## 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run serve

# 開啟瀏覽器訪問
http://localhost:8080
```

登入頁輸入**任意帳號密碼**即可進入系統。

---

## 專案結構

```
src/
├── components/
│   ├── Basic/              # 自製基礎 UI 元件（FlButton, FlTable 等）
│   ├── Basic2/             # 新版 Flowring UI 元件
│   ├── Common/             # 共用業務元件
│   ├── ConditionSetting/   # 條件設定相關元件
│   └── ProcessListManagement/ # 流程清單元件
├── store/modules/
│   ├── process.js          # 流程狀態管理
│   └── condition.js        # 條件狀態管理
├── utils/
│   ├── mockData.js         # Mock 資料層（8個流程、4種狀態）
│   └── api.js              # API 抽象層（Mock 模式）
└── views/                  # 頁面元件
```

---

## Mock 資料設計

系統預設載入 **8 個示範流程**，涵蓋常見企業場景：

| 類別 | 流程 | 狀態 |
|------|------|------|
| 人事管理 | 請假申請流程 | 執行中 |
| 人事管理 | 加班申請流程 | 上線中 |
| 財務管理 | 費用報銷申請 | 執行中 |
| 財務管理 | 採購申請流程 | 初始 |
| 行政管理 | 會議室申請流程 | 執行中 |
| 行政管理 | 車輛申請流程 | 關閉 |
| 資產管理 | 資源借用申請 | 執行中 |
| 資產管理 | 設備維修申請 | 關閉 |

---

## License

MIT
