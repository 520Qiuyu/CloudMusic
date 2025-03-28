import { Status } from '../Deciphers';
import { QingTingFM } from '@unlock-music/crypto';
import { chunkBuffer } from '../util/buffer.js';
import { unhex } from '../util/hex.js';

export class QignTingFMDecipher {
  constructor() {
    this.cipherName = 'QingTingFM (Android, qta)';
  }

  async decrypt(buffer, opts) {
    const key = unhex(opts.qingTingAndroidKey || '');
    const iv = QingTingFM.getFileIV(opts.fileName);

    if (key.byteLength !== 16 || iv.byteLength !== 16) {
      return {
        status: Status.FAILED,
        message: 'device key or iv invalid',
      };
    }

    const qtfm = new QingTingFM(key, iv);
    const audioBuffer = new Uint8Array(buffer);
    for (const [block, i] of chunkBuffer(audioBuffer)) {
      qtfm.decrypt(block, i);
    }

    return {
      cipherName: this.cipherName,
      status: Status.OK,
      data: audioBuffer,
    };
  }

  static make() {
    return new QignTingFMDecipher();
  }
}