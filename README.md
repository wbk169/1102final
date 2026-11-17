# PF. DIOR｜香氛電子商務網站（前端作品）

大學分組課程製作的香氛網站，後續持續整理前端互動功能、導覽、響應式版面與自動化測試。

## 線上作品
https://wbk169.github.io/1102final/

## 功能
- 12 款商品的展示、詳細介紹與圖像瀏覽
- 依商品名稱搜尋
- 收藏商品、移除收藏
- 購物車新增、數量修改、移除與合計金額
- 桌機、手機共用導覽列
- 會員與後台資料編輯介面

## 使用技術
- HTML、CSS、原生 JavaScript
- Bootstrap（部分舊版頁面）
- `localStorage` 保存瀏覽器端購物車和收藏資料
- GitHub Pages 部署
- GitHub Actions + Node.js 基礎自動化檢查

## 專案架構
- `index.html`：首頁
- `product1.html` 至 `product12.html`：商品詳細頁
- `search.html`：搜尋
- `favorites.html`：收藏
- `cart.html`：購物車
- `script/shop-demo.js`：商品清單與購物車／收藏邏輯
- `script/site-nav.js`、`css/site-nav.css`：全站共用導覽
- `tests/smoke-test.cjs`：主要功能與程式結構測試

## 本機使用
用瀏覽器開啟 `index.html`，或使用本機靜態網站伺服器啟動專案。部分瀏覽器對 `file://` 開啟的資料儲存權限可能有限制。

## 執行測試
需要 Node.js：

```bash
node tests/smoke-test.cjs
```

## 系統範圍
目前搜尋、收藏及購物車使用前端商品清單和瀏覽器儲存，不包含資料庫、後端身分驗證、訂單儲存或金流服務。會員與後台頁面屬於前端介面操作。

## 專案分工
原始作品為課程團隊合作成果。前端網頁設計為本人參與部分；資料庫由其他組員負責。後續維護內容可透過 GitHub 提交紀錄追蹤。

## 品牌與圖片
本作品非 Dior 官方網站。專案中的名稱、商標及圖片僅供原有作品展示；相關權利屬原權利人。若用於正式商業網站，需另外處理素材授權。
