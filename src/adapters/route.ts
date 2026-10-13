import type { PageKind } from '@/settings/schema';

const HOME_PATH = '/app/bbs/home';
const POST_PATH = /^\/app\/bbs\/link\/\d+\/?$/;

/** Only routes evidenced by the offline DOM kit are eligible for enhancement. */
export function getBbsPage(pathname: string): PageKind {
  if (pathname === HOME_PATH || pathname === `${HOME_PATH}/`) return 'home';
  return POST_PATH.test(pathname) ? 'post' : null;
}
