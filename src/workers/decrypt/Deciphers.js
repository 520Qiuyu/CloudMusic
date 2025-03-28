import { NetEaseCloudMusicDecipher } from './decipher/NetEaseCloudMusic.js';
import { TransparentDecipher } from './decipher/Transparent.js';
import { QQMusicV1Decipher, QQMusicV2Decipher } from './decipher/QQMusic.js';
import { KuwoMusicDecipher } from './decipher/KuwoMusic.js';
import { KugouMusicDecipher } from './decipher/KugouMusic.js';
import { XimalayaAndroidDecipher, XimalayaPCDecipher } from './decipher/Ximalaya.js';
import { XiamiDecipher } from './decipher/XiamiMusic.js';
import { QignTingFMDecipher } from './decipher/QingTingFM.js';
import { Migu3DKeylessDecipher } from './decipher/Migu3d.js';

export const Status = {
  OK: 0,
  NOT_THIS_CIPHER: 1,
  FAILED: 2,
};

export const allCryptoFactories = [
  /// File with fixed headers goes first.

  // NCM (*.ncm)
  NetEaseCloudMusicDecipher.make,

  // KGM (*.kgm, *.vpr)
  KugouMusicDecipher.make,

  // KWMv1 (*.kwm)
  KuwoMusicDecipher.make,

  // Ximalaya PC (*.xm)
  XimalayaPCDecipher.make,

  // Xiami (*.xm)
  XiamiDecipher.make,

  // QingTingFM Android (*.qta)
  QignTingFMDecipher.make,

  /// File with a fixed footer goes second

  // QMCv2 (*.mflac)
  QQMusicV2Decipher.createWithUserKey,
  QQMusicV2Decipher.createWithEmbeddedEKey,

  /// File without an obvious header or footer goes last.

  // Migu3D/Keyless (*.wav; *.m4a)
  Migu3DKeylessDecipher.make,

  // Crypto that does not implement "checkBySignature" or need to decrypt the entire file and then check audio type,
  //   should be moved to the bottom of the list for performance reasons.

  // QMCv1 (*.qmcflac)
  QQMusicV1Decipher.create,

  // Ximalaya (Android)
  XimalayaAndroidDecipher.makeX2M,
  XimalayaAndroidDecipher.makeX3M,

  // Transparent crypto (not encrypted)
  TransparentDecipher.make,
];