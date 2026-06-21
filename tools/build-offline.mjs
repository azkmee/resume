#!/usr/bin/env node
/* Builds a self-contained, offline-viewable copy of the site in dist/.
   Copies site/* as-is, then bakes:
     - data/portfolio.json        → window.__PORTFOLIO__
     - content/projects/*.md      → window.__CONTENT__  (keyed by content_ref)
   into portfolio.js so the pages render from file:// with no server.
   Usage: node tools/build-offline.mjs */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const siteDir = join(root, 'site');
const distDir = join(root, 'dist');

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

for (const f of readdirSync(siteDir)) {
  copyFileSync(join(siteDir, f), join(distDir, f));
}

const data = readFileSync(join(root, 'data', 'portfolio.json'), 'utf8');

// Bake every project's markdown body, keyed by its content_ref path.
const content = {};
const projectsDir = join(root, 'content', 'projects');
if (existsSync(projectsDir)) {
  for (const f of readdirSync(projectsDir)) {
    if (!f.endsWith('.md')) continue;
    const ref = `content/projects/${f}`;
    content[ref] = readFileSync(join(projectsDir, f), 'utf8');
  }
}

const portfolioJs = readFileSync(join(siteDir, 'portfolio.js'), 'utf8');
writeFileSync(
  join(distDir, 'portfolio.js'),
  `/* data + content baked in for offline viewing */\n` +
  `window.__PORTFOLIO__ = ${data.trim()};\n` +
  `window.__CONTENT__ = ${JSON.stringify(content)};\n\n` +
  portfolioJs
);

console.log('Built dist/ — open dist/projects.html directly in a browser.');
