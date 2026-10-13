import type { HcrSettings } from '@/settings/schema';
import { saveSettings } from '@/settings/storage';

const DOCK_TOGGLE_ATTRIBUTE = 'data-hcr-dock-toggle';
const LEGACY_FEED_TOOLBAR_ATTRIBUTE = 'data-hcr-feed-toolbar';
const FLOATING_REFRESH_ATTRIBUTE = 'data-hcr-floating-refresh';

function selectorFor(attribute: string): string {
  return '[' + attribute + ']';
}

function setDockToggleLabel(button: HTMLButtonElement, collapsed: boolean): void {
  button.setAttribute('aria-expanded', String(!collapsed));
  button.setAttribute('aria-label', collapsed ? '展开社区导航' : '折叠社区导航');
  button.title = collapsed ? '展开社区导航' : '折叠社区导航';
  button.textContent = collapsed ? '›' : '‹';
}

function syncDockToggle(enabled: boolean, settings: HcrSettings): void {
  const existing = document.querySelectorAll<HTMLButtonElement>(selectorFor(DOCK_TOGGLE_ATTRIBUTE));
  if (!enabled) {
    existing.forEach((button) => button.remove());
    return;
  }

  const wrapper = document.querySelector<HTMLElement>(
    '#page-bbs-community .bbs-home__topic-list-wrapper',
  );
  if (!wrapper) return;

  let button = wrapper.querySelector<HTMLButtonElement>(
    ':scope > ' + selectorFor(DOCK_TOGGLE_ATTRIBUTE),
  );
  if (!button) {
    button = document.createElement('button');
    button.type = 'button';
    button.setAttribute(DOCK_TOGGLE_ATTRIBUTE, '');
    button.addEventListener('click', () => {
      const root = document.documentElement;
      const nextCollapsed = !root.classList.contains('hcr-dock-collapsed');
      root.classList.toggle('hcr-dock-collapsed', nextCollapsed);
      setDockToggleLabel(button!, nextCollapsed);
      void saveSettings({ dockCollapsed: nextCollapsed }).catch(() => {
        root.classList.toggle('hcr-dock-collapsed', !nextCollapsed);
        setDockToggleLabel(button!, !nextCollapsed);
      });
    });
    wrapper.append(button);
  }

  setDockToggleLabel(button, settings.dockCollapsed);
}

function createRefreshIcon(): SVGSVGElement {
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('width', '20');
  icon.setAttribute('height', '20');
  icon.setAttribute('aria-hidden', 'true');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M20 11a8 8 0 1 0 2 5.5M20 4v7h-7');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('stroke-width', '1.8');
  icon.append(path);
  return icon;
}

function findBottomRightFixedControl(button: HTMLButtonElement): HTMLElement | null {
  const offsets = [20, 44, 68, 92];
  const candidates = new Set<HTMLElement>();

  for (const rightOffset of offsets) {
    for (const bottomOffset of offsets) {
      const elements = document.elementsFromPoint(
        Math.max(0, window.innerWidth - rightOffset),
        Math.max(0, window.innerHeight - bottomOffset),
      );
      for (const element of elements) {
        let current: HTMLElement | null = element instanceof HTMLElement ? element : null;
        while (current && current !== document.body) {
          if (current === button || current.contains(button)) break;
          if (window.getComputedStyle(current).position === 'fixed') {
            candidates.add(current);
            break;
          }
          current = current.parentElement;
        }
      }
    }
  }

  return [...candidates].find((element) => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0
      && rect.height > 0
      && rect.width <= 120
      && rect.height <= 160
      && rect.right >= window.innerWidth - 120
      && rect.bottom >= window.innerHeight - 120;
  }) ?? null;
}

function placeFloatingRefresh(button: HTMLButtonElement): void {
  const control = findBottomRightFixedControl(button);
  const defaultBottom = window.innerWidth < 840 ? 18 : 28;
  const bottom = control
    ? Math.max(defaultBottom, Math.ceil(window.innerHeight - control.getBoundingClientRect().top + 12))
    : defaultBottom;
  button.style.setProperty('--hcr-floating-refresh-bottom', bottom + 'px');
}

function syncFloatingRefresh(enabled: boolean): void {
  /* Remove a toolbar left in the live SPA document by v0.4/v0.5. */
  document.querySelectorAll<HTMLElement>(selectorFor(LEGACY_FEED_TOOLBAR_ATTRIBUTE))
    .forEach((toolbar) => toolbar.remove());

  const existing = document.querySelectorAll<HTMLButtonElement>(
    selectorFor(FLOATING_REFRESH_ATTRIBUTE),
  );
  if (!enabled) {
    existing.forEach((button) => button.remove());
    return;
  }

  if (!document.querySelector('#page-bbs-community') || !document.body) return;

  let button = existing[0];
  existing.forEach((duplicate, index) => {
    if (index > 0) duplicate.remove();
  });
  if (!button) {
    button = document.createElement('button');
    button.type = 'button';
    button.className = 'hcr-floating-refresh-button';
    button.setAttribute(FLOATING_REFRESH_ATTRIBUTE, '');
    button.setAttribute('aria-label', '刷新社区内容');
    button.title = '刷新社区内容';
    button.append(createRefreshIcon());
    button.addEventListener('click', () => window.location.reload());
    document.body.append(button);
  }

  placeFloatingRefresh(button);
}

export function syncCommunityDockControls(active: boolean, settings: HcrSettings): void {
  const desktopDock = active
    && settings.leftCommunityDock
    && window.matchMedia('(min-width: 840px)').matches;
  syncDockToggle(desktopDock, settings);
  syncFloatingRefresh(active && settings.showFeedRefresh);
}

export function clearCommunityDockControls(): void {
  document.querySelectorAll(
    selectorFor(DOCK_TOGGLE_ATTRIBUTE)
      + ', ' + selectorFor(LEGACY_FEED_TOOLBAR_ATTRIBUTE)
      + ', ' + selectorFor(FLOATING_REFRESH_ATTRIBUTE),
  ).forEach((element) => element.remove());
}
