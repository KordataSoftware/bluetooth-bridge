import UsbManager from './usb-manager';
import BleManager from './ble-manager';
import UsbDeviceService from './ble-services/usb-device-service';
import ConsoleTrigger from './console-trigger';
import log4js from 'log4js';
import os from 'os';
import minimist from 'minimist';

log4js.configure({
  appenders: {
    everything: { type: 'dateFile', filename: 'usb-bluetooth-bridge.log'}
  },
  categories: {
    default: { appenders: [ 'everything' ], level: 'debug' }
  }
});

let logger = log4js.getLogger();

var argv = minimist(process.argv.slice(3));

const usbManager = new UsbManager();

if (argv.m == 'bluetooth')
{
  logger.info('using bluetooth manager');
  const usbService = new UsbDeviceService(usbManager);
  const bleManager = new BleManager({
    advertisedServiceName: os.hostname(),
    advertisedService: usbService,
    services: [usbService]
  });
}
else
{
  logger.info('using console trigger');
  const consoleTrigger = new ConsoleTrigger(usbManager);
}


logger.info('usb-bluetooth-bridge started successfully');