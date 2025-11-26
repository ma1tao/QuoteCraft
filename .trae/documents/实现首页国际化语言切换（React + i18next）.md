## 概览
- 在首页右上角新增语言下拉菜单（中文/English），默认中文。
- 引入 `i18next` + `react-i18next` 管理多语言资源，所有静态文案接入。
- 语言偏好存储到 `localStorage`，切换实时更新，无需刷新。
- 适配不同语言长度，保持与现有设计一致并兼顾移动端可用性。
- 增加单元测试验证默认语言、切换行为与持久化。

## 依赖与配置
- 新增依赖：`i18next`、`react-i18next`。
- 新增测试依赖：`vitest`、`@testing-library/react`、`@testing-library/jest-dom`、`jsdom`。
- 在 `vite` 测试环境启用 `jsdom`，新增 `setupTests.ts` 注册匹配器。

## 目录与文件
- `src/i18n/index.ts`：初始化 i18n、资源注册、语言持久化方法。
- `src/i18n/locales/zh.json`、`src/i18n/locales/en.json`：中英文文案。
- `src/components/LanguageSwitcher.tsx`：语言切换下拉组件。
- 修改 `index.tsx`：注入 `I18nextProvider`。
- 修改 `App.tsx`：添加切换按钮，替换所有硬编码文案为 `t()`。
- 测试：`src/__tests__/i18n.spec.tsx`。

## i18n 初始化示例
```ts
// src/i18n/index.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from './locales/zh.json'
import en from './locales/en.json'
const STORAGE_KEY = 'qs-lang'
const saved = localStorage.getItem(STORAGE_KEY)
const lng = saved || 'zh'
i18n.use(initReactI18next).init({
  resources: { zh: { common: zh }, en: { common: en } },
  lng,
  fallbackLng: 'zh',
  ns: ['common'],
  defaultNS: 'common',
  interpolation: { escapeValue: false }
})
export const setLanguage = (lang: 'zh'|'en') => {
  i18n.changeLanguage(lang)
  localStorage.setItem(STORAGE_KEY, lang)
}
export default i18n
```

## Provider 注入
```tsx
// index.tsx
import './i18n'
import i18n from './i18n'
import { I18nextProvider } from 'react-i18next'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>
)
```

## 语言切换组件
```tsx
// src/components/LanguageSwitcher.tsx
import { useTranslation } from 'react-i18next'
import { setLanguage } from '../i18n'
export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  return (
    <select aria-label="Language" value={i18n.language}
      onChange={e => setLanguage(e.target.value as 'zh'|'en')}>
      <option value="zh">中文</option>
      <option value="en">English</option>
    </select>
  )
}
```
- 在 `App.tsx` 顶部右侧加入 `<LanguageSwitcher />`，与现有 `Save/Share/Download` 并列。
- 可加入地球图标（SVG/Emoji），遵循现有样式类以保持一致。

## 文案接入与键值约定
- 单一命名空间 `common`，分层：`brand.*`、`nav.*`、`tabs.*`、`editor.*`、`design.*`、`background.*`、`preview.*`、`toast.*`、`errors.*`。
- 例：
```json
// zh.json
{
  "brand": {"title": "QuoteCraft", "watermark": "由 QuoteCraft 生成"},
  "nav": {"save": "保存", "share": "分享", "download": "下载",
           "copy": "复制链接", "twitter": "分享到 X/Twitter",
           "facebook": "分享到 Facebook", "linkedin": "分享到 LinkedIn"},
  "tabs": {"text": "文本", "design": "设计", "background": "背景"},
  "editor": {"message": "内容", "placeholder": "说点什么？",
              "polish": "AI润色", "clear": "清空"},
  "author": {"label": "作者 / 署名", "placeholder": "如：匿名", "includeDate": "包含日期"},
  "design": {"saved": "已保存配置", "base": "基础主题", "font": "字体",
              "color": "文字颜色", "size": "文字大小", "ratio": "画布比例",
              "ratio_1_1": "1:1", "ratio_3_4": "3:4", "ratio_9_16": "9:16", "ratio_16_9": "16:9"},
  "background": {"overlay": "图片叠加/暗化", "custom": "自定义背景", "upload": "点击上传图片",
                  "ai": "AI 生成", "aiFromText": "根据文本生成", "aiDisabled": "AI功能已临时取消",
                  "presets": "图库预设"},
  "preview": {"mode": "预览模式 • {{ratio}}", "empty": "开始输入以创建你的卡片..."},
  "toast": {"saved": "配置保存成功！", "loaded": "配置加载成功！", "linkCopied": "链接已复制！"},
  "errors": {"save": "保存失败，请重试。", "load": "加载失败，请重试。",
              "delete": "删除失败，请重试。", "polish": "润色失败，请检查 API Key 后重试。",
              "genBg": "背景生成失败，请检查 API Key 后重试。",
              "genBgRetry": "背景生成失败，请重试。", "download": "下载失败，请重试。",
              "copy": "复制失败，请重试。"}
}
```
- 英文 `en.json` 对应翻译一一匹配。
- 在 `App.tsx` 使用 `const { t } = useTranslation()` 并替换文案：如 `t('nav.save')`、`t('preview.mode', { ratio })`。

## 无刷新实时更新
- 通过 `i18next.changeLanguage` 驱动 `react-i18next` 触发组件重渲染，文案即时更新。
- 保持现有状态逻辑不变，避免刷新或重建组件树。

## 布局与样式适配
- 下拉菜单采用与现有按钮相同的字体、尺寸与间距。
- 使用弹性布局容器，允许英文标签更长时自动伸缩或换行。
- 移动端触控区域不少于 44px，高对比度与可访问性 `aria-label`。

## 单元测试
- `i18n.spec.tsx` 测试用例：
  - 默认显示中文：渲染 `App`，断言 `保存`、`文本` 存在。
  - 切换为英文：触发下拉选择 `English`，断言 `Save`、`Text` 实时出现。
  - 持久化：切换后断言 `localStorage('qs-lang') === 'en'`，重新挂载后仍为英文。
  - 插值文案：断言 `预览模式 • 1:1`、`Preview Mode • 1:1`。
- 配置 `vitest` 环境为 `jsdom`，使用 `@testing-library/react` 查询与交互。

## 验证要点
- 初始语言为中文，`localStorage` 没有值时回退中文。
- 所有可见静态文案均替换为 `t()`，无遗漏。
- 切换语言时页面不刷新、布局不破坏、移动端可用性良好。
- 错误提示与成功提示均正常翻译与显示。

## 交付
- 完整 i18n 接入与语言切换功能。
- 中英文翻译文件与键值约定。
- 单元测试覆盖核心行为与持久化。
- 与现有视觉风格一致且响应式的下拉菜单。