#!/usr/bin/env node
// Dependency-free verification helper for sooth.dev v2 (spec §6).
// The browser-driven subcommands (motion, layout, shots) use the Chromium/Playwright
// already present in the build sandbox; nothing is added to package.json.
import { readdir, readFile, stat, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { gzipSync } from 'node:zlib';
import { join, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const command = args[0];
let failures = 0;

function fail(message) {
  failures += 1;
  console.log(`  FAIL ${message}`);
}

function pass(message) {
  console.log(`  ok   ${message}`);
}

function option(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function positional() {
  const values = [];
  for (let i = 1; i < args.length; i += 1) {
    if (args[i].startsWith('--')) {
      i += 1;
      continue;
    }
    values.push(args[i]);
  }
  return values;
}

async function collect(dir) {
  const files = [];
  for await (const file of walk(dir)) files.push(file);
  return files;
}

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

function attrs(tag) {
  const out = {};
  for (const match of tag.matchAll(/([a-zA-Z0-9:_-]+)="([^"]*)"/g)) out[match[1]] = match[2];
  return out;
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(match => attrs(match[0]));
}

async function loadPlaywright() {
  const base = process.env.NODE_PATH?.split(':').find(Boolean);
  const candidates = [base && join(base, '/'), '/usr/local/lib/node_modules/'].filter(Boolean);
  for (const candidate of candidates) {
    try {
      const require = createRequire(candidate);
      const resolved = require.resolve('playwright');
      const mod = await import(pathToFileURL(resolved).href);
      const chromium = mod.chromium ?? mod.default?.chromium;
      if (chromium) return { chromium };
    } catch {
      // try the next global location
    }
  }
  throw new Error('playwright is not installed here; run the browser subcommands in the build sandbox');
}

async function withPage(fn) {
  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-gpu'] });
  try {
    return await fn(browser);
  } finally {
    await browser.close();
  }
}

async function meta(dist) {
  const files = (await collect(dist)).filter(file => file.endsWith('.html')).sort();
  const titles = new Map();
  for (const file of files) {
    const route = '/' + relative(dist, file).split(sep).join('/');
    const html = await readFile(file, 'utf8');
    const is404 = route.endsWith('/404.html');
    const title = /<title>([\s\S]*?)<\/title>/.exec(html)?.[1]?.trim() ?? '';
    const description = tags(html, 'meta').find(meta => meta.name === 'description')?.content ?? '';
    const h1s = (html.match(/<h1\b/g) ?? []).length;

    console.log(route);
    if (title.length >= 1 && title.length <= 60) pass(`title ${title.length} chars: ${title}`);
    else fail(`title length ${title.length}: ${title}`);
    if (titles.has(title)) fail(`duplicate title also used by ${titles.get(title)}`);
    titles.set(title, route);
    if (description.length >= 1 && description.length <= 160) pass(`description ${description.length} chars`);
    else fail(`description length ${description.length}`);
    if (h1s === 1) pass('one h1');
    else fail(`${h1s} h1 elements`);

    if (is404) {
      if (tags(html, 'meta').some(m => m.name === 'robots' && m.content === 'noindex')) pass('noindex');
      else fail('404 missing noindex');
      continue;
    }

    if (title.toLowerCase().includes('links')) fail('home title still contains "Links"');
    const canonical = tags(html, 'link').find(link => link.rel === 'canonical')?.href;
    const expected = 'https://sooth.dev' + (route === '/index.html' ? '/' : route.replace(/\/index\.html$/, ''));
    if (canonical === expected) pass(`canonical ${canonical}`);
    else fail(`canonical ${canonical} != ${expected}`);

    const properties = Object.fromEntries(tags(html, 'meta').map(m => [m.property ?? m.name, m.content]));
    for (const key of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image']) {
      if (properties[key]) pass(key);
      else fail(`missing ${key}`);
    }
    if (properties['og:image']?.startsWith('https://sooth.dev/')) pass('og:image absolute');
    else fail('og:image is not absolute');
    if (properties['og:image:width'] === '1200' && properties['og:image:height'] === '630') pass('og image 1200x630');
    else fail('og image dimensions missing');
    if (properties['twitter:card']) pass('twitter:card');
    else fail('missing twitter:card');
  }
  console.log(`\n${files.length} HTML files checked, ${failures} failure(s)`);
}

async function motion(urls) {
  await withPage(async browser => {
    const page = await browser.newPage();
    for (const url of urls) {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(url, { waitUntil: 'networkidle' });
      const reduced = await page.evaluate(() => {
        const durations = [...document.querySelectorAll('*')]
          .map(el => parseFloat(getComputedStyle(el).transitionDuration) * 1000)
          .filter(value => Number.isFinite(value));
        return { animations: document.getAnimations().length, maxTransition: Math.max(0, ...durations) };
      });
      console.log(`${url} reduced-motion`);
      if (reduced.animations === 0) pass('getAnimations() = 0');
      else fail(`${reduced.animations} animations still running`);
      if (reduced.maxTransition <= 10) pass(`transition-duration ${reduced.maxTransition}ms`);
      else fail(`transition-duration ${reduced.maxTransition}ms > 10ms`);

      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.goto(url, { waitUntil: 'networkidle' });
      const normal = await page.evaluate(() => {
        const animations = document.getAnimations().map(animation => ({
          duration: animation.effect?.getTiming().duration ?? 0,
          pseudo: animation.effect?.pseudoElement ?? '',
        }));
        const durations = [...document.querySelectorAll('*')]
          .map(el => parseFloat(getComputedStyle(el).transitionDuration) * 1000)
          .filter(value => Number.isFinite(value));
        return { animations, maxTransition: Math.max(0, ...durations) };
      });
      console.log(`${url} normal`);
      const tooLong = normal.animations.filter(animation => animation.duration > 200);
      if (tooLong.length === 0) pass(`${normal.animations.length} animation(s), all <=200ms`);
      else fail(`${tooLong.length} animation(s) >200ms`);
      if (normal.maxTransition <= 200) pass(`transition-duration ${normal.maxTransition}ms`);
      else fail(`transition-duration ${normal.maxTransition}ms > 200ms`);
    }
  });
}

async function layout(urls) {
  const width = Number(option('--width') ?? 360);
  const keyboard = args.includes('--keyboard');
  await withPage(async browser => {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    for (const url of urls) {
      await page.goto(url, { waitUntil: 'networkidle' });
      const measured = await page.evaluate(() => {
        const header = document.querySelector('header');
        const targets = [...header.querySelectorAll('a, button, summary')]
          .filter(el => el.getClientRects().length > 0)
          .map(el => {
          const rect = el.getBoundingClientRect();
          return { text: el.textContent.trim().slice(0, 20), w: Math.round(rect.width), h: Math.round(rect.height) };
        });
        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          targets,
          h1: document.querySelectorAll('h1').length,
        };
      });
      console.log(`${url} @${width}`);
      if (measured.scrollWidth <= measured.innerWidth) pass(`scrollWidth ${measured.scrollWidth}/${measured.innerWidth}`);
      else fail(`horizontal scroll ${measured.scrollWidth}/${measured.innerWidth}`);
      if (measured.h1 === 1) pass('one h1');
      else fail(`${measured.h1} h1 elements`);
      const smallest = measured.targets.reduce(
        (min, target) => Math.min(min, target.w, target.h),
        Number.POSITIVE_INFINITY,
      );
      if (measured.targets.every(target => target.w >= 44 && target.h >= 44)) pass(`nav targets >=44px (smallest ${smallest}px)`);
      else fail(`nav target under 44px: ${JSON.stringify(measured.targets)}`);

      if (width < 640) {
        await page.locator('details.nav__mobile summary').click();
        const links = await page.locator('details.nav__mobile .nav__mobile-panel a').count();
        const visible = await page.locator('details.nav__mobile .nav__mobile-panel a:visible').count();
        if (links === 5 && visible === 5) pass('mobile menu exposes five links');
        else fail(`mobile menu links ${visible}/${links}`);
      }

      if (keyboard) {
        await page.goto(url, { waitUntil: 'networkidle' });
        const sequence = [];
        let reachedFooter = false;
        for (let i = 0; i < 60 && !reachedFooter; i += 1) {
          await page.keyboard.press('Tab');
          const step = await page.evaluate(() => {
            const el = document.activeElement;
            if (!el) return null;
            if (!el.__tabId) {
              window.__tabCount = (window.__tabCount ?? 0) + 1;
              el.__tabId = window.__tabCount;
            }
            return {
              id: el.__tabId,
              tag: el.tagName,
              text: (el.textContent ?? '').trim().slice(0, 24),
              focusVisible: el.matches(':focus-visible'),
              inFooter: Boolean(el.closest('footer')),
            };
          });
          if (!step) break;
          sequence.push(step);
          reachedFooter = step.inFooter;
        }
        const first = sequence[0];
        if (first?.text === 'Skip to content') pass('first Tab focuses the skip link');
        else fail(`first Tab focused ${JSON.stringify(first)}`);
        const notVisible = sequence.filter(step => step.tag !== 'BODY' && !step.focusVisible);
        if (notVisible.length === 0) pass('every tab stop is :focus-visible');
        else fail(`tab stops without :focus-visible: ${JSON.stringify(notVisible)}`);
        const keys = sequence.map(step => step.id);
        const duplicate = keys.find((key, index) => keys.indexOf(key) !== index);
        if (duplicate) fail(`tab cycle repeated ${duplicate}`);
        else pass('no tab cycle');
        if (reachedFooter) pass(`tab order reached the footer in ${sequence.length} tabs`);
        else fail(`tab order did not reach the footer (${JSON.stringify(sequence.slice(-5))})`);
      }
    }
  });
}

async function shots(base, outDir) {
  const routes = ['/', '/blog', '/blog/parallel-run', '/projects', '/projects/aztecscan', '/about'];
  const widths = [360, 768, 1280];
  await mkdir(outDir, { recursive: true });
  await withPage(async browser => {
    for (const width of widths) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      for (const route of routes) {
        const name = `${route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-')}-${width}.png`;
        const file = join(outDir, name);
        await page.goto(new URL(route, base).href, { waitUntil: 'networkidle' });
        await page.screenshot({ path: file, fullPage: true });
        const size = (await stat(file)).size;
        if (size > 10_000) pass(`${name} ${size}B`);
        else fail(`${name} only ${size}B`);
      }
      await page.close();
    }
  });
}

async function weight(dist, publicDir) {
  const files = (await collect(dist)).filter(file => file.endsWith('.html')).sort();
  const js = (await collect(join(dist, '_astro'))).filter(file => file.endsWith('.js'));
  let jsBytes = 0;
  for (const file of js) jsBytes += gzipSync(await readFile(file)).length;
  console.log(`JS gzipped: ${jsBytes} bytes`);
  if (jsBytes <= 15_360) pass('JS <= 15 KB gzipped');
  else fail(`JS ${jsBytes}B > 15360B`);

  const css = (await collect(join(dist, '_astro'))).filter(file => file.endsWith('.css'));
  let cssBytes = 0;
  for (const file of css) cssBytes += gzipSync(await readFile(file)).length;
  console.log(`CSS gzipped: ${cssBytes} bytes`);
  if (cssBytes <= 61_440) pass('CSS <= 60 KB gzipped');
  else fail(`CSS ${cssBytes}B > 61440B`);

  for (const file of files) {
    if (file.endsWith('404.html')) continue;
    const html = gzipSync(await readFile(file)).length;
    const total = html + cssBytes;
    const route = '/' + relative(dist, file).split(sep).join('/');
    if (total <= 122_880) pass(`${route} HTML+CSS ${total}B`);
    else fail(`${route} HTML+CSS ${total}B > 122880B`);
  }

  if (existsSync(publicDir)) {
    for await (const file of walk(publicDir)) {
      const size = (await stat(file)).size;
      if (size > 102_400) fail(`${file} is ${size}B > 102400B`);
    }
    pass('no public file over 100 KB');
  }
}

async function audit(file) {
  if (!existsSync(file)) {
    fail(`${file} does not exist`);
    return;
  }
  const text = await readFile(file, 'utf8');
  const rows = text.split('\n').filter(line => line.includes('|') && !/^\s*\|?\s*-+/.test(line));
  const evidenced = rows.filter(line => /research\/[\w.-]+:\d+|[\w-]+\/[\w.-]+#\d+|\b[0-9a-f]{7,40}\b/.test(line));
  console.log(`${rows.length} table rows, ${evidenced.length} carry an evidence anchor`);
  if (evidenced.length > 0) pass('content audit has evidence anchors');
  else fail('no evidence anchors found');
}

const routeArgs = positional();
switch (command) {
  case 'meta':
    await meta(routeArgs[0] ?? 'dist');
    break;
  case 'motion':
    await motion(routeArgs);
    break;
  case 'layout':
    await layout(routeArgs);
    break;
  case 'shots':
    await shots(routeArgs[0] ?? 'http://localhost:4321', routeArgs[1] ?? 'docs/evidence/screens');
    break;
  case 'weight':
    await weight(routeArgs[0] ?? 'dist', routeArgs[1] ?? 'public');
    break;
  case 'audit':
    await audit(routeArgs[0] ?? 'docs/content-audit.md');
    break;
  default:
    console.log('usage: node scripts/verify.mjs <meta|motion|layout|shots|weight|audit> ...');
    process.exit(1);
}

process.exit(failures === 0 ? 0 : 1);
