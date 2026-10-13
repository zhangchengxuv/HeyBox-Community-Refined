# 06 · 安全与风险约束

## 数据与隐私
- 用户上传的网页快照可能包含头像、昵称、个人主页链接、页面加载数据等隐私或标识性信息，因此本资料包**不含原始网页保存内容**。
- `design/reference/` 两张截图可能仍显示原社区用户信息，应仅作为本地调试素材；`.gitignore` 默认排除该目录中的原始截图。
- `tests/fixtures/*.structure.html` 已移除文本、脚本、URL、动态 id、图片路径，只保留标签和 CSS class 的层级用于适配分析；不要把它们当作可运行样本。
- 如需检查原 CSS，将原来的 `社区.zip` 和 `html.zip` 放入本地 `design/raw/`，不要推送到公开 GitHub，尤其不要上传包含已登录账户信息的源码存档。
- 不采集站点 Cookie、浏览记录、Token、用户输入或账号 ID；不发送外部日志或分析事件。

## 扩展权限
- Manifest V3，只对 BBS 路径注入，最小权限原则。
- WXT 构建后的 `manifest.json` 需检查 `permissions`、`host_permissions` 和 `content_scripts.matches`。
- 禁止无必要的 webRequest、declarativeNetRequest、代理、全部站点访问、动态下载并执行脚本。

## 样式与交互
- 页面更新可能导致 CSS 类名/父子关系变化；所有选择器应集中管理，异常时不覆盖未知节点。
- 首页 `:before/:after` fixed 遮罩和 sticky 元素容易受 overflow/transform 影响；调整后重点回归。
- 帖子图集采用内联绝对布局，不能贸然用 `display:grid` 取代，尤其不能重写 image top/left/size。
- 详情的 sticky 回复栏 z-index 较高，避免修改其祖先的 transform/contain/overflow。
- 用户设置只能控制扩展自身的 class/样式。禁用功能必须可逆。

## 法律/许可边界
- 这是非官方个人增强扩展，不应暗示与小黑盒官方合作或认证。
- 不复用未获授权的品牌素材作为扩展官方 Logo；用户自有截图仅作为私下设计参考。
- 如果公开发布，先审查扩展平台规则、目标站点条款及第三方素材授权。
