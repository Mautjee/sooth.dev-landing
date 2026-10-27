#!/usr/bin/env node
/**
 * Renders the design prototypes and the six OG cards with a real browser.
 * Run inside the build sandbox:
 *
 *   NODE_PATH=/usr/local/lib/node_modules node docs/design/render.mjs
 *
 * Outputs:
 *   docs/design/screens/*.png   (prototype evidence, 2x DPR)
 *   public/og/*.png             (1200x630, 1x)
 *   docs/design/render-report.json
 */
import { createRequire } from 'node:module';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
let playwright;
for (const id of [
  '/usr/local/lib/node_modules/playwright',
  'playwright',
]) {
  try {
    playwright = require(id);
    break;
  } catch {}
}
if (!playwright) throw new Error('playwright not found; install it or run on the build sandbox');
const { chromium } = playwright;

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const screens = path.join(here, 'screens');
const ogDir = path.join(repo, 'public/og');

const CHROME =
  process.env.CHROME_PATH || '/opt/ms-playwright/chromium-1194/chrome-linux/chrome';

const pages = [
  { name: 'home-a', file: 'variant-a.html' },
  { name: 'home-b', file: 'variant-b.html' },
  { name: 'project', file: 'project.html' },
  { name: 'post', file: 'post.html' },
  { name: 'blog', file: 'blog.html' },
  { name: 'projects', file: 'projects.html' },
  { name: 'about', file: 'about.html' },
  { name: 'about-b', file: 'about-b.html' },
];

const widths = [360, 768, 1280];
const fullPageWidths = [360, 1280];

const ogCards = [
  {
    kind: 'home',
    label: 'sooth.dev',
    title: 'Mauro Eijsenring',
    sub: 'Platform and infrastructure engineer. Kubernetes, CI/CD, and the guardrails around AI agents.',
    url: 'sooth.dev',
  },
  {
    kind: 'about',
    label: 'about',
    title: 'Taking prototypes to production platforms',
    sub: 'And keeping them running: Kubernetes, CI/CD, migrations, AI-agent guardrails.',
    url: 'sooth.dev/about',
  },
  {
    kind: 'blog',
    label: 'writing',
    title: 'Field notes from operating platforms',
    sub: 'Migrations, CI/CD, and what an AI agent needs before it goes near production.',
    url: 'sooth.dev/blog',
  },
  {
    kind: 'post',
    label: 'post',
    title: 'The command, the commit, the tradeoff',
    sub: 'Every post carries the artefact behind the claim.',
    url: 'sooth.dev/blog',
  },
  {
    kind: 'projects',
    label: 'projects',
    title: 'Prototypes turned into platforms',
    sub: 'Five case studies with commits, PRs and the decisions that cost something.',
    url: 'sooth.dev/projects',
  },
  {
    kind: 'project',
    label: 'case study',
    title: 'The problem, the role, the hard part',
    sub: 'What was broken, what I owned, what I would do differently.',
    url: 'sooth.dev/projects',
  },
];

function ogHtml(card) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0}
  html,body{width:1200px;height:630px}
  body{background:#282828;color:#ebdbb2;
    font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    padding:72px 78px;display:flex;flex-direction:column;justify-content:space-between;
    -webkit-font-smoothing:antialiased}
  .mono{font-family:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace}
  .top{display:flex;justify-content:space-between;align-items:baseline;
    font-size:24px;letter-spacing:.01em;color:#bdae93}
  .site{color:#fabd2f}
  .mid{padding-block:8px}
  h1{font-size:84px;line-height:.98;letter-spacing:-.035em;font-weight:680;color:#fbf1c7;
    max-width:1010px;text-wrap:balance}
  .sub{margin-top:26px;font-size:30px;line-height:1.35;color:#bdae93;max-width:900px}
  .bottom{display:flex;justify-content:space-between;align-items:baseline;
    font-size:22px;color:#bdae93}
  .rule{height:3px;width:64px;background:#fabd2f;margin-bottom:18px}
  </style></head><body>
  <div class="top mono"><span class="site">${card.label === 'sooth.dev' ? 'sooth.dev' : 'sooth.dev / ' + card.label}</span><span>Mauro Eijsenring</span></div>
  <div class="mid"><div class="rule"></div><h1>${card.title}</h1><p class="sub">${card.sub}</p></div>
  <div class="bottom mono"><span>${card.url}</span><span>portfolio</span></div>
  </body></html>`;
}

async function measure(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const navTargets = [...document.querySelectorAll('.site-header a, .site-header summary')]
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { text: el.textContent.trim(), w: Math.round(r.width), h: Math.round(r.height) };
      })
      .filter((t) => t.w > 0 && t.h > 0);
    const smallest = navTargets.sort((a, b) => Math.min(a.w, a.h) - Math.min(b.w, b.h))[0] || null;
    const h1s = [...document.querySelectorAll('h1')].map((h) => h.textContent.trim());
    const css = (sel, prop) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el)[prop] : null;
    };
    return {
      scrollWidth: doc.scrollWidth,
      innerWidth: window.innerWidth,
      overflow: doc.scrollWidth > window.innerWidth,
      h1Count: h1s.length,
      h1: h1s,
      smallestNavTarget: smallest,
      navTargets,
      bodyFontSize: css('body', 'fontSize'),
      h1FontSize: css('h1', 'fontSize'),
      metaFontSize: css('.mono', 'fontSize'),
      animationsAfterLoad: document.getAnimations().length,
      jsBytes: [...document.scripts].reduce((n, s) => n + (s.src ? 0 : s.textContent.length), 0),
    };
  });
}

const report = { pages: {}, og: {} };

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--no-sandbox', '--font-render-hinting=none'],
});

await mkdir(screens, { recursive: true });
await mkdir(ogDir, { recursive: true });

for (const p of pages) {
  const url = pathToFileURL(path.join(here, p.file)).href;
  report.pages[p.name] = { url, widths: {} };

  for (const width of widths) {
    const ctx = await browser.newContext({
      viewport: { width, height: 900 },
      deviceScaleFactor: 2,
      reducedMotion: 'no-preference',
    });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(150);

    const m = await measure(page);
    if (width === 360) {
      m.reduce = await page.evaluate(() => {
        const before = document.getAnimations().length;
        return { animations: before };
      });
    }
    report.pages[p.name].widths[width] = m;

    if (fullPageWidths.includes(width)) {
      await page.screenshot({
        path: path.join(screens, `${p.name}-${width}.png`),
        fullPage: true,
      });
    }
    await ctx.close();
  }
}

// JS-off render of the home page at 360 — AC-3 evidence.
{
  const ctx = await browser.newContext({
    viewport: { width: 360, height: 900 },
    deviceScaleFactor: 2,
    javaScriptEnabled: false,
  });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(path.join(here, 'variant-a.html')).href, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(screens, 'home-a-360-nojs.png'), fullPage: true });
  const h1Count = await page.locator('h1').count();
  const text = await page.locator('main').innerText();
  report.pages['home-a-nojs'] = {
    h1Count,
    firstSentence: text.split('\n').filter(Boolean).slice(0, 4),
    textLength: text.length,
    scripts: await page.locator('script').count(),
  };
  await ctx.close();
}

// Reduced-motion emulation run.
{
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(path.join(here, 'variant-a.html')).href, { waitUntil: 'load' });
  report.pages['home-a-reduced'] = await page.evaluate(() => ({
    animations: document.getAnimations().length,
    linkTransition: getComputedStyle(document.querySelector('a')).transitionDuration,
  }));
  await ctx.close();
}

for (const card of ogCards) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(ogHtml(card), { waitUntil: 'load' });
  await page.waitForTimeout(80);
  const out = path.join(ogDir, `${card.kind}.png`);
  await page.screenshot({ path: out, type: 'png' });
  const s = await stat(out);
  report.og[card.kind] = { bytes: s.size, path: out };
  await page.close();
}

await browser.close();
await writeFile(path.join(here, 'render-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
