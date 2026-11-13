// Preserve media bytes and chunk offsets while removing QuickTime metadata.
// Only accepts bounded, structurally valid ISO BMFF / QuickTime atoms.
export function sanitizeVideo(source) {
  const output = Buffer.from(source);
  const containers = new Set(['moov', 'trak', 'mdia', 'minf', 'stbl', 'edts', 'dinf']);
  function walk(start, end) {
    for (let offset = start; offset < end;) {
      if (end - offset < 8) throw new Error('Truncated movie atom');
      let size = output.readUInt32BE(offset), header = 8;
      const type = output.toString('latin1', offset + 4, offset + 8);
      if (size === 1) { size = Number(output.readBigUInt64BE(offset + 8)); header = 16; }
      if (size === 0) size = end - offset;
      if (!Number.isSafeInteger(size) || size < header || offset + size > end) throw new Error('Invalid movie atom');
      const body = offset + header;
      if (['udta', 'meta', 'uuid'].includes(type)) {
        output.write('free', offset + 4, 4, 'latin1');
        output.fill(0, body, offset + size);
      } else if (containers.has(type)) {
        walk(body, offset + size);
      } else if (['mvhd', 'tkhd', 'mdhd'].includes(type)) {
        const length = output[body] === 1 ? 16 : 8;
        if (body + 4 + length > offset + size) throw new Error('Truncated movie timestamps');
        output.fill(0, body + 4, body + 4 + length);
      }
      offset += size;
    }
  }
  walk(0, output.length);
  return output;
}
