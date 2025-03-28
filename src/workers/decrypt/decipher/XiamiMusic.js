import { Status } from '../Deciphers';
import { Xiami } from '@unlock-music/crypto';
import { chunkBuffer } from '../util/buffer.js';

export class XiamiDecipher {
  constructor() {
    this.cipherName = 'Xiami (XM)';
  }

  async decrypt(buffer) {
    const xm = Xiami.from_header(buffer.subarray(0, 0x10));
    const { copyPlainLength } = xm;
    const audioBuffer = buffer.slice(0x10);

    for (const [block] of chunkBuffer(audioBuffer.subarray(copyPlainLength))) {
      xm.decrypt(block);
    }
    xm.free();

    return {
      cipherName: this.cipherName,
      status: Status.OK,
      data: audioBuffer,
    };
  }

  static make() {
    return new XiamiDecipher();
  }
}