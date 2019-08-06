import bleno from 'rpi-fix-bleno';

export default class BleManager {
  constructor(settings) {
    this.settings = settings;
    bleno.on('stateChange', state => this.onStateChange(state));
    bleno.on('advertisingStart', error => this.onAdvertisingStart(error));
    console.log('built le-manager');
  }

  onStateChange(state) {
    console.log('stateChange: ' + state);

    if (state === 'poweredOn') {
      bleno.startAdvertising(this.settings.advertisedServiceName, [
        this.settings.advertisedService.uuid,
      ]);
    } else {
      bleno.stopAdvertising();
    }
  }

  onAdvertisingStart(error) {
    console.log(
      'on -> advertisingStart: ' + (error ? 'error ' + error : 'success')
    );

    if (!error) {
      bleno.setServices(this.settings.services, error => {
        console.log('setServices: ' + (error ? 'error ' + error : 'success'));
      });
    }
  }
}
