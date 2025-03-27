import { QingTingFM } from '@unlock-music/crypto';
import { hex } from '~/util/hex.ts';

export async function workerGetQtfmDeviceKey({
  device,
  brand,
  model,
  product,
  manufacturer,
  board,
}) {
  const buffer = QingTingFM.getDeviceKey(device, brand, model, product, manufacturer, board);
  return hex(buffer);
}
