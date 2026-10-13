import { applyPageState, clearPageState } from '@/features/page-state';
import type { HcrSettings } from '@/settings/schema';
import { getSettings } from '@/settings/storage';
import '@/styles/tokens.css';
import '@/styles/home.css';
import '@/styles/post.css';
import '@/styles/v03.css';
import '@/styles/v04.css';
import '@/styles/v05.css';

let settings: HcrSettings;
let routeTimer: number | undefined;
let observedPath = '';

function stopRouteMonitoring(): void {
  if (routeTimer !== undefined) {
    clearInterval(routeTimer);
    routeTimer = undefined;
  }
}

function syncRouteState(): void {
  applyPageState(settings);
  // Keep monitoring while the master switch is on so a SPA transition from an
  // unknown BBS route back to either supported route restores the right class.
  // Unsupported routes still receive no enhancement because applyPageState()
  // removed every HCR class above.
  const shouldMonitor = settings.enabled && (settings.homeEnabled || settings.postEnabled);

  if (!shouldMonitor) {
    stopRouteMonitoring();
    return;
  }

  if (routeTimer === undefined) {
    routeTimer = window.setInterval(() => {
      if (observedPath === window.location.pathname) {
        // Reuse the existing bounded route poll to catch a SPA nav re-render.
        // No observer or site event handler is needed for this reversible class.
        applyPageState(settings);
        return;
      }
      observedPath = window.location.pathname;
      syncRouteState();
    }, 400);
  }
}

export default defineContentScript({
  matches: ['https://xiaoheihe.cn/app/bbs/*'],
  runAt: 'document_start',
  async main() {
    settings = await getSettings();
    observedPath = window.location.pathname;
    syncRouteState();

    browser.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      const next = { ...settings };
      for (const key of [
        'enabled',
        'homeEnabled',
        'postEnabled',
        'compactHeader',
        'hidePromotions',
        'hideHomeNav',
        'leftCommunityDock',
        'dockCollapsed',
        'showFeedRefresh',
      ] as const) {
        if (changes[key]) next[key] = changes[key].newValue === true;
      }
      settings = next;
      observedPath = window.location.pathname;
      syncRouteState();
    });

    window.addEventListener('pagehide', () => {
      stopRouteMonitoring();
      clearPageState();
    }, { once: true });
  },
});
