# Dark Mine Survival

Unity 6 WebGL 2 離線成品，自 Poki 平台版本離線硬化，無外部 CDN／SDK 依賴。

## 來源

- Poki 頁面：https://poki.com/zh/g/dark-mine-survival
- 遊戲 uuid：`a7eb38f9-5628-4d3b-bc29-4f19606d210a`
- 原始 build：`001bebba-21f6-4e27-bda1-f6773d9134e7`

## 執行方式

- 附 `啟動 Dark Mine Survival.bat`：在本機 `127.0.0.1:8780` 起 Python 靜態伺服器後自動開瀏覽器。
- 也可用任意靜態伺服器指向本目錄。`file://` 協議會被 WebGL 擋模組載入與 XHR，不可直接雙擊開啟。
- 瀏覽器需支援 WebGL 2（新版 Chrome / Edge / Firefox / Safari）。

## 目錄結構

| 路徑 | 內容 |
| --- | --- |
| `index.html` | 載入頁、強制橫版版面、離線平台橋接 stub |
| `Build/` | Unity framework、loader、`.wasm`、`.data` |
| `loading/` | 載入畫面圖片與背景音樂 |

## 離線說明

- 插屏廣告、獎勵廣告、分析追蹤、帳號登入皆已短路：插屏直接跳過，獎勵直接發放，不發出遠端請求。
- 排行榜、雲存檔、帳號同步等線上功能不可用；遊戲進度僅存本機瀏覽器。
- 所有圖片、音效、字型、多語素材皆隨包附帶，不連線載入。

## 殘留編譯標識（前端不可改）

`.wasm`／`.data` 內仍保留 `PokiInit`、`PokiCommercialBreak`、`PokiGameplayStart` 等橋接方法名與 `MiningSim.*` 組件名。這些是編譯進二進位的 Unity 程式碼，要更名必須改 Unity 專案原始碼；JS 層的平台物件已改名為 `OfflinePlatform`。

## 版本紀錄

| 版本 | 日期 | 說明 |
| --- | --- | --- |
| 0.1.1 | 2026-11-15 | 清理 HTML 層 Poki 命名與平台註解；頁面標題改為 Dark Mine Survival；補本 README。玩法與成品內容未變更。 |
| 0.1.0 | — | 初版離線成品（Poki 抓取並離線硬化）。 |
