import { Status } from '../Deciphers';

export class TransparentDecipher {
  constructor() {
    this.cipherName = 'none';
  }

  async decrypt(buffer) {
    return {
      cipherName: 'None',
      status: Status.OK,
      data: buffer,
      message: 'No decipher applied',
    };
  }

  static make() {
    return new TransparentDecipher();
  }
}