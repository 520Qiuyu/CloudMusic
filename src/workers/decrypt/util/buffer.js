export const toArrayBuffer = async (src) =>
  src instanceof Blob ? await src.arrayBuffer() : src;
export const toBlob = (src) =>
  src instanceof Blob ? src : new Blob([src]);

export function* chunkBuffer(buffer, blockLen = 4096) {
  const len = buffer.byteLength;
  for (let i = 0; i < len; i += blockLen) {
    const idxEnd = Math.min(i + blockLen, len);
    const slice = buffer.subarray(i, idxEnd);
    yield [slice, i];
  }
}