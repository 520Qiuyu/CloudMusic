import { Status } from '../Deciphers';
import { KuwoHeader, KWMDecipher } from '@unlock-music/crypto';
import { chunkBuffer } from '../util/buffer.js';

export class KuwoMusicDecipher {
  constructor() {
    this.cipherName = 'Kuwo';
  }

  async decrypt(buffer, options) {
    let header;
    let kwm;

    try {
      header = KuwoHeader.parse(buffer.subarray(0, 0x400));
      kwm = new KWMDecipher(header, options.kwm2key);

      const audioBuffer = new Uint8Array(buffer.subarray(0x400));
      for (const [block, offset] of chunkBuffer(audioBuffer)) {
        kwm.decrypt(block, offset);
      }
      return {
        status: Status.OK,
        cipherName: this.cipherName,
        data: audioBuffer,
      };
    } finally {
      kwm?.free();
      header?.free();
    }
  }

  static make() {
    return new KuwoMusicDecipher();
  }
}