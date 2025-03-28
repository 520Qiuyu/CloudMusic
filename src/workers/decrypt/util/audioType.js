import { detectAudioType } from '@unlock-music/crypto';

export function detectAudioExtension(buffer) {
  let neededLength = 0x100;
  let extension = 'bin';
  while (neededLength !== 0) {
    console.debug('AudioDetect: read %d bytes', neededLength);
    const detectResult = detectAudioType(buffer.subarray(0, neededLength));
    extension = detectResult.audioType;
    neededLength = detectResult.needMore;
    detectResult.free();
  }
  return extension;
}

export function isDataLooksLikeAudio(buffer) {
  if (buffer.byteLength < 0x20) {
    return false;
  }
  const detectResult = detectAudioType(buffer.subarray(0, 0x20));

  const ok = detectResult.needMore !== 0 || detectResult.audioType !== 'bin';
  detectResult.free();
  return ok;
}