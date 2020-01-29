import Driver from '../src/driver';
import usb from 'usb';

const takeMeasurementCommand = 'R\r\n';
const knownDeviceIds = [52741, 52745];

class RhopointIq extends Driver {
  get name() {
    return 'Rhopoint Iq';
  }

  parseBuffer(text) {
    this.logger.info(this.buffer);

    return this.buffer
      .split('\r\n')
      .map(line => line.split('='))
      .filter(tokens => tokens[1])
      .reduce((acc, current) => {
        acc[current[0]] = current[1];
        return acc;
      }, {});
  }

  handleData(data) {
    this.logger.debug('received data');

    if (this.status == 'disconnecting') return;
    if (!data || data.length == 0) return;

    const text = data.toString('utf8');

    this.buffer += text;
    if (text.endsWith('\r\n>')) {
      const result = this.parseBuffer();
      this.disconnect();
      this.callback(null, result);
    }

    if (text.includes('Error')) {
      this.logger.error(this.buffer);

      this.disconnect();
      this.callback(this.buffer, null);
    }
  }

  handleError(error) {
    this.logger.error(error);

    this.callback(error, null);
  }

  takeMeasurement() {
    this.buffer = '';
    this.logger.debug('taking measurement');

    this.outEndpoint.transfer(Buffer.from(takeMeasurementCommand), err => {
      if (err) {
        this.logger.error(err);

        this.callback(err, null);
      }
    });
  }

  disconnect() {
    this.status = 'disconnecting';
    this.inEndpoint.stopPoll(() => {
      this.deviceInterface.release(() => {
        this.term.close();
      });
    });
  }

  getData(callback) {
    this.status = 'connecting;';
    this.callback = callback;
    this.logger.debug('connecting');

    // Try to find the device based on all the known IDs
    // it could have
    for (const devId of knownDeviceIds)
    {
      this.term = usb.findByIds(6588, devId);
      if (this.term != null) break;
    }

    // If we couldn't find it, error out
    if (!this.term) {
      this.logger.warn('device not found');

      callback('Device not found', null);
    }

    this.term.open();
    this.logger.debug('opened connection');

    this.deviceInterface = this.term.interfaces[1];

    if (this.deviceInterface.isKernelDriverActive()) {
      this.deviceInterface.detachKernelDriver();
    }

    this.deviceInterface.claim();
    this.logger.debug('claimed interface');

    const endpoints = this.term.interfaces[1].endpoints;

    this.inEndpoint = endpoints[0];
    this.outEndpoint = endpoints[1];

    this.inEndpoint.transferType = 2;
    this.inEndpoint.startPoll(1, 2048);

    this.inEndpoint.on('data', data => {
      this.handleData(data);
    });
    this.inEndpoint.on('error', error => {
      this.handleError(error);
    });

    this.status = 'connected';
    this.takeMeasurement();
  }
}

export default new RhopointIq();
