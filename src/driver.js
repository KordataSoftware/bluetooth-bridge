import { promisify } from 'util';
import { getLogger } from 'log4js';

export default class Driver {
  constructor() {
    this.logger = getLogger(this.name);
  }

  get name() {
    return undefined;
  }

  getDataAsync() {
    return new Promise((resolve, reject) => {
      this.getData((err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    });
  }

  getDeviceInformation() {}

  getData(callback) {
    console.log('base');
  }
}
