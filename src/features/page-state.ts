import { getBbsPage } from '@/adapters/route';
import { clearCommunityDockControls, syncCommunityDockControls } from '@/features/community-dock';
import { isEnabledForPage, type HcrSettings } from '@/settings/schema';

const ROOT_CLASS = 'hcr-enabled';
const HOME_CLASS = 'hcr-home';
const POST_CLASS = 'hcr-post';
const COMPACT_HEADER_CLASS = 'hcr-compact-header';
const HIDE_PROMOTIONS_CLASS = 'hcr-hide-promotions';
const HIDE_HOME_NAV_CLASS = 'hcr-hide-home-nav';
const LEFT_DOCK_CLASS = 'hcr-left-community-dock';
const DOCK_COLLAPSED_CLASS = 'hcr-dock-collapsed';
const HIDDEN_NAV_CLASS = 'hcr-hidden-nav-item';

const PROMOTIONAL_NAV_LABELS = new Set([
  '小黑盒加速器',
  '黑盒语音',
  '黑盒工坊',
  '开放平台',
  '加入我们',
]);

function normalizedLabel(element: Element): string {
  return (element.textContent ?? '').replace(/\s+/g, '').trim();
}

function applyCompactHeaderNav(active: boolean, settings: HcrSettings): void {
  const navItems = document.querySelectorAll('nav.nav .nav-links > button.nav-link');
  for (const item of navItems) {
    const isPromotional = PROMOTIONAL_NAV_LABELS.has(normalizedLabel(item));
    const isHome = normalizedLabel(item) === '首页';
    item.classList.toggle(
      HIDDEN_NAV_CLASS,
      active && ((settings.compactHeader && isPromotional) || (settings.hideHomeNav && isHome)),
    );
  }
}

export function applyPageState(settings: HcrSettings): void {
  const page = getBbsPage(window.location.pathname);
  const active = isEnabledForPage(settings, page);
  const root = document.documentElement;

  root.classList.toggle(ROOT_CLASS, active);
  root.classList.toggle(HOME_CLASS, active && page === 'home');
  root.classList.toggle(POST_CLASS, active && page === 'post');
  root.classList.toggle(COMPACT_HEADER_CLASS, active && settings.compactHeader);
  root.classList.toggle(HIDE_PROMOTIONS_CLASS, active && settings.hidePromotions);
  root.classList.toggle(HIDE_HOME_NAV_CLASS, active && settings.hideHomeNav);
  root.classList.toggle(LEFT_DOCK_CLASS, active && page === 'home' && settings.leftCommunityDock);
  root.classList.toggle(DOCK_COLLAPSED_CLASS, active && page === 'home' && settings.dockCollapsed);
  applyCompactHeaderNav(active, settings);
  syncCommunityDockControls(active && page === 'home', settings);
}

export function clearPageState(): void {
  document.documentElement.classList.remove(
    ROOT_CLASS,
    HOME_CLASS,
    POST_CLASS,
    COMPACT_HEADER_CLASS,
    HIDE_PROMOTIONS_CLASS,
    HIDE_HOME_NAV_CLASS,
    LEFT_DOCK_CLASS,
    DOCK_COLLAPSED_CLASS,
  );
  document.querySelectorAll('.' + HIDDEN_NAV_CLASS)
    .forEach((element) => element.classList.remove(HIDDEN_NAV_CLASS));
  clearCommunityDockControls();
}
