import UsbManager from './usb-manager';
import BleManager from './ble-manager';
import UsbDeviceService from 'ble-services/usb-device-service';

const usbManager = new UsbManager();

const usbService = new UsbDeviceService(usbManager);
const bleManager = new BleManager({
  advertisedServiceName: 'usb-devices',
  advertisedService: usbService,
  services: [usbService]
});