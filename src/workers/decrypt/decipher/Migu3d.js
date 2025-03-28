import { Status } from '../Deciphers';
import { chunkBuffer } from '../util/buffer.js';
import { Migu3D } from '@unlock-music/crypto';

export class Migu3DKeylessDecipher {
  constructor() {
    this.cipherName = 'Migu3D (Keyless)';
  }

  async decrypt(buffer) {
    const mg3d = Migu3D.fromHeader(buffer.subarray(0, 0x100));
    const audioBuffer = new Uint8Array(buffer);

    for (const [block, i] of chunkBuffer(audioBuffer)) {
      mg3d.decrypt(block, i);
    }
    mg3d.free();

    return {
      cipherName: this.cipherName,
      status: Status.OK,
      data: audioBuffer,
    };
  }

  static make() {
    return new Migu3DKeylessDecipher();
  }
}