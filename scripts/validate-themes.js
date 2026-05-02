#!/usr/bin/env node
// scripts/validate-themes.js — 驗證 themes.json schema，CI 也用此檔案

const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'docs', 'themes.json');
const data = JSON.parse(fs.readFileSync(file, 'utf-8'));

const errors = [];

function err(msg) { errors.push(msg); }

if (!data.themes) err('Missing "themes" object');
if (!data.defaultTheme) err('Missing "defaultTheme"');
if (!data.themes[data.defaultTheme]) err(`defaultTheme "${data.defaultTheme}" not in themes`);

const REQUIRED_LEVELS = ['beginner', 'medium', 'advanced'];
const PAIRS_PER_LEVEL = 5;

for (const [key, theme] of Object.entries(data.themes || {})) {
  if (!theme.name) err(`theme "${key}": missing name`);
  if (!theme.icon) err(`theme "${key}": missing icon`);
  if (!theme.levels) { err(`theme "${key}": missing levels`); continue; }

  for (const lv of REQUIRED_LEVELS) {
    if (!theme.levels[lv]) err(`theme "${key}": missing level "${lv}"`);
  }

  for (const [lvKey, level] of Object.entries(theme.levels)) {
    if (!level.label) err(`theme "${key}.${lvKey}": missing label`);
    if (!Array.isArray(level.pairs)) {
      err(`theme "${key}.${lvKey}": pairs not array`);
      continue;
    }
    if (level.pairs.length !== PAIRS_PER_LEVEL) {
      err(`theme "${key}.${lvKey}": expected ${PAIRS_PER_LEVEL} pairs, got ${level.pairs.length}`);
    }
    level.pairs.forEach((pair, i) => {
      if (!Array.isArray(pair) || pair.length !== 2) {
        err(`theme "${key}.${lvKey}.pairs[${i}]": must be [a, b] tuple`);
        return;
      }
      pair.forEach((face, j) => {
        if (!face.image && !face.text) {
          err(`theme "${key}.${lvKey}.pairs[${i}][${j}]": needs image or text`);
        }
      });
    });
  }
}

if (errors.length) {
  console.error('❌ themes.json validation failed:');
  errors.forEach(e => console.error('  -', e));
  process.exit(1);
}

const themeCount = Object.keys(data.themes).length;
const totalPairs = Object.values(data.themes).reduce((sum, t) =>
  sum + Object.values(t.levels || {}).reduce((s, l) => s + (l.pairs?.length || 0), 0), 0);
console.log(`✅ themes.json valid: ${themeCount} themes, ${totalPairs} pairs total`);
