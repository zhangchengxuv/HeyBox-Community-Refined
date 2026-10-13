# HeyBox Community Refined — Codex 开发交接包

> 版本：2026-10-13 · 资料状态：**双页面离线 DOM 已分析；扩展尚未实现，也未在 Edge 实机验证。**

目标：为 `https://xiaoheihe.cn/app/bbs/home` 及 `/app/bbs/link/<帖子ID>` 开发一个 Edge/Chrome MV3 浏览器扩展，以**不破坏原生交互**为原则，改善小黑盒桌面端社区的信息流、阅读与评论体验。

## 立即开始（推荐）

1. 将本资料包整体解压到准备开发的项目目录，例如 `heybox-community-refined/`；使用 VS Code 打开。
2. 打开 Codex，复制根目录 `PROMPT_FOR_CODEX.md` 的正文作为首个任务。
3. Codex 应先读 `AGENTS.md`、`docs/01_HOME_DOM.md`、`docs/02_POST_DOM.md`、`docs/03_DESIGN_SPEC.md`、`tests/fixtures/selectors.json`，再初始化 WXT + TypeScript 项目。
4. 第一轮只实现 v0.1：**首页 + 详情页布局增强、插件开关、路由识别**，可运行/可构建；功能开关可撤销所有插件修改。
5. 打包目录由实际的 WXT 配置与构建日志确定，在 `edge://extensions` 的开发者模式里“加载解压缩的扩展”。不要盲目假设构建目录。

此 ZIP 为**开发交接包，不是已经编写并可安装的浏览器扩展**。Codex 仍需创建源代码并构建。

## 文件导航

| 文件 | 用途 |
|---|---|
| `AGENTS.md` | Codex 工作规则、职责边界和停止条件 |
| `PROMPT_FOR_CODEX.md` | 可直接复制给 Codex 的总任务 |
| `docs/00_OVERVIEW.md` | 功能范围、证据层级、优先顺序 |
| `docs/01_HOME_DOM.md` | 已核实社区首页 DOM + 重要原站 CSS |
| `docs/02_POST_DOM.md` | 已核实帖子详情 DOM + 重要原站 CSS |
| `docs/03_DESIGN_SPEC.md` | 布局/视觉/响应式设计规范 |
| `docs/04_IMPLEMENTATION.md` | 技术架构和阶段拆分 |
| `docs/05_ACCEPTANCE_TESTS.md` | 验收、回归测试和问题反馈模板 |
| `docs/06_SECURITY_AND_RISKS.md` | 用户隐私、稳定性、发布风险 |
| `docs/07_DECISION_LOG.md` | 已确认事实与未验证事项 |
| `tests/fixtures/selectors.json` | 选择器清单、来源 SHA256、离线命中计数 |
| `tests/fixtures/home.structure.html` | 去文本/图片/URL 的首页 DOM 层级样本 |
| `tests/fixtures/post.structure.html` | 去文本/图片/URL 的详情页 DOM 层级样本 |
| `scripts/verify_dom.py` | 验证原始压缩包和选择器计数的可选脚本 |
| `design/reference/*.png` | 用户提供的两个原始界面截图（本地参考） |

## 原始证据说明

- 用户上传 `社区.zip`：首页 HTML 和其网页保存资源。
- 用户上传 `html.zip`：帖子详情 HTML 和其网页保存资源。
- **为了降低误上传私人资料的风险，本交接包没有重新打包原始网页 HTML/JS/CSS、原始图片和账户信息**。替代品是去标识化的 `fixtures/*.structure.html`、选择器证据和截图。
- 如 Codex 需要检查具体原站 CSS，可在本地把原始压缩包放到 `design/raw/`（被 `.gitignore` 排除），参照 `tools/verify_dom.py` 验证；不要提交到公开 GitHub。

## 关键事实

- 首页根节点 `#page-bbs-community`；详情页根节点 `#page-bbs-link`。
- 首页及详情页原站最大页面宽度约 1032px，右栏 356px；首页主栏另外设置 `max-width:660px`。
- 首页快照包含 20 个帖子卡片、12 个顶部社区按钮；详情页快照有 20 个评论节点（仅为本次截取样本）。
- 原站在 `max-width:1080px` 时隐藏右侧栏。
- 帖子图集通过带内联几何尺寸的绝对定位容器实现；不要强行统一改成简单网格。
- 原始文件属于**离线、某一时刻的已渲染快照**，不等于当前线上 DOM 永久稳定。

## 验收目标

Codex 需要交付可在 Edge 加载的 MV3 扩展源码、构建结果、设置入口、README、变更日志和测试记录。测试记录必须区分自动验证、浏览器实测和未验证事项。详见 `docs/05_ACCEPTANCE_TESTS.md`。
