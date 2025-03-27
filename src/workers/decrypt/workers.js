import { getUmcVersion } from "@unlock-music/crypto";
import { DECRYPTION_WORKER_ACTION_NAME } from "./constants";
import { workerDecryptHandler } from "./parser/decrypt";
import { workerParseMusicExMediaName } from "./parser/qmcv2_parser";
import { workerParseKuwoHeader } from "./parser/kuwo_header_parse";
import { workerParseKugouHeader } from "./parser/kugou_parse_header";

const bus = new WorkerServerBus();
onmessage = bus.onmessage;

bus.addEventHandler(DECRYPTION_WORKER_ACTION_NAME.DECRYPT, workerDecryptHandler);
bus.addEventHandler(
  DECRYPTION_WORKER_ACTION_NAME.FIND_QMC_MUSICEX_NAME,
  workerParseMusicExMediaName
);
bus.addEventHandler(DECRYPTION_WORKER_ACTION_NAME.VERSION, getUmcVersion);
bus.addEventHandler(DECRYPTION_WORKER_ACTION_NAME.KUWO_PARSE_HEADER, workerParseKuwoHeader);
bus.addEventHandler(DECRYPTION_WORKER_ACTION_NAME.KUGOU_PARSE_HEADER, workerParseKugouHeader);
bus.addEventHandler(
  DECRYPTION_WORKER_ACTION_NAME.QINGTING_FM_GET_DEVICE_KEY,
  workerGetQtfmDeviceKey
);
