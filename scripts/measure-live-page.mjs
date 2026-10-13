import { writeFile } from 'node:fs/promises';

const port = process.argv[2] || '9223';
const screenshotPath = process.argv[3] === '-' ? undefined : process.argv[3];
const mode = process.argv[4] || 'current';
const targets = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
const page = targets.find((target) => target.type === 'page' && /xiaoheihe\.cn\/app\/bbs\//.test(target.url));

if (!page?.webSocketDebuggerUrl) {
  throw new Error(`No HeyBox page found on Edge debugging port ${port}.`);
}

const socket = new WebSocket(page.webSocketDebuggerUrl);
let nextId = 0;
const pending = new Map();

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  const handler = pending.get(message.id);
  if (!handler) return;
  pending.delete(message.id);
  if (message.error) handler.reject(new Error(message.error.message));
  else handler.resolve(message.result);
});

await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

function command(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

if (mode.startsWith('viewport-')) {
  const width = Number(mode.slice('viewport-'.length));
  if (!Number.isFinite(width) || width < 320) {
    throw new Error(`Invalid viewport mode: ${mode}`);
  }
  await command('Emulation.setDeviceMetricsOverride', {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

if (mode === 'v05-baseline') {
  await command('Runtime.evaluate', {
    expression: `(() => {
      const main = document.querySelector('#app > main');
      const root = document.querySelector('#page-bbs-community, #page-bbs-link');
      if (main) {
        main.style.width = '';
        main.style.maxWidth = '1300px';
      }
      if (root) {
        root.style.width = 'calc(100% - 40px)';
        root.style.maxWidth = '1520px';
      }
      document.querySelectorAll('#page-bbs-community .bbs-home__topic-item')
        .forEach(item => item.style.flexDirection = 'column');
    })()`,
  });
}

if (mode === 'avoidance-test') {
  await command('Runtime.evaluate', {
    expression: `(() => {
      const previous = document.querySelector('[data-hcr-test-fixed-control]');
      previous?.remove();
      const control = document.createElement('button');
      control.type = 'button';
      control.setAttribute('data-hcr-test-fixed-control', '');
      control.style.cssText = [
        'position:fixed',
        'right:8px',
        'bottom:8px',
        'width:48px',
        'height:48px',
        'z-index:17',
      ].join(';');
      document.body.append(control);
    })()`,
  });
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

if (mode === 'click-refresh-test') {
  await command('Runtime.evaluate', {
    expression: `document.querySelector('[data-hcr-floating-refresh]')?.click()`,
  });
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

const expression = `(() => {
  const round = value => Math.round(value * 10) / 10;
  const read = (name, selector) => {
    const element = document.querySelector(selector);
    if (!element) return { name, selector, missing: true };
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      name,
      selector,
      x: round(rect.x),
      y: round(rect.y),
      width: round(rect.width),
      height: round(rect.height),
      maxWidth: style.maxWidth,
      position: style.position,
      right: style.right,
      bottom: style.bottom,
      borderRadius: style.borderRadius,
      backgroundColor: style.backgroundColor,
      borderColor: style.borderColor,
      boxShadow: style.boxShadow,
      padding: style.padding,
      display: style.display,
      flexDirection: style.flexDirection,
      gridTemplateColumns: style.gridTemplateColumns,
      overflowX: style.overflowX,
    };
  };
  const root = document.querySelector('#page-bbs-community, #page-bbs-link');
  const homeCards = [...document.querySelectorAll('#page-bbs-community .hb-cpt__bbs-list-content')];
  const chain = [];
  for (let node = root, level = 0; node && level < 8; node = node.parentElement, level += 1) {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    chain.push({
      level,
      element: node.tagName.toLowerCase() + (node.id ? '#' + node.id : ''),
      x: round(rect.x),
      width: round(rect.width),
      maxWidth: style.maxWidth,
      display: style.display,
      overflowX: style.overflowX,
    });
  }
  return {
    route: location.pathname,
    viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
    rootClasses: document.documentElement.className,
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 2,
    scrollWidth: document.documentElement.scrollWidth,
    floatingRefreshCount: document.querySelectorAll('[data-hcr-floating-refresh]').length,
    legacyToolbarCount: document.querySelectorAll('[data-hcr-feed-toolbar]').length,
    homeCardAudit: homeCards.length ? {
      count: homeCards.length,
      radii: [...new Set(homeCards.map((card) => getComputedStyle(card).borderRadius))],
      backgrounds: [...new Set(homeCards.map((card) => getComputedStyle(card).backgroundColor))],
      borderColors: [...new Set(homeCards.map((card) => getComputedStyle(card).borderColor))],
    } : null,
    rows: [
      read('pageRoot', '#page-bbs-community, #page-bbs-link'),
      read('searchModule', '#page-bbs-community > .bbs-community__search-module'),
      read('searchInput', '#page-bbs-community .search-input-wrap .el-input__wrapper'),
      read('homeContent', '#page-bbs-community > .content'),
      read('dock', '#page-bbs-community .bbs-home__topic-list-wrapper'),
      read('topicItem', '#page-bbs-community .bbs-home__topic-item'),
      read('feed', '#page-bbs-community .bbs-home__content-list'),
      read('homeFirstCard', '#page-bbs-community .bbs-home__content-item'),
      read('homeFirstCardSurface', '#page-bbs-community .hb-cpt__bbs-list-content'),
      read('right', '#page-bbs-community > .content > .right, #page-bbs-link > .content > .right'),
      read('hotCommunityPanel', '#page-bbs-community .bbs-community-hot-topic'),
      read('floatingRefresh', '[data-hcr-floating-refresh]'),
      read('postContent', '#page-bbs-link > .content'),
      read('postArticle', '#page-bbs-link > .content > .list'),
      read('postRelated', '#page-bbs-link .bbs-link__related-recommend'),
      read('postReplyQuote', '#page-bbs-link .link-comment__comment-children'),
      read('postReplyInput', '#page-bbs-link .link-reply__main-box'),
      read('postMedia', '#page-bbs-link .image-text__header-image'),
    ],
    chain,
  };
})()`;

const evaluated = await command('Runtime.evaluate', {
  expression,
  awaitPromise: true,
  returnByValue: true,
});

console.log(JSON.stringify(evaluated.result.value, null, 2));

if (screenshotPath) {
  const captured = await command('Page.captureScreenshot', { format: 'png', fromSurface: true });
  await writeFile(screenshotPath, Buffer.from(captured.data, 'base64'));
  console.error(`Screenshot written to ${screenshotPath}`);
}

socket.close();
