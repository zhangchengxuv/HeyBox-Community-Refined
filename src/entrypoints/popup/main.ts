import './style.css';
import type { HcrSettings } from '@/settings/schema';
import { getSettings, saveSettings } from '@/settings/storage';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Popup root is unavailable.');

app.innerHTML = `
  <main class="popup-shell">
    <header>
      <p class="eyebrow">HeyBox Community Refined</p>
      <h1>社区阅读增强</h1>
      <p class="summary">仅调整已识别 BBS 页面的桌面阅读布局，不替代网站操作。</p>
    </header>
    <section class="settings" aria-label="增强设置">
      <label class="setting setting-primary">
        <span><strong>启用增强</strong><small>关闭后立即恢复原站样式</small></span>
        <input id="enabled" type="checkbox" role="switch">
      </label>
      <label class="setting">
        <span><strong>社区首页</strong><small>/app/bbs/home</small></span>
        <input id="homeEnabled" type="checkbox" role="switch">
      </label>
      <label class="setting">
        <span><strong>帖子详情</strong><small>/app/bbs/link/数字 ID</small></span>
        <input id="postEnabled" type="checkbox" role="switch">
      </label>
      <label class="setting">
        <span><strong>精简社区顶栏</strong><small>仅隐藏已识别的产品导航入口</small></span>
        <input id="compactHeader" type="checkbox" role="switch">
      </label>
      <label class="setting">
        <span><strong>隐藏产品推广</strong><small>隐藏 APP 下载与产品快捷入口</small></span>
        <input id="hidePromotions" type="checkbox" role="switch">
      </label>
      <label class="setting">
        <span><strong>隐藏首页导航</strong><small>社区页面仅保留社区入口</small></span>
        <input id="hideHomeNav" type="checkbox" role="switch">
      </label>
      <label class="setting">
        <span><strong>左侧社区 Dock</strong><small>将原生分类重排为可折叠导航</small></span>
        <input id="leftCommunityDock" type="checkbox" role="switch">
      </label>
      <label class="setting">
        <span><strong>Dock 默认折叠</strong><small>展开/折叠状态会自动保存</small></span>
        <input id="dockCollapsed" type="checkbox" role="switch">
      </label>
      <label class="setting">
        <span><strong>信息流刷新按钮</strong><small>点击后刷新当前页面</small></span>
        <input id="showFeedRefresh" type="checkbox" role="switch">
      </label>
    </section>
    <p id="status" class="status" aria-live="polite"></p>
  </main>`;

const controls = {
  enabled: document.querySelector<HTMLInputElement>('#enabled')!,
  homeEnabled: document.querySelector<HTMLInputElement>('#homeEnabled')!,
  postEnabled: document.querySelector<HTMLInputElement>('#postEnabled')!,
  compactHeader: document.querySelector<HTMLInputElement>('#compactHeader')!,
  hidePromotions: document.querySelector<HTMLInputElement>('#hidePromotions')!,
  hideHomeNav: document.querySelector<HTMLInputElement>('#hideHomeNav')!,
  leftCommunityDock: document.querySelector<HTMLInputElement>('#leftCommunityDock')!,
  dockCollapsed: document.querySelector<HTMLInputElement>('#dockCollapsed')!,
  showFeedRefresh: document.querySelector<HTMLInputElement>('#showFeedRefresh')!,
};
const status = document.querySelector<HTMLParagraphElement>('#status')!;

function render(current: HcrSettings): void {
  for (const [key, control] of Object.entries(controls) as [keyof HcrSettings, HTMLInputElement][]) {
    control.checked = current[key];
  }
  controls.homeEnabled.disabled = !current.enabled;
  controls.postEnabled.disabled = !current.enabled;
  controls.compactHeader.disabled = !current.enabled;
  controls.hidePromotions.disabled = !current.enabled;
  controls.hideHomeNav.disabled = !current.enabled;
  controls.leftCommunityDock.disabled = !current.enabled;
  controls.dockCollapsed.disabled = !current.enabled || !current.leftCommunityDock;
  controls.showFeedRefresh.disabled = !current.enabled || !current.homeEnabled;
  status.textContent = current.enabled ? '设置会立即同步到已打开的 BBS 页面。' : '增强已关闭，原站布局已恢复。';
}

for (const [key, control] of Object.entries(controls) as [keyof HcrSettings, HTMLInputElement][]) {
  control.addEventListener('change', async () => {
    control.disabled = true;
    try {
      render(await saveSettings({ [key]: control.checked }));
    } catch {
      status.textContent = '保存设置失败，请重试。';
    } finally {
      control.disabled = false;
    }
  });
}

render(await getSettings());
