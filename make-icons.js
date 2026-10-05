// Generates icon-192.png and icon-512.png (orange tile with a white clipboard glyph). Run: node make-icons.js
const fs = require('fs'), zlib = require('zlib');

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(size, pixel) {
  const raw = Buffer.alloc((size * 3 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const [r, g, b] = pixel(x / size, y / size);
      const i = y * (size * 3 + 1) + 1 + x * 3;
      raw[i] = r; raw[i + 1] = g; raw[i + 2] = b;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
const inRect = (x, y, x0, y0, x1, y1) => x >= x0 && x <= x1 && y >= y0 && y <= y1;
function pixel(x, y) {
  const ORANGE = [217, 102, 31], WHITE = [255, 255, 255], DARK = [31, 36, 40];
  // clipboard body
  if (inRect(x, y, 0.28, 0.26, 0.72, 0.78)) {
    // lines on the clipboard
    for (const ly of [0.46, 0.56, 0.66]) if (inRect(x, y, 0.36, ly, ly === 0.66 ? 0.56 : 0.64, ly + 0.035)) return DARK;
    return WHITE;
  }
  if (inRect(x, y, 0.41, 0.21, 0.59, 0.31)) return DARK; // clip
  return ORANGE;
}
for (const s of [192, 512]) fs.writeFileSync(`icon-${s}.png`, png(s, pixel));
console.log('icons written');
