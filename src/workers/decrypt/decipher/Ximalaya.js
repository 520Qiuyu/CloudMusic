import { Status } from '../Deciphers';
import { decryptX2MHeader, decryptX3MHeader, XmlyPC } from '@unlock-music/crypto';
import { isDataLooksLikeAudio } from '../util/audioType.js';
import { UnsupportedSourceFile } from '../util/DecryptError.js';

export class XimalayaAndroidDecipher {
  constructor(decipher, cipherType) {
    this.decipher = decipher;
    this.cipherType = cipherType;
    this.cipherName = `Ximalaya (Android, ${cipherType})`;
  }

  async decrypt(buffer, _options) {
    // Detect with first 0x400 bytes
    const slice = buffer.slice(0, 0x400);
    this.decipher(slice);
    if (!isDataLooksLikeAudio(slice)) {
      throw new UnsupportedSourceFile(`Not a Xmly android file (${this.cipherType})`);
    }
    const result = new Uint8Array(buffer);
    result.set(slice, 0);
    return {
      cipherName: this.cipherName,
      status: Status.OK,
      data: result,
    };
  }

  static makeX2M() {
    return new XimalayaAndroidDecipher(decryptX2MHeader, 'X2M');
  }

  static makeX3M() {
    return new XimalayaAndroidDecipher(decryptX3MHeader, 'X3M');
  }
}

export class XimalayaPCDecipher {
  constructor() {
    this.cipherName = 'Ximalaya (PC)';
  }

  async decrypt(buffer, _options) {
    // Detect with first 0x400 bytes
    const headerSize = XmlyPC.getHeaderSize(buffer.subarray(0, 1024));
    const xm = new XmlyPC(buffer.subarray(0, headerSize));
    const { audioHeader, encryptedHeaderOffset, encryptedHeaderSize } = xm;
    const plainAudioDataOffset = encryptedHeaderOffset + encryptedHeaderSize;
    const plainAudioDataLength = buffer.byteLength - plainAudioDataOffset;
    const encryptedAudioPart = buffer.slice(encryptedHeaderOffset, plainAudioDataOffset);
    const encryptedAudioPartLen = xm.decrypt(encryptedAudioPart);
    const audioSize = audioHeader.byteLength + encryptedAudioPartLen + plainAudioDataLength;
    xm.free();

    const result = new Uint8Array(audioSize);
    result.set(audioHeader);
    result.set(encryptedAudioPart, audioHeader.byteLength);
    result.set(buffer.subarray(plainAudioDataOffset), audioHeader.byteLength + encryptedAudioPartLen);
    return {
      status: Status.OK,
      data: result,
      cipherName: this.cipherName,
    };
  }

  static make() {
    return new XimalayaPCDecipher();
  }
}