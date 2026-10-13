# 04 · 工程架构与实施阶段

## 技术栈
- WXT + TypeScript + Manifest V3 + 原生 CSS；Popup 用 Vanilla JS/TS 即可。
- `chrome.storage.local` 存储设置。尽量只要求 `storage` 权限及必要主机匹配权限。不得索取 `<all_urls>`。
- CSS 静态注入和根标记须配合：建议以 `html.hcr-enabled.hcr-home` / `html.hcr-enabled.hcr-post` 分开限定；总开关关闭应移除所有标记。具体类名允许 Codex 自定但必须一致。

## 预期模块（路径为逻辑建议，以当前 WXT 实际入口约定为准）

```text
entrypoints/
  community.content.ts          # URL 识别/启动/清理
  popup/                         # Popup 页入口、开关
src/
  adapters/routes.ts             # URL pathname 判别
  adapters/selectors.ts          # 从 selector registry 抽取稳定选择器
  settings/storage.ts            # schema、默认值、storage 订阅
  features/home-layout.ts        # 首页开关与样式入口
  features/post-layout.ts        # 详情开关与样式入口
  styles/tokens.css              # 插件 token
  styles/home.css                # 首页作用域样式
  styles/post.css                # 详情作用域样式
  utils/lifecycle.ts             # 监听器管理、销毁、防重复注入
```

注：WXT 版本可能影响静态 CSS 入口、内容脚本上下文、`defineContentScript`、Popup 打包方式；以已安装版本的官方类型与构建输出为准。

## 站点路由识别

- 首页：`location.pathname` 精确匹配 `/app/bbs/home`（允许末尾斜杠），查询参数不应破坏匹配。
- 帖子：从首页真实链接发现 `/app/bbs/link/<数字ID>`，可以按 `^/app/bbs/link/\d+/?$` 初步识别。遇到其他形态的帖子需增加**实测证据**后再扩展。
- 其他页面：`none`，清理所有与当前页面不符的插件状态类。
- 主机名：已证实 `xiaoheihe.cn`；可以在 WXT 匹配中额外支持 `www.xiaoheihe.cn`，但不能声称实际出现过该主机名。

## 状态方案

初始状态建议：

```json
{ "enabled": true, "homeEnabled": true, "postEnabled": true }
```

Popup 开关变更 → `chrome.storage.local` 更新 → 已打开页面收到 storage 更新事件 → 扩展重新计算页面类别与启用状态 → 添加/删除根 class。避免“关闭后还需手动刷新才恢复”的情况。根据本地实际 WXT 安装版本，选择已确认可用的消息/Storage API。

## 实施顺序
- M0：建立 WXT 工程 + 类型校验 + 构建命令 + Popup + 默认设置 + URL 路由识别 + 生命周期管理。验收：插件可加载，关闭后原样。
- M1：首页布局：限制作用域；桌面容器/主列最大宽度/右栏宽度、卡片和文字、分类条/搜索吸附检查。图片先保留原位。
- M2：详情布局：容器宽度/正文 max-width/侧栏/评论层次，保护原回复栏。
- M3：跨路由、滚动、登录态、异常内容、缩放与分辨率回归；更新 README、CHANGELOG。
- M4（以后）：紧凑浏览模式、暗色主题、字号和侧栏开关，且每项有独立开关及回退。

## 技术细节
- 首选纯 CSS + 根 class，不为简单宽度改造加 MutationObserver。
- 如果 SPA 导航不重新注入 content script，应使用经当前版本验证的路由变化监听或安全的 history/Navigation 生命周期方案；注册与释放成对。
- 如果页面容器异步加载，采用有限重试或目标局部观察，避免观察整个 document 并无限修改。
- 测试选择器失效时不应主动篡改未知新结构；记录 diagnostic log 但不包含用户页面内容或 token。
- `.list` 在首页有 `max-width:660px`，在详情页只有 `width:0;flex:1`，CSS 不可简单共用同一规则。
- 不改变应用自身滚动父节点 `overflow-y:auto` 和首页 fixed/sticky 遮罩的交互语义。
