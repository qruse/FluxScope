import fs from 'node:fs';
import path from 'node:path';

function getDimensions(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    // PNG
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
    // WebP
    if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
      const type = buf.toString('ascii', 12, 16);
      if (type === 'VP8X') {
        const width = 1 + buf.readUIntLE(24, 3);
        const height = 1 + buf.readUIntLE(27, 3);
        return { width, height };
      }
      if (type === 'VP8 ') {
        const width = buf.readUInt16LE(26) & 0x3fff;
        const height = buf.readUInt16LE(28) & 0x3fff;
        return { width, height };
      }
      if (type === 'VP8L') {
        const b0 = buf[21], b1 = buf[22], b2 = buf[23], b3 = buf[24];
        const width = 1 + (((b1 & 0x3f) << 8) | b0);
        const height = 1 + (((b3 & 0xf) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
        return { width, height };
      }
    }
    // JPEG
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let offset = 2;
      while (offset < buf.length) {
        while (buf[offset] === 0xff) offset++;
        const marker = buf[offset++];
        if (marker === 0xd9 || marker === 0xda) break; // EOI or SOS
        const len = buf.readUInt16BE(offset);
        if (
          marker >= 0xc0 &&
          marker <= 0xc3 ||
          marker >= 0xc5 &&
          marker <= 0xc7 ||
          marker >= 0xc9 &&
          marker <= 0xcb ||
          marker >= 0xcd &&
          marker <= 0xcf
        ) {
          return {
            height: buf.readUInt16BE(offset + 3),
            width: buf.readUInt16BE(offset + 5),
          };
        }
        offset += len;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function rehypeOptimizeImages() {
  return (tree) => {
    function visit(node) {
      if (node.type === 'element' && node.tagName === 'img') {
        node.properties = node.properties || {};
        const src = node.properties.src;
        if (typeof src === 'string' && src.startsWith('/images/')) {
          const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
          const localPath = path.resolve('public', cleanSrc);
          if (fs.existsSync(localPath)) {
            const dims = getDimensions(localPath);
            if (dims) {
              if (!node.properties.width) node.properties.width = dims.width;
              if (!node.properties.height) node.properties.height = dims.height;
            }
          }
        }
        if (!node.properties.loading) {
          node.properties.loading = 'lazy';
        }
        if (!node.properties.decoding) {
          node.properties.decoding = 'async';
        }
      }
      if (Array.isArray(node.children)) {
        for (const child of node.children) {
          visit(child);
        }
      }
    }
    visit(tree);
  };
}
