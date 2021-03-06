import * as drivers from '../drivers';
import { getLogger } from 'log4js';

export default class UsbManager {
  constructor() {
    this.logger = getLogger('UsbManager');
  }

  listDevices() {
    return Promise.all(drivers.values.map(d => d.getDeviceInfo()));
  }

  async getData() {
    if (this.isGettingData) {
      this.logger.warn('tried to enter getData while it was running');
      return {};
    }

    this.isGettingData = true;

    this.logger.debug('get data');

    const driverObjects = Object.keys(drivers).map(k => drivers[k]);
    
    let promises = driverObjects.map(driver => driver
        .getDataAsync()
        .catch(err => this.logger.error(err))
    );

    let results = await Promise.all(promises);
    
    let finalResult = results
      .filter(result => result)
      .reduce((combined, result) => Object.assign(combined, result), {});

    this.isGettingData = false;
    return finalResult;
  }
}