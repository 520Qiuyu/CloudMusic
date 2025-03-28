import { Status } from '../Deciphers.js';
import { KuGou, KuGouHeader } from '@unlock-music/crypto';
import { chunkBuffer } from '../util/buffer.js';

export class KugouMusicDecipher {
  cipherName = 'Kugou';

  async decrypt(buffer, options) {
    let kgm;
    let kgmHdr;

    try {
      kgmHdr = new KuGouHeader(buffer.subarray(0, 0x400));
      kgm = KuGou.fromHeaderV5(kgmHdr, options.kugouKey);

      const audioBuffer = new Uint8Array(buffer.subarray(0x400));
      for (const [block, offset] of chunkBuffer(audioBuffer)) {
        kgm.decrypt(block, offset);
      }

      return {
        status: Status.OK,
        cipherName: this.cipherName,
        data: audioBuffer,
      };
    } finally {
      kgmHdr?.free();
      kgm?.free();
    }
  }

  static make() {
    return new KugouMusicDecipher();
  }
}