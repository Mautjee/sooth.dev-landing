// The layout owns the page h1. This normalises the built HTML so a markdown body that
// still starts with its own `# Title` cannot render a second h1 (or a duplicated title).
// It is a build step, not a content edit: the content rewrite removes the source headings.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = process.argv[2] ?? 'dist';

async function* htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}

let changed = 0;

for await (const file of htmlFiles(DIST)) {
  const html = await readFile(file, 'utf8');
  const matches = [...html.matchAll(/<h1\b[^>]*>[\s\S]*?<\/h1>/g)];
  if (matches.length <= 1) continue;
  let next = html;
  for (const match of matches.slice(1).reverse()) {
    next = next.slice(0, match.index) + next.slice(match.index + match[0].length);
  }
  if (next !== html) {
    await writeFile(file, next);
    changed += 1;
  }
}

console.log(`postbuild: normalised h1 in ${changed} file(s)`);
