import { PrimaryService } from 'rpi-fix-bleno';
import JsonDataCharacteristic from './json-data-characteristic';

export default class UsbDeviceService extends PrimaryService {
  constructor(usbManager) {
    super({
      uuid: '5500041a7c04480e969e330e32e3ebf1',
      characteristics: [new JsonDataCharacteristic(usbManager)],
    });
  }
}