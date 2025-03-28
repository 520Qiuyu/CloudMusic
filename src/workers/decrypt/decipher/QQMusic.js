import { Status } from '../Deciphers';
import { decryptQMC1, QMC2, QMCFooter } from '@unlock-music/crypto';
import { chunkBuffer } from '../util/buffer.js';
import { UnsupportedSourceFile } from '../util/DecryptError.js';
import { isDataLooksLikeAudio } from '../util/audioType.js';

export class QQMusicV1Decipher {
  constructor() {
    this.cipherName = 'QQMusic/QMC1';
  }

  async decrypt(buffer) {
    const header = buffer.slice(0, 0x20);
    decryptQMC1(header, 0);
    if (!isDataLooksLikeAudio(header)) {
      throw new UnsupportedSourceFile('does not look like QMC file');
    }

    const audioBuffer = new Uint8Array(buffer);
    for (const [block, offset] of chunkBuffer(audioBuffer)) {
      decryptQMC1(block, offset);
    }
    return {
      status: Status.OK,
      cipherName: this.cipherName,
      data: audioBuffer,
    };
  }

  static create() {
    return new QQMusicV1Decipher();
  }
}

export class QQMusicV2Decipher {
  constructor(useUserKey) {
    this.useUserKey = useUserKey;
    this.cipherName = `QQMusic/QMC2(user_key=${+useUserKey})`;
  }

  parseFooter(buffer) {
    const footer = QMCFooter.parse(buffer.subarray(buffer.byteLength - 1024));

    if (footer) {
      const { size, ekey } = footer;
      footer.free();
      return { size, ekey };
    }

    if (!this.useUserKey) {
      throw new UnsupportedSourceFile('Not QMC2 File');
    }

    return { size: 0 };
  }

  async decrypt(buffer, options) {
    const footer = this.parseFooter(buffer.subarray(buffer.byteLength - 1024));
    const ekey = this.useUserKey ? options.qmc2Key : footer.ekey;
    if (!ekey) {
      throw new Error('EKey required');
    }

    const qmc2 = new QMC2(ekey);
    const audioBuffer = buffer.slice(0, buffer.byteLength - footer.size);
    for (const [block, offset] of chunkBuffer(audioBuffer)) {
      qmc2.decrypt(block, offset);
    }
    qmc2.free();

    return {
      status: Status.OK,
      cipherName: this.cipherName,
      data: audioBuffer,
    };
  }

  static createWithUserKey() {
    return new QQMusicV2Decipher(true);
  }

  static createWithEmbeddedEKey() {
    return new QQMusicV2Decipher(false);
  }
}