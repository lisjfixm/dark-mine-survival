# Dark Mine Survival

Unity 6 WebGL 2 離線成品，自 Poki 平台版本離線硬化，無外部 CDN／SDK 依賴。

- 線上版（GitHub Pages）：https://lisjfixm.github.io/dark-mine-survival/

## 來源

- Poki 頁面：https://poki.com/zh/g/dark-mine-survival
- 遊戲 uuid：`a7eb38f9-5628-4d3b-bc29-4f19606d210a`
- 原始 build：`001bebba-21f6-4e27-bda1-f6773d9134e7`

## 執行方式

- 線上版由 GitHub Pages 部署，來源為 `main` 分支根目錄；推送 main 後自動更新。
- 附 `啟動 Dark Mine Survival.bat`：在本機 `127.0.0.1:8780` 起 Python 靜態伺服器後自動開瀏覽器。
- 也可用任意靜態伺服器指向本目錄。`file://` 協議會被 WebGL 擋模組載入與 XHR，不可直接雙擊開啟。
- 瀏覽器需支援 WebGL 2（新版 Chrome / Edge / Firefox / Safari）。

## 目錄結構

| 路徑 | 內容 |
| --- | --- |
| `index.html` | 載入頁、強制橫版版面、離線平台橋接 stub、外殼繁中文字、功能列開關 |
| `auto.js` | 實驗性粗糙自動遊玩腳本（預設關閉，本機保存開關狀態） |
| `zh-overlay.js` | 中文 overlay 覆蓋層：HUD 繁中標籤＋詞彙對照面板（預設關閉，本機保存） |
| `Build/` | Unity framework、loader、`.wasm`、`.data` |
| `loading/` | 載入畫面圖片與背景音樂 |

## 離線說明

- 插屏廣告、獎勵廣告、分析追蹤、帳號登入皆已短路：插屏直接跳過，獎勵直接發放，不發出遠端請求。
- 排行榜、雲存檔、帳號同步等線上功能不可用；遊戲進度僅存本機瀏覽器。
- 所有圖片、音效、字型、多語素材皆隨包附帶，不連線載入。

## 殘留編譯標識（前端不可改）

`.wasm`／`.data` 內仍保留 `PokiInit`、`PokiCommercialBreak`、`PokiGameplayStart` 等橋接方法名與 `MiningSim.*` 組件名。這些是編譯進二進位的 Unity 程式碼，要更名必須改 Unity 專案原始碼；JS 層的平台物件已改名為 `OfflinePlatform`。

## 語言與自動遊玩現況

- HTML 外殼繁中化（分頁標題、載入與錯誤提示、載入文字）。遊戲內 HUD、選單、任務與對話原文仍編譯在 `.wasm`／`.data`，成品內無 CJK 字型，無 Unity 原始碼無法做引擎內本地化。
- `zh-overlay.js` 是不改二進位的中文覆蓋層：以系統字型在已知 HUD 區域貼繁中標籤，另提供「詞彙對照」面板查閱提取到的英文文本與繁中翻譯。標籤座標為 1280×720 邏輯框架估計值，需實機校準；overlay 為並存覆蓋，不會移除畫面上的英文，動態 3D 世界標記無法對準。預設關閉，右上角按鈕切換，狀態本機保存。
- `auto.js` 是瀏覽器層盲打腳本：合成觸控／滑鼠事件操作虛擬搖桿與操作區，讀不到血量、背包、目標等內部狀態，**不是智能 bot**，可能原地卡住；預設關閉，右上角按鈕切換。

### 成品勘查摘要（唯讀，未改二進位）

- IL2CPP → WebAssembly，wasm 無 custom name section，函式名已剝離；`.data` 仍保留 `MiningSim.*` 命名空間、型別與部分屬性／方法／欄位名。
- 字型僅 `Arimo` 與 `LegacyRuntime.ttf`，無 CJK 字形；JS→C# 僅標準 `SendMessage`，無狀態讀取介面。
- 引擎內全中文與智能 bot 受阻於無原始碼、無 CJK 字型、無狀態讀取通道；詳細勘查紀錄見內部備忘，不在倉庫內。

## 版本紀錄

| 版本 | 日期 | 說明 |
| --- | --- | --- |
| 0.1.3 | 2026-11-17 | 唯讀 metadata 勘查後新增 `zh-overlay.js` 中文覆蓋層：HUD 繁中標籤（估計座標，需實機校準）＋詞彙對照面板，預設關閉、本機保存；不改 wasm/data。遊戲內英文原文仍保留；無 Unity 原始碼，未做引擎內本地化或智能 bot。 |
| 0.1.2 | 2026-11-17 | 外殼繁中化（分頁標題、載入與錯誤提示、載入文字）；新增實驗性粗糙自動遊玩腳本 `auto.js`（右上角開關，預設關閉，本機保存）。遊戲內文本仍為英文；無 Unity 原始碼，未做引擎內本地化或智能 bot。 |
| 0.1.1 | 2026-11-15 | 清理 HTML 層 Poki 命名與平台註解；頁面標題改為 Dark Mine Survival；啟用 GitHub Pages 線上版（main 根目錄）；補本 README。玩法與成品內容未變更。 |
| 0.1.0 | — | 初版離線成品（Poki 抓取並離線硬化）。 |
