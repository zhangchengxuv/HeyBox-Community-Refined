# Agent instructions — HeyBox Community Refined

## 必须先读
- `README.md`
- `docs/01_HOME_DOM.md` 和 `docs/02_POST_DOM.md`
- `docs/03_DESIGN_SPEC.md`、`docs/04_IMPLEMENTATION.md`
- `tests/fixtures/selectors.json`

## 开发准则（MUST）
1. 以 WXT、TypeScript、Manifest V3、原生 CSS 为默认选型。先检查本地 WXT 模板/版本再生成入口；不要假设特定 API 在当前版本始终存在。
2. 内容脚本作用于小黑盒 BBS 已识别路由：首页 `/app/bbs/home` 和详情 `/app/bbs/link/<数字ID>`。未知 BBS 路由禁用增强；域名以 `xiaoheihe.cn` 为准，`www` 是否真实使用须验证。
3. CSS 根作用域使用扩展启用 class（建议 `html.hcr-enabled`）并分别绑定 `#page-bbs-community` / `#page-bbs-link`。禁用时移除 class、监听器、扩展插入物；不得破坏原 DOM。
4. 不对原站的点击/点赞/回复/分享/关注/发布进行重实现、拦截或自动触发。不替换原始交互节点，不克隆出独立操作区。
5. 不依赖 `data-v-*`、构建后的 CSS/JS 哈希、动态 Element Plus id、真实用户 ID、帖子 ID 数值、头像 URL、保存网页生成的本地文件路径。
6. 优先 CSS；确实需要 JS 时做到幂等、可撤销、监听器清理。避免无限 MutationObserver 与布局抖动。
7. 保护首页搜索栏 sticky、首页左右栏 sticky 和遮罩伪元素，以及详情页 sticky 回复栏；媒体图集采用绝对定位和内联尺寸，不要强制覆盖其内部坐标。
8. 不读取 Cookie、Token 或 localStorage 中的站点凭证，不使用后台网络代理、远程脚本或遥测。仅保存扩展设置到 `chrome.storage.local`。
9. 样式默认保留网站品牌与可读性。首轮不实施激进页面重构、独立三栏左导航或全站 dark mode；不要将建议尺寸当成现有站点事实。
10. 每次改动均输出：影响页面/选择器、操作原因、构建结果、浏览器手测结果、未测风险。禁止未经实测声称所有交互已通过。

## 工作步骤
- 先核对离线证据与线上待验证内容，并汇报计划。
- 先做最小项目 + 关闭/恢复逻辑 + 页面识别，然后分别写首页和详情页增强。
- 每一页按 1200、1280、1440、1720px 做浏览器检查；低于 1080px 基本尊重原站布局。
- 执行项目现有 typecheck、lint、build；没有相应脚本则解释并补齐合理的替代验证。
- 严格遵守 `docs/05_ACCEPTANCE_TESTS.md` 验收单。

## 停止条件
如缺少浏览器或只能分析本交接包：可以实现最小项目和静态校验，**但必须明确交互与线上兼容性未实测**。需要实时 DOM 数据时提出明确的最小补充要求，不能猜测。
