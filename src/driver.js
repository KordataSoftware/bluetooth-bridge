import { promisify } from 'util';

export default class Driver {
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
