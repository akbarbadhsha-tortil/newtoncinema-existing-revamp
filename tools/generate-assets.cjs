const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const outDir = path.join(process.cwd(), 'assets');

function clamp(x, min, max) {
  return Math.max(min, Math.min(max, x));
}

function mix(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function setPixel(png, x, y, r, g, b, a = 255) {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) return;
  const idx = (png.width * y + x) * 4;
  png.data[idx] = r;
  png.data[idx + 1] = g;
  png.data[idx + 2] = b;
  png.data[idx + 3] = a;
}

function fillGradient(png, top, bottom) {
  for (let y = 0; y < png.height; y += 1) {
    const t = y / (png.height - 1);
    const r = mix(top[0], bottom[0], t);
    const g = mix(top[1], bottom[1], t);
    const b = mix(top[2], bottom[2], t);
    for (let x = 0; x < png.width; x += 1) {
      setPixel(png, x, y, r, g, b, 255);
    }
  }
}

function fillCircle(png, cx, cy, radius, color) {
  const [r, g, b, a = 255] = color;
  const minX = Math.floor(cx - radius);
  const maxX = Math.ceil(cx + radius);
  const minY = Math.floor(cy - radius);
  const maxY = Math.ceil(cy + radius);
  const r2 = radius * radius;

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      const d2 = dx * dx + dy * dy;
      if (d2 <= r2) {
        const edge = clamp((radius - Math.sqrt(d2)) / 1.5, 0, 1);
        setPixel(png, x, y, r, g, b, Math.round(a * edge + 255 * (1 - edge)) > 255 ? 255 : a);
        setPixel(png, x, y, r, g, b, a);
      }
    }
  }
}

function fillRect(png, x0, y0, w, h, color) {
  const [r, g, b, a = 255] = color;
  for (let y = Math.floor(y0); y < Math.floor(y0 + h); y += 1) {
    for (let x = Math.floor(x0); x < Math.floor(x0 + w); x += 1) {
      setPixel(png, x, y, r, g, b, a);
    }
  }
}

function createIcon() {
  const size = 1024;
  const png = new PNG({ width: size, height: size });

  fillGradient(png, [255, 240, 219], [253, 186, 116]);

  fillCircle(png, 512, 560, 270, [194, 65, 12, 255]);
  fillCircle(png, 585, 420, 120, [245, 158, 11, 255]);
  fillCircle(png, 645, 340, 45, [239, 68, 68, 255]);
  fillRect(png, 430, 760, 28, 120, [120, 53, 15, 255]);
  fillRect(png, 560, 760, 28, 120, [120, 53, 15, 255]);
  fillCircle(png, 618, 418, 12, [17, 24, 39, 255]);

  const out = fs.createWriteStream(path.join(outDir, 'icon.png'));
  png.pack().pipe(out);
}

function createSplash() {
  const size = 2732;
  const png = new PNG({ width: size, height: size });
  fillGradient(png, [255, 249, 239], [255, 237, 213]);

  fillCircle(png, 1366, 1600, 520, [194, 65, 12, 255]);
  fillCircle(png, 1510, 1320, 220, [245, 158, 11, 255]);
  fillCircle(png, 1620, 1170, 80, [239, 68, 68, 255]);
  fillCircle(png, 1572, 1310, 22, [17, 24, 39, 255]);
  fillRect(png, 1210, 2060, 42, 250, [120, 53, 15, 255]);
  fillRect(png, 1470, 2060, 42, 250, [120, 53, 15, 255]);

  const out = fs.createWriteStream(path.join(outDir, 'splash.png'));
  png.pack().pipe(out);
}

createIcon();
createSplash();
