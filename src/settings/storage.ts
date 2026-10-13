import { DEFAULT_SETTINGS, type HcrSettings } from './schema';

export async function getSettings(): Promise<HcrSettings> {
  const defaults: Record<string, boolean> = { ...DEFAULT_SETTINGS };
  const stored = await browser.storage.local.get(defaults);
  return {
    enabled: stored.enabled === true,
    homeEnabled: stored.homeEnabled === true,
    postEnabled: stored.postEnabled === true,
    compactHeader: stored.compactHeader === true,
    hidePromotions: stored.hidePromotions === true,
    hideHomeNav: stored.hideHomeNav === true,
    leftCommunityDock: stored.leftCommunityDock === true,
    dockCollapsed: stored.dockCollapsed === true,
    showFeedRefresh: stored.showFeedRefresh === true,
  };
}

export async function saveSettings(next: Partial<HcrSettings>): Promise<HcrSettings> {
  await browser.storage.local.set(next);
  return getSettings();
}
