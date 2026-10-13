# 07 · 已确认事实 / 设计假设 / 待验证事项

## 已确认（离线 HTML 与保存样式）
- [x] 首页 DOM 根 `#page-bbs-community`。
- [x] 首页分类 `.bbs-home__topic-list-wrapper`，信息流 `.bbs-home__content-list`，卡片 `.bbs-home__content-item`。
- [x] 首页卡片链接指向 `https://xiaoheihe.cn/app/bbs/link/<数字ID>` 路径形态。
- [x] 详情页根 `#page-bbs-link.layout-normal`、评论 `.link-comment`、回复条 `.hb-bbs-link__reply-target`。
- [x] 两页根容器原站最大宽度 1032px，右栏原宽 356px；首页列表原 max-width 660px。
- [x] 首页搜索 sticky top 80px、右栏 sticky top 138px；详情右栏 top 80px、回复栏 bottom 16px。
- [x] 原站 `max-width:1080px` 隐藏右栏。
- [x] 首页图集使用绝对定位 + 内联几何尺寸。

## 设计建议（不属于原站事实）
- [ ] 宽屏容器 1280~1400px，右栏 300~320px。
- [ ] 详情正文 max-width 760~820px，中文行高 1.55~1.7。
- [ ] v0.1 总开关 + 页面开关、轻量两栏升级。
- [ ] 后续再引入舒适/紧凑视图、浅/深色模式。

## 开发必须重新核实
- [ ] 当前线上 DOM 与离线快照一致性。
- [ ] WXT 当前版本 entrypoints / 页面变化监听 API / types 可用性。
- [ ] `www.xiaoheihe.cn` 是否实际使用、是否重定向。
- [ ] 当前不同帖子类型的 DOM 与图片布局。
- [ ] SPA 跳转、异步加载、评论操作、多图、缩放及 sticky 行为。
- [ ] 公开发布前的素材/站点条款合规性。
