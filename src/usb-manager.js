import * as drivers from '../drivers';

export default class UsbManager {
  listDevices() {
    return Promise.all(drivers.values.map(d => d.getDeviceInfo()));
  }

  async getData() {
    const driverObjects = Object.keys(drivers).map(k => drivers[k]);

    let promises = driverObjects.map(driver => driver
        .getDataAsync()
        .catch(err => console.log(err))
    );

    let results = await Promise.all(promises);
    
    let finalResult = results
      .filter(result => result)
      .reduce((combined, result) => Object.assign(combined, result), {});

    return finalResult;
  }
}