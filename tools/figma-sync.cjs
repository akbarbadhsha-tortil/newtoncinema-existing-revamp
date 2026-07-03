#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'figma');

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    return;
  }

  const command = args[0] || 'sync';
  const env = loadEnv();

  const token = env.FIGMA_TOKEN;
  const fileKey = env.FIGMA_FILE_KEY;
  const nodeIds = parseNodeIds(readArgValue(args, '--ids') || env.FIGMA_NODE_IDS || '');
  const scale = Number(readArgValue(args, '--scale') || env.FIGMA_IMAGE_SCALE || 2);

  if (!token || !fileKey) {
    throw new Error('Missing FIGMA_TOKEN or FIGMA_FILE_KEY. Add them to .env.local');
  }

  ensureDir(OUT_DIR);

  if (command === 'file') {
    await fetchFileJson({ token, fileKey });
    return;
  }

  if (command === 'nodes') {
    await fetchNodesJson({ token, fileKey, nodeIds });
    return;
  }

  if (command === 'images') {
    await fetchNodeImages({ token, fileKey, nodeIds, scale });
    return;
  }

  if (command === 'sync') {
    await fetchFileJson({ token, fileKey });
    await fetchNodesJson({ token, fileKey, nodeIds });
    await fetchNodeImages({ token, fileKey, nodeIds, scale });
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

function printHelp() {
  console.log(`Figma sync tool\n\nUsage:\n  node tools/figma-sync.cjs sync\n  node tools/figma-sync.cjs file\n  node tools/figma-sync.cjs nodes --ids 1:2,3:4\n  node tools/figma-sync.cjs images --ids 1:2,3:4 --scale 2\n\nReads env from .env.local/.env:\n  FIGMA_TOKEN=...\n  FIGMA_FILE_KEY=...\n  FIGMA_NODE_IDS=1:2,3:4\n  FIGMA_IMAGE_SCALE=2\n`);
}

async function fetchFileJson({ token, fileKey }) {
  const json = await figmaGet(`/v1/files/${encodeURIComponent(fileKey)}`, token);
  const out = path.join(OUT_DIR, 'file.json');
  writeJson(out, json);
  console.log(`Saved file JSON: ${rel(out)}`);
}

async function fetchNodesJson({ token, fileKey, nodeIds }) {
  if (nodeIds.length === 0) {
    console.log('No FIGMA_NODE_IDS provided; skipped nodes export.');
    return;
  }

  const idsQuery = encodeURIComponent(nodeIds.join(','));
  const json = await figmaGet(
    `/v1/files/${encodeURIComponent(fileKey)}/nodes?ids=${idsQuery}`,
    token
  );

  const nodesDir = path.join(OUT_DIR, 'nodes');
  ensureDir(nodesDir);

  writeJson(path.join(nodesDir, 'nodes.json'), json);
  for (const id of nodeIds) {
    const node = json.nodes?.[id];
    if (!node) continue;
    writeJson(path.join(nodesDir, `${sanitizeNodeId(id)}.json`), node);
  }

  console.log(`Saved nodes JSON: ${rel(nodesDir)}`);
}

async function fetchNodeImages({ token, fileKey, nodeIds, scale }) {
  if (nodeIds.length === 0) {
    console.log('No FIGMA_NODE_IDS provided; skipped image export.');
    return;
  }

  const idsQuery = encodeURIComponent(nodeIds.join(','));
  const imageMeta = await figmaGet(
    `/v1/images/${encodeURIComponent(fileKey)}?ids=${idsQuery}&format=png&scale=${scale}`,
    token
  );

  const imagesDir = path.join(OUT_DIR, 'images');
  ensureDir(imagesDir);

  const entries = Object.entries(imageMeta.images || {});
  if (entries.length === 0) {
    console.log('No images returned by Figma for the requested node IDs.');
    return;
  }

  for (const [nodeId, url] of entries) {
    if (!url) continue;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Image download failed for ${nodeId}: ${response.status}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const outPath = path.join(imagesDir, `${sanitizeNodeId(nodeId)}.png`);
    fs.writeFileSync(outPath, buffer);
  }

  writeJson(path.join(imagesDir, 'manifest.json'), {
    generatedAt: new Date().toISOString(),
    scale,
    images: imageMeta.images,
  });

  console.log(`Saved images: ${rel(imagesDir)}`);
}

async function figmaGet(urlPath, token) {
  const response = await fetch(`https://api.figma.com${urlPath}`, {
    headers: {
      'X-Figma-Token': token,
    },
  });

  if (!response.ok) {
    const body = await safeReadText(response);
    throw new Error(`Figma API ${response.status}: ${body.slice(0, 300)}`);
  }

  return response.json();
}

async function safeReadText(response) {
  try {
    return await response.text();
  } catch {
    return '';
  }
}

function loadEnv() {
  const merged = {};
  const files = ['.env', '.env.local'];
  for (const file of files) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) continue;
    Object.assign(merged, parseDotEnv(fs.readFileSync(filePath, 'utf8')));
  }
  return { ...process.env, ...merged };
}

function parseDotEnv(content) {
  const env = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function parseNodeIds(value) {
  return value
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

function readArgValue(args, key) {
  const index = args.indexOf(key);
  if (index === -1 || index + 1 >= args.length) return '';
  return args[index + 1];
}

function sanitizeNodeId(id) {
  return id.replace(/[^a-zA-Z0-9_-]/g, '-');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function rel(filePath) {
  return path.relative(ROOT, filePath) || '.';
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
