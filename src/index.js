import UsbManager from './usb-manager';
import BleManager from './ble-manager';
import UsbDeviceService from './ble-services/usb-device-service';
import log4js from 'log4js';
import os from 'os';

log4js.configure({
  appenders: {
    everything: { type: 'dateFile', filename: 'usb-bluetooth-bridge.log'}
  },
  categories: {
    default: { appenders: [ 'everything' ], level: 'debug' }
  }
});

let logger = log4js.getLogger();

const usbManager = new UsbManager();

const usbService = new UsbDeviceService(usbManager);
const bleManager = new BleManager({
  advertisedServiceName: os.hostname(),
  advertisedService: usbService,
  services: [usbService]
});

logger.info('usb-bluetooth-bridge started successfully');