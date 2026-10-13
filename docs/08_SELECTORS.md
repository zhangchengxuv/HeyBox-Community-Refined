# 08 · 离线选择器核验清单

数据源：`tests/fixtures/selectors.json`；下列数量仅针对本次离线快照。

## 社区首页

| 名称 | CSS 选择器 | 快照命中数 |
|---|---|---:|
| `root` | `#page-bbs-community` | 1 |
| `search` | `#page-bbs-community > .bbs-community__search-module` | 1 |
| `layout` | `#page-bbs-community > .content` | 1 |
| `feedColumn` | `#page-bbs-community > .content > main.list` | 1 |
| `rightColumn` | `#page-bbs-community > .content > .right` | 1 |
| `topicStrip` | `#page-bbs-community .bbs-home__topic-list-wrapper` | 1 |
| `topicButton` | `#page-bbs-community .bbs-home__topic-item` | 12 |
| `feed` | `#page-bbs-community .bbs-home__content-list` | 1 |
| `feedItem` | `#page-bbs-community .bbs-home__content-item` | 20 |
| `postLink` | `#page-bbs-community .hb-cpt__bbs-list-content` | 20 |
| `postHeader` | `#page-bbs-community .bbs-list-content__header` | 20 |
| `postTitle` | `#page-bbs-community .bbs-content__title` | 20 |
| `postPreview` | `#page-bbs-community .bbs-content__content` | 20 |
| `mediaWrapper` | `#page-bbs-community .bbs-content__imgs-wrapper` | 20 |
| `actionBar` | `#page-bbs-community .bbs-new-style-bottom` | 20 |
| `likeButton` | `#page-bbs-community .bbs-new-style-bottom__like` | 20 |
| `hotCommunities` | `#page-bbs-community .bbs-community-hot-topic` | 1 |
| `rightFooter` | `#page-bbs-community .right-side-default` | 1 |

## 帖子详情

| 名称 | CSS 选择器 | 快照命中数 |
|---|---|---:|
| `root` | `#page-bbs-link` | 1 |
| `layout` | `#page-bbs-link > .content` | 1 |
| `articleColumn` | `#page-bbs-link > .content > .list` | 1 |
| `rightColumn` | `#page-bbs-link > .content > .right` | 1 |
| `article` | `#page-bbs-link .hb-bbs-link` | 1 |
| `richText` | `#page-bbs-link .hb-bbs-image-text` | 1 |
| `heroImage` | `#page-bbs-link .image-text__header-image` | 1 |
| `bodyWrapper` | `#page-bbs-link .image-text__container` | 1 |
| `author` | `#page-bbs-link .link-section-user` | 1 |
| `title` | `#page-bbs-link .link-section-title` | 1 |
| `body` | `#page-bbs-link .image-text__content` | 1 |
| `comments` | `#page-bbs-link .link-comment` | 1 |
| `commentList` | `#page-bbs-link .link-comment__list` | 1 |
| `commentItem` | `#page-bbs-link .link-comment__comment-item` | 20 |
| `commentBody` | `#page-bbs-link .comment-item__content-container` | 20 |
| `nestedReplies` | `#page-bbs-link .link-comment__comment-children` | 7 |
| `replyBar` | `#page-bbs-link .hb-bbs-link__reply-target` | 1 |
| `related` | `#page-bbs-link .bbs-link__related-recommend` | 2 |

**原则：** 选择器匹配计数只是静态验证；请在 Edge Elements 面板复核实时页面后再做 CSS 改动。
