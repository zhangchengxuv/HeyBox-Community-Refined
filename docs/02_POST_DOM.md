# 02 · 帖子详情页 DOM 实证分析

证据：用户上传 `html.zip` 中 `帖子/全世界都知道我们是蓝币仙人.html` 和相关 CSS。以下描述基于已渲染离线快照。页面真实地址栏 URL 未作为单独材料提供，但首页的帖子卡片链接可证实 `/app/bbs/link/<数字ID>` 路由格式。

## 1. 关键 DOM 层级

```text
#app
└── main
    └── div#page-bbs-link.layout-normal
        └── .content
            ├── .list
            │   └── .hb-bbs-link
            │       ├── .hb-bbs-link__header
            │       ├── .hb-bbs-link__container
            │       │   ├── .hb-bbs-link__content
            │       │   │   ├── .hb-bbs-image-text
            │       │   │   │   ├── .image-text__header-image
            │       │   │   │   └── .image-text__container
            │       │   │   │       ├── .link-section-user
            │       │   │   │       ├── .link-section-title
            │       │   │   │       └── .image-text__content
            │       │   │   └── .link-comment
            │       │   │       └── .link-comment__list
            │       │   │           └── .link-comment__comment-item
            │       │   │               └── .comment-item__content-container
            │       │   │                   └── .link-comment__comment-children
            │       │   └── .hb-bbs-link__reply-target
            │       │       └── .link-reply
            └── .cpt-right-side.right
                ├── .dynamic-content
                │   └── .bbs-link__related-recommend
                └── .right-side-default
```

该快照记录 20 条 `.link-comment__comment-item`、7 个 `.link-comment__comment-children`；不代表评论加载完毕。右侧 `.bbs-link__related-recommend` 命中 2 处（相关文章和相关社区），不要用 `querySelector` 假定只有一处。

## 2. 已核实原站 CSS

保存资源 `index-Bihp8hbO.css`（文件名 hash 不能被插件依赖）：

```css
.layout-normal { position:relative; max-width:1032px; margin:0 auto; padding:16px 0; }
.layout-normal .content { display:flex; gap:16px; }
.layout-normal .content .list { flex:1; width:0; background-color:#fff; min-height:calc(100vh - 96px); }
.layout-normal .content .right { position:sticky; top:80px; flex-shrink:0; width:356px; z-index:10; }
@media only screen and (max-width:1080px) {
  .layout-normal .content .right { display:none; }
}
```

保存资源 `index-ChemEL1Y.css`：

```css
#page-bbs-link .hb-bbs-link__reply-target { position:sticky; bottom:16px; left:0; padding:0 16px; z-index:501; }
.hb-bbs-image-text .image-text__container { padding:16px 12px; margin-bottom:4px; }
.hb-bbs-image-text .image-text__container .image-text__content { margin-top:12px; font-size:16px; line-height:25px; white-space:break-spaces; word-break:break-all; }
.link-comment__comment-item .comment-item__content-container { margin-top:10px; padding:0 0 0 56px; }
```

上面为简化摘录，原规则存在其它属性限定。可调外层尺寸、排版与间距，但尽量不改原节点定位机制。

## 3. 交互风险
- 页面顶部有返回/作者关注/分享等按钮；勿删除、遮挡或劫持其事件。
- 正文富文本支持图片、表情等特殊嵌套；不要给所有后代赋予统一 `line-height` 或 `display:block`。
- 评论是嵌套结构；不要给整个 `.link-comment__comment-children` 设置无法滚动/不可见的 overflow。
- `.hb-bbs-link__reply-target` 为固定在阅读区域底部的 sticky 回复输入条；**不要**把它改成 `position:fixed` 或搬到 `body` 下。
- `.cpt-right-side` 有滚动约束；内部推荐内容需要在不同帖子下检查。

## 4. 建议设计参数（未实测）
- 整体最大宽度 1280~1400px；右侧栏 300~320px；栅格间距 16~24px。
- 正文单独限制 760~820px 阅读行宽，即便外层可更宽，不能让文字一直延展。
- 评论与正文尽量同轴对齐，保持评论头像/内容 56px 原生缩进，子评论间距单独调整。
- 小于约 1200px 时原则上少改原有布局；1080px 及以下保留原站隐藏侧栏行为。
