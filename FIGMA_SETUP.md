# Figma Connection Setup

## 1) Add credentials
Copy `.env.example` to `.env.local` and fill values:

```bash
cp .env.example .env.local
```

Required:
- `FIGMA_TOKEN`: Personal access token from Figma account settings
- `FIGMA_FILE_KEY`: file key from your Figma URL

Optional:
- `FIGMA_NODE_IDS`: comma-separated node IDs to export
- `FIGMA_IMAGE_SCALE`: PNG export scale (`1`, `2`, `3`, etc.)

## 2) Run sync

```bash
npm run figma:sync
```

This writes output to:
- `figma/file.json`
- `figma/nodes/nodes.json`
- `figma/nodes/<node-id>.json`
- `figma/images/<node-id>.png`
- `figma/images/manifest.json`

## 3) Useful commands

```bash
npm run figma:file
npm run figma:nodes
npm run figma:images
```

Or override node IDs ad hoc:

```bash
npm run figma:images -- --ids 1:2,1:8 --scale 2
```
