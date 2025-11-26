# QuoteCraft

## 项目概述

QuoteCraft 是一个简洁高效的文字卡片创作工具，帮助你快速生成适合社交媒体、博客、演示等场景的精美文字卡片。提供多主题、字体、背景与布局选项。

## 技术栈

- React 19.2.0
- TypeScript 5.8.2
- Vite 6.4.1
- Tailwind CSS
- lucide-react（图标）
- clsx（类名工具）
- html-to-image（图片导出）

## 安装与启动

### 前置条件
- Node.js 18.x 或更高版本
- npm 或 yarn

### 安装流程
1. 克隆项目
   ```bash
   git clone <repository-url>
   cd QuoteCraft
   ```
2. 安装依赖
   ```bash
   npm install
   ```
3. 启动开发服务器
   ```bash
   npm run dev
   ```
4. 访问应用
   - 在浏览器打开 `http://localhost:3000`

## 使用说明

### 1. 输入内容
- 在“Message”文本框输入引用内容
- 在“Author / Attribution”文本框输入作者或署名
- 可选：勾选“Include Date”添加当前日期

### 2. 设计样式
- 选择主题（多种预设）
- 选择字体（多风格）
- 调整文字大小与对齐方式
- 自定义文本颜色
- 选择画布比例：1:1、3:4、9:16、16:9

### 3. 设置背景
- 从预设图库选择背景图
- 上传自定义图片作为背景
- 调整背景叠加层透明度以提升可读性

### 4. 导出与分享
- 点击右上角“Download”按钮导出 PNG
- 使用分享菜单复制链接或跳转社交平台

## 功能特性

- 文本编辑与署名展示
- 主题、字体、颜色与布局定制
- 背景上传与图库预设，支持叠加层
- 多画布比例以适配社交平台
- 高分辨率 PNG 导出
- 本地保存与加载配置（基于 `localStorage`）

## 配置说明

- 本项目当前版本不需要任何环境变量即可运行
- 如需自定义主题或字体：
  - 在 `tailwind.config.js` 扩展主题
  - 在 `index.html` 引入自定义字体资源

## 项目结构

```
QuoteCraft/
├── components/          # 组件
│   └── CardPreview.tsx  # 卡片预览组件
├── services/            # 服务层（预留扩展，不含 AI 集成）
├── types.ts             # TypeScript 类型定义
├── App.tsx              # 主应用组件
├── index.html           # HTML 入口
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript 配置
├── vite.config.ts       # Vite 配置
└── README.md            # 项目文档
```

## 贡献规范

### 提交代码
1. Fork 仓库
2. 创建功能分支：`git checkout -b feature/YourFeature`
3. 提交更改：`git commit -m "Add YourFeature"`
4. 推送分支：`git push origin feature/YourFeature`
5. 提交 Pull Request

### 代码要求
- 使用 TypeScript
- 遵循 ESLint / Prettier
- 为新增功能编写必要测试
- 代码简洁、清晰、可维护

## 许可证

MIT License，详见 [LICENSE](LICENSE)

---

让引用卡片创作变得简单而优雅！
