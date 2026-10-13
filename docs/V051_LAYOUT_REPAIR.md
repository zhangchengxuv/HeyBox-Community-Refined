# v0.5.1 布局修复验证

## 根因

1. 原站直接父级 `#app > main` 的最终计算值仍为 `max-width: 1300px`。v0.5 只扩大 `#page-bbs-community` / `#page-bbs-link`，而页面根的百分比宽度仍以该父级为基准，因此首页实际只有约 1236px。
2. v0.5 给 `button.bbs-home__topic-item` 设置了 `display:flex`，但没有覆盖原站 `flex-direction:column`。最终计算样式仍是 column，造成图标在上、文字在下以及 64px 高的条目。
3. `home.css`、`post.css`、`v04.css` 和 `v05.css` 同时包含页面根、列宽和 Dock 规则，后续修改很难判断真正命中的规则。v0.5.1 将结构规则集中到 `v05.css`，其余文件只保留页面视觉或控件样式。

## Edge 实测

测试环境：独立 Microsoft Edge Headless，CSS viewport `1570 × 904`、DPR 1、100% 缩放；加载路径为项目当前 `.output/chrome-mv3`。基线通过在同一真实页面重新施加 v0.5 的 `main max-width:1300px` 与 Dock column 规则复现，避免以截图像素猜测 CSS px。

| 页面/项目 | v0.5 基线 | v0.5.1 | 差值 |
|---|---:|---:|---:|
| 首页根容器 | 1236px | 1499px | +263px |
| Dock | 200px | 200px | 0 |
| Dock 单项 | 173×64px / column | 173×40px / row | 高度 -24px |
| 首页 Feed | 700px | 963px | +263px |
| 首页右栏 | 300px | 300px | 0 |
| 详情页根容器 | 1236px | 1320px | +84px |
| 详情文章栏 | 918px | 1002px | +84px |
| 详情右栏 | 300px | 300px | 0 |
| 详情媒体外层 | 820px | 820px | 0 |

两种状态下均未检测到页面级水平溢出。详情媒体留白来自原生 Swiper 的 820px 外层舞台与实际素材比例；本轮没有覆盖 `.swiper-wrapper`、slide、内联 `transform` 或图片尺寸。

## 手测范围

历史对照截图属于已清理的专项交接包，不随源码仓库保留；上表中的可复核尺寸和测量方法继续保留。独立配置未登录账号，因此仍需在用户日常 Edge 配置中复核账号菜单、发布、点赞、评论、图片灯箱、Swiper 切换、Dock 社区切换和设置关闭还原。
