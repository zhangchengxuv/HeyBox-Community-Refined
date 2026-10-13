export type PageKind = 'home' | 'post' | null;

export interface HcrSettings {
  enabled: boolean;
  homeEnabled: boolean;
  postEnabled: boolean;
  compactHeader: boolean;
  hidePromotions: boolean;
  hideHomeNav: boolean;
  leftCommunityDock: boolean;
  dockCollapsed: boolean;
  showFeedRefresh: boolean;
}

export const DEFAULT_SETTINGS: HcrSettings = {
  enabled: true,
  homeEnabled: true,
  postEnabled: true,
  compactHeader: true,
  hidePromotions: true,
  hideHomeNav: true,
  leftCommunityDock: true,
  dockCollapsed: false,
  showFeedRefresh: true,
};

export function isEnabledForPage(settings: HcrSettings, page: PageKind): boolean {
  return settings.enabled && ((page === 'home' && settings.homeEnabled) || (page === 'post' && settings.postEnabled));
}
