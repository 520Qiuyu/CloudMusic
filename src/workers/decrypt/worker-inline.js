import { getUmcVersion } from "@unlock-music/crypto";
import { DECRYPTION_WORKER_ACTION_NAME } from "./constants";
import { workerDecryptHandler } from "../../utils/parser/decrypt";
import { workerParseMusicExMediaName } from "../../utils/parser/qmcv2_parser";
import { workerParseKuwoHeader } from "../../utils/parser/kuwo_header_parse";
import { workerParseKugouHeader } from "../../utils/parser/kugou_parse_header";

const bus = new WorkerServerBus();
onmessage = bus.onmessage;

// 处理文件解密的主要处理器，负责对加密的音乐文件进行解密操作
bus.addEventHandler(DECRYPTION_WORKER_ACTION_NAME.DECRYPT, workerDecryptHandler);
// 解析QMC格式音乐文件的媒体名称，用于获取正确的文件名
bus.addEventHandler(
  DECRYPTION_WORKER_ACTION_NAME.FIND_QMC_MUSICEX_NAME,
  workerParseMusicExMediaName
);
// 获取解密模块(@unlock-music/crypto)的版本信息
bus.addEventHandler(DECRYPTION_WORKER_ACTION_NAME.VERSION, getUmcVersion);
// 解析酷我音乐文件的头部信息，获取音质ID和资源ID
bus.addEventHandler(DECRYPTION_WORKER_ACTION_NAME.KUWO_PARSE_HEADER, workerParseKuwoHeader);
// 解析酷狗音乐文件的头部信息，用于后续解密
bus.addEventHandler(DECRYPTION_WORKER_ACTION_NAME.KUGOU_PARSE_HEADER, workerParseKugouHeader);
// 生成蜻蜓FM的设备密钥，用于解密蜻蜓FM的音频文件
bus.addEventHandler(
  DECRYPTION_WORKER_ACTION_NAME.QINGTING_FM_GET_DEVICE_KEY,
  workerGetQtfmDeviceKey
);