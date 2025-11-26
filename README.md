# QuoteCraft

## 项目概述

QuoteCraft是一个强大的引用卡片创作工具，允许用户轻松创建精美的引用卡片，用于社交媒体分享、博客文章、演示文稿等场景。项目提供了丰富的设计选项，包括多种主题、字体、背景和布局，帮助用户快速生成专业级别的引用卡片。

## 技术栈

- **前端框架**: React 19.2.0
- **开发语言**: TypeScript 5.8.2
- **构建工具**: Vite 6.4.1
- **样式方案**: Tailwind CSS
- **图标库**: lucide-react
- **类名工具**: clsx
- **图片导出**: html-to-image
- **AI集成**: Google Gemini API (可选)

## 安装步骤

### 前置条件
- Node.js 18.x 或更高版本
- npm 或 yarn 包管理器

### 安装流程

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd quotesnap-ai
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量** (可选，用于AI功能)
   ```bash
   # 编辑.env.local文件，设置GEMINI_API_KEY
   # 使用文本编辑器打开.env.local文件，将PLACEHOLDER_API_KEY替换为实际的API密钥
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   打开浏览器访问: http://localhost:3000

## 使用方法

### 创建引用卡片

1. **输入内容**
   - 在"Message"文本框中输入引用内容
   - 在"Author / Attribution"文本框中输入作者信息
   - 可选：勾选"Include Date"添加当前日期

2. **设计样式**
   - 选择主题：从多种预设主题中选择
   - 选择字体：8种不同风格的字体可供选择
   - 调整字体大小和对齐方式
   - 自定义文本颜色
   - 选择画布比例：1:1、3:4、9:16、16:9

3. **设置背景**
   - 从预设背景中选择
   - 上传自定义背景图片
   - 调整背景叠加层透明度

4. **导出卡片**
   - 点击右上角的"Download"按钮
   - 卡片将以PNG格式下载到本地

## 功能说明

### 核心功能

- **文本编辑**: 支持自定义引用内容和作者信息
- **样式定制**: 多种主题、字体和颜色选项
- **背景管理**: 预设背景、自定义上传和叠加层调整
- **响应式设计**: 支持多种画布比例
- **高质量导出**: 高分辨率PNG图片导出

### AI功能 (可选)

- **文本润色**: 使用AI优化引用内容，使其更适合卡片展示
- **背景生成**: 根据引用内容生成匹配的背景图像

## 配置指南

### 环境变量

| 变量名 | 描述 | 可选/必填 | 默认值 |
|--------|------|-----------|--------|
| VITE_GEMINI_API_KEY | Google Gemini API密钥 | 可选 | 无 |

### 自定义配置

- **主题扩展**: 在`tailwind.config.js`中添加自定义主题
- **字体扩展**: 在`index.html`中添加自定义字体
- **样式调整**: 修改`index.html`中的CSS样式

## 项目结构

```
quotecraft/
├── components/          # React组件
│   └── CardPreview.tsx  # 卡片预览组件
├── services/            # 服务层
│   └── geminiService.ts # AI服务调用（可选）
├── types.ts             # TypeScript类型定义
├── App.tsx              # 主应用组件
├── index.html           # HTML入口文件
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript配置
├── vite.config.ts       # Vite配置
└── README.md            # 项目文档
```

## 贡献规范

### 提交代码

1. Fork项目仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

### 代码规范

- 使用TypeScript编写代码
- 遵循ESLint和Prettier配置
- 为新功能添加测试
- 保持代码简洁明了
- 编写清晰的注释

## 许可证信息

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目维护者: [Your Name]
- 项目仓库: [Repository URL]
- 问题反馈: [Issues Page]

## 致谢

感谢所有为项目做出贡献的开发者和用户！

---

**QuoteCraft** - 让引用卡片创作变得简单而优雅！
