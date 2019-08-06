import { Characteristic, Descriptor } from 'rpi-fix-bleno';

export default class JsonDataCharacteristic extends Characteristic {
  constructor(usbManager) {
    super({
      uuid: '95b372715d044dd2b7a4700d9d2cf0e5',
      properties: ['read'],
      descriptors: [
        new Descriptor({
          uuid: '2901',
          value:
            'Tells connected USB devices to take a measurement and returns the aggregated data.',
        }),
      ],
    });

    this.usbManager = usbManager;
    console.log('built json characteristic');
  }

  async onReadRequest(offset, callback) {
    if (offset > 0) {
      if (!this.buffer || offset > this.buffer.length) {
        callback(this.RESULT_INVALID_OFFSET, null);
      }

      callback(this.result, this.buffer.slice(offset));
      return;
    }

    try {
      const data = await this.usbManager.getData();

      this.result = this.RESULT_SUCCESS;
      this.buffer = Buffer.from(JSON.stringify(data));
    } catch (e) {
      const data = {
        error: e,
      };

      this.result = this.RESULT_UNLIKELY_ERROR;
      this.buffer = Buffer.from(JSON.stringify(result));
    }

    callback(this.result, this.buffer);
  }
}
