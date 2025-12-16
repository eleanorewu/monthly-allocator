# GitHub Pages 部署說明

## 前置準備

1. 確保您的專案已經推送到 GitHub 倉庫
2. 確認您的倉庫名稱（例如：`monthly-allocator`）

## 部署步驟

### 方法一：使用 GitHub Actions（推薦）

1. **啟用 GitHub Pages**
   - 前往您的 GitHub 倉庫
   - 點擊 `Settings` > `Pages`
   - 在 `Source` 選擇 `GitHub Actions`
   - 儲存設定

2. **更新倉庫名稱（如果需要）**
   - 如果您的倉庫名稱不是 `monthly-allocator`，請修改 `vite.config.ts` 中的 `base` 路徑：
   ```typescript
   const base = process.env.GITHUB_PAGES === 'true' ? '/您的倉庫名稱/' : '/';
   ```

3. **推送代碼**
   - 將代碼推送到 `main` 分支（或您的預設分支）
   - GitHub Actions 會自動構建和部署

4. **查看部署狀態**
   - 前往 `Actions` 標籤頁查看部署進度
   - 部署完成後，您的網站將在以下網址可用：
     - `https://您的用戶名.github.io/您的倉庫名稱/`
     - 例如：`https://username.github.io/monthly-allocator/`

### 方法二：手動部署

1. **構建專案**
   ```bash
   npm run build
   ```

2. **啟用 GitHub Pages**
   - 前往 `Settings` > `Pages`
   - 在 `Source` 選擇 `Deploy from a branch`
   - 選擇 `main` 分支和 `/dist` 資料夾
   - 儲存設定

3. **推送 dist 資料夾到 gh-pages 分支（可選）**
   ```bash
   npm install -g gh-pages
   gh-pages -d dist
   ```

## 重要注意事項

1. **Base Path 設定**
   - 如果您的倉庫名稱是 `username.github.io`（個人或組織主頁），則 `base` 應該設為 `/`
   - 如果是專案頁面，則 `base` 應該是 `/倉庫名稱/`

2. **自定義域名**
   - 如果您使用自定義域名，請將 `base` 設為 `/`
   - 在 `Settings` > `Pages` > `Custom domain` 中設定您的域名

3. **分支名稱**
   - 如果您的預設分支是 `master` 而不是 `main`，請修改 `.github/workflows/deploy.yml` 中的分支名稱

## 故障排除

- **404 錯誤**：檢查 `vite.config.ts` 中的 `base` 路徑是否正確
- **資源載入失敗**：確認所有資源路徑都使用相對路徑
- **部署失敗**：檢查 GitHub Actions 的日誌以查看錯誤訊息

## 更新網站

每次您推送代碼到 `main` 分支時，GitHub Actions 會自動重新構建和部署您的網站。

