# 01 · 社区首页 DOM 实证分析

证据：用户上传 `社区.zip` 中 `社区/小黑盒 - 玩家高能聚集地.html` 及对应保存的 CSS。已解析出页面 DOM；**以下属于离线快照，不代表线上版本永久稳定**。

## 1. 结构（关键节点来自真实 DOM）

```text
#app
└── main
    └── section#page-bbs-community
        ├── .bbs-community__search-module
        │   └── .search-input-wrap.search
        └── .content
            ├── main.list
            │   └── .hb-cpt__scroll-list.hb-bbs-home
            │       ├── .bbs-home__topic-list-wrapper
            │       │   └── .bbs-home__topic-list
            │       │       └── .bbs-home__topic-item [按钮，本快照 12 个]
            │       └── .bbs-home__content-list
            │           └── .bbs-home__content-item [本快照 20 个]
            │               └── a.hb-cpt__bbs-list-content
            │                   ├── .bbs-list-content__header
            │                   │   ├── a.header__user
            │                   │   └── button.list-cotent__operation-btn
            │                   ├── .bbs-content__title
            │                   ├── .bbs-content__content
            │                   ├── .bbs-content__imgs-wrapper
            │                   │   └── .bbs-content__image
            │                   └── .bbs-new-style-bottom
            └── .cpt-right-side.right
                ├── .dynamic-content
                │   └── .bbs-community-hot-topic
                └── .right-side-default.default-content
```

准确数量与选择器见 `tests/fixtures/selectors.json`。 `list-cotent__operation-btn` 和 `hot-topic-item__cotnent` 在源站确实如此拼写，**不要擅自拼写纠正**。

## 2. 已核实原站 CSS（非建议参数）

来源：保存资源中的 `index-DBcvV3KQ.css`：

```css
#page-bbs-community { max-width:1032px; margin:0 auto; padding:16px 0; }
#page-bbs-community .content { display:flex; gap:16px; }
#page-bbs-community .list { flex:1; max-width:660px; width:0; padding:0; }
#page-bbs-community .bbs-community__search-module { position:sticky; top:80px; z-index:20; margin-bottom:16px; }
#page-bbs-community .right { position:sticky; top:138px; flex-shrink:0; z-index:10; width:356px; }
@media only screen and (max-width:1080px) {
  #page-bbs-community .content .right { display:none; }
}
```

以上为简化后的可读摘录，原始规则额外包含 Vue `data-v-*` 属性限定和其他属性。插件**不要硬编码 `data-v-*`**。

- `#page-bbs-community::before` 为 `position:fixed; top:0; height:146px; z-index:5`；`::after` 为固定底部遮罩，高 22px。改变主容器宽度后要检查固定遮罩是否遮盖内容。
- `.list::before`、`.list::after` 额外创建 sticky 白色圆角分隔伪元素，可能与新版卡片边界/滚动效果冲突。
- 社区分类容器 `.bbs-home__topic-list` 原高度 93px，横向内容由分页组件负责，`overflow-x:hidden`。不要擅自改成 `overflow:visible` 或挪走分页按钮。
- 卡片父级 `.bbs-home__content-list` 左右 padding 为 16px，卡片自身 `.hb-cpt__bbs-list-content` padding 为 `14px 12px`。
- 标题 `.bbs-content__title` 原生 `font-size:17px; line-height:25px`；预览 `.bbs-content__content` 原生 `15px/23px`、`-webkit-line-clamp:3`。
- 图集 `.bbs-content__imgs-wrapper` 是相对定位，而 `.bbs-content__image` 为绝对定位；保存快照中许多图集包含 `top/left/width/height` 的内联像素布局。不能只修改图片 CSS width/height 而不处理整个图集计算。
- `.cpt-right-side` 本身 `overflow-y:auto`，并有滚动条隐藏/滚动行为；快照里有内联 `height` 值。不要让侧栏父节点额外 `overflow:hidden`。

## 3. 关键交互保护
- 帖子卡片是链接；作者头像/作者链接、更多操作按钮、图集、点赞/评论数据等由原站渲染。禁止整体重建卡片 DOM。
- `a.hb-cpt__bbs-list-content` 的 `href` 在快照里形如 `/app/bbs/link/193449449`，足以支持“详情路由为数字 ID”这一**当前快照中的发现**；不要用固定帖子 ID。
- 帖子有文字/图片混合场景；视频、转发、投票等不同卡片变体需浏览器另外采样。
- 原站使用动态列表，样本有 20 条，不代表只能显示 20 条或已检查加载更多行为。

## 4. 推荐增强策略（设计值，待浏览器验证）
1. 容器上限建议 1280~1400px，并在桌面为主栏预留 760~880px；需要同时覆盖 `.list{max-width:660px}` 否则外层变宽但信息流不变宽。
2. 主信息流内文本阅读行长避免过宽；保留原生摘要截断或让它成为可配置项。
3. 首轮仅为卡片增加一致的分隔/hover/间距并整理辅助信息，不对绝对定位图集实施重排。
4. 将搜索栏、分类条和右栏各自保留的 sticky 上下文作为验收重点。
