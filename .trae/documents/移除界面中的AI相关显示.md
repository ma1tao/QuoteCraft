## 目标

* 从应用界面中完全移除“AI润色”“AI生成背景”等所有与 AI 相关的可视化文案和按钮，不影响非 AI 功能的正常使用。

## 将修改的文件

* `g:\my\web\QuoteCraft\App.tsx`

* `g:\my\web\QuoteCraft\i18n\locales\zh.json`

* `g:\my\web\QuoteCraft\i18n\locales\en.json`

* 可选精简：`g:\my\web\QuoteCraft\services\geminiService.ts`、`g:\my\web\QuoteCraft\vite.config.ts`、`g:\my\web\QuoteCraft\metadata.json`

## 实现步骤

1. 移除 AI 按钮与区块（App.tsx）

   * 删除“AI润色”按钮与其容器（约 `App.tsx:396-403`），同时删除未再使用的 `handlePolish` 与相关 `import`（`polishTextWithGemini`）。

   * 删除“AI生成背景”区块（约 `App.tsx:625-639`），同时删除未再使用的 `handleGenerateBg`、`getGeminiAspectRatio` 与相关 `import`（`generateBackgroundWithGemini`）。

   * 更新分享至 Twitter 的文案，去掉 `QuoteSnap AI!`（`App.tsx:312-315`），改为不含 AI 的品牌文案，例如 `QuoteCraft`。

2. 清理多语言文案（i18n）

   * 从 `zh.json` 与 `en.json` 删除以下键：`editor.polish`、`background.ai`、`background.aiFromText`、`background.aiDisabled`。

   * 确保界面不再引用上述键（第 1 步已移除对应 UI）。

3. 可选的代码与配置精简（不影响界面显示）

   * 停止在 `App.tsx` 中引入 `services/geminiService.ts`，保留文件但不再使用；如需进一步简化，可在确认后删除该文件。

   * 如需彻底去除 AI 相关痕迹：在 `vite.config.ts` 移除 `process.env.GEMINI_API_KEY` 注入；并将 `metadata.json` 的名称与描述替换为不含 AI 的文本（例如名称改为 `QuoteCraft`，描述删去 Gemini 文案）。

4. 验证

   * 启动开发环境，检查：

     * 所有页面与控件不再出现“AI润色”“AI生成背景”等字样。

     * 分享按钮的 Twitter 文案不包含 AI。

     * 控制台无未使用变量或缺失 i18n 键的报错。

     * 既有非 AI 功能（编辑、保存、下载、背景上传、预设等）正常工作。

5. 注意事项

   * 本次改动专注“去掉 AI 相关的显示”，不更改非 AI 功能逻辑。

   * 文档（README）与环境变量文件的清理为可选项，仅在您确认需要时一并处理。

