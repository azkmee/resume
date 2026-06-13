#!/usr/bin/env node
/* Builds a self-contained, offline-viewable copy of the site in dist/.
   Copies site/* as-is, then bakes data/portfolio.json into portfolio.js as
   window.__PORTFOLIO__ so the Work page renders without a server (file://).
   Usage: node tools/build-offline.mjs */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, rmSync } from 'node:fs';
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
const portfolioJs = readFileSync(join(siteDir, 'portfolio.js'), 'utf8');
writeFileSync(
  join(distDir, 'portfolio.js'),
  `/* data baked in for offline viewing */\nwindow.__PORTFOLIO__ = ${data.trim()};\n\n${portfolioJs}`
);

console.log('Built dist/ — open dist/work.html directly in a browser.');
