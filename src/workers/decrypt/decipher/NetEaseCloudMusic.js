import { Status } from '../Deciphers';
import { NCMFile } from '@unlock-music/crypto';
import { chunkBuffer } from '../util/buffer.js';
import { UnsupportedSourceFile } from '../util/DecryptError.js';

export class NetEaseCloudMusicDecipher {
  constructor() {
    this.cipherName = 'NCM/PC';
  }

  tryInit(ncm, buffer) {
    let neededLength = 1024;
    while (neededLength !== 0) {
      console.debug('NCM/open: read %d bytes', neededLength);
      neededLength = ncm.open(buffer.subarray(0, neededLength));
      if (neededLength === -1) {
        throw new UnsupportedSourceFile('file is not ncm');
      }
    }
  }

  async decrypt(buffer) {
    const ncm = new NCMFile();
    try {
      this.tryInit(ncm, buffer);

      const audioBuffer = buffer.slice(ncm.audioOffset);
      for (const [block, offset] of chunkBuffer(audioBuffer)) {
        ncm.decrypt(block, offset);
      }
      return {
        status: Status.OK,
        cipherName: this.cipherName,
        data: audioBuffer,
      };
    } finally {
      ncm.free();
    }
  }

  static make() {
    return new NetEaseCloudMusicDecipher();
  }
}