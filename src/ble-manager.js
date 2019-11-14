import bleno from 'rpi-fix-bleno';
import { getLogger } from 'log4js';

export default class BleManager {
  constructor(settings) {
    this.settings = settings;
    this.logger = getLogger('BleManager');

    try
    {
      bleno.on('stateChange', state => this.onStateChange(state));
      bleno.on('advertisingStart', error => this.onAdvertisingStart(error));
      this.logger.trace('built ble-manager - state: ' + bleno.state);

      if (bleno.state === 'poweredOn')
      {
        this.beginAdvertising();
      }
    }
    catch (err)
    {
      this.logger.error(err);
    }
  }

  beginAdvertising()
  {
    this.logger.trace('attempting to begin advertising');

    bleno.startAdvertising(this.settings.advertisedServiceName, [
      this.settings.advertisedService.uuid,
    ], error => this.logger.debug('startAdvertising: ' + (error ? 'error ' + error : 'success')));
  }

  onStateChange(state) {
    this.logger.trace('stateChange: ' + state);

    if (state === 'poweredOn') {
      this.beginAdvertising();
    } else {
      bleno.stopAdvertising();
    }
  }

  onAdvertisingStart(error) {
    this.logger.debug('advertising start: '+ (error ? 'error ' + error : 'success')); 

    if (!error) {
      bleno.setServices(this.settings.services, error => {
        this.logger.debug('setServices: '+ (error ? 'error ' + error : 'success'));
      });
    }
  }
}
