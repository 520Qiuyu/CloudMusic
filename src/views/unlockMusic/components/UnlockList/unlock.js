import { nanoid } from "nanoid";
import { workerParseKuwoHeader } from "@/utils/parser/kuwo_header_parse";
import { workerParseMusicExMediaName } from "@/utils/parser/qmcv2_parser";
import { workerParseKugouHeader } from "@/utils/parser/kugou_parse_header";
import { ready as umCryptoReady } from "@unlock-music/crypto";
import { allCryptoFactories } from "../../../../workers/decrypt/Deciphers";

/**
 * 解密加密的音乐文件
 * @param {File} file - 需要解密的音乐文件，支持的格式包括：
 *   - 网易云音乐(ncm)
 *   - QQ音乐(qmc, mflac, mgg)
 *   - 酷狗音乐(kgm)
 *   - 虾米音乐(xm)
 *   - 酷我音乐(kwm)
 * @returns {Promise<Object>} 解密后的文件信息
 *   - {string} name - 解密后的文件名
 *   - {Blob} data - 解密后的文件数据
 * @throws {Error} 当文件格式不支持或解密过程出错时抛出错误
 */
export default async function unlock(file) {
  try {
    const blobURI = URL.createObjectURL(file);
    const fileName = file.name;
    const fileId = "file://" + nanoid();

    debugger;
    // 分别解析不同格式的音乐文件头信息
    const [qmcv2MusicExMediaFile, kuwoHdr, kugouHdr] = await Promise.all([
      workerParseMusicExMediaName({ blobURI }),
      workerParseKuwoHeader({ blobURI }),
      workerParseKugouHeader({ blobURI }),
    ]);
    console.log("头信息", qmcv2MusicExMediaFile, kuwoHdr, kugouHdr);

    const options = {
      fileName,
      /* qmc2Key: selectQMCv2KeyByFileName(state, qmcv2MusicExMediaFile || file.fileName),
      kwm2key: selectKWMv2Key(state, kuwoHdr),
      kugouKey: selectKugouKey(state, kugouHdr),
      qingTingAndroidKey: selectQtfmAndroidKey(state), */
    };

    await umCryptoReady;
    const buffer = await fetch(blobURI).then(r => r.arrayBuffer());
    for (const factory of allCryptoFactories) {
      try {
        const decipher = factory();

        const result = await tryDecryptWith(decipher, new Uint8Array(buffer), options);
        if (result) {
          return result;
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    return null;
  } catch (error) {
    console.log("error", error);
  }
}

const Status = {
  OK: 0,
  NOT_THIS_CIPHER: 1,
  FAILED: 2,
};
async function tryDecryptWith(decipher, buffer, options) {
  try {
    const result = await decipher.decrypt(buffer, options);
    switch (result.status) {
      case Status.NOT_THIS_CIPHER:
        return null;
      case Status.FAILED:
        throw new Error(`failed: ${result.message}`);
      default:
        break;
    }
  } catch (error) {
    console.log("error", error);
  }
}
