import Driver from '../src/driver';
import usb from 'usb';

const takeMeasurementCommand = 'R\r\n';

class RhopointIq extends Driver {
  get name() {
    return 'Rhopoint Iq';
  }

  parseBuffer(text) {
    console.log(this.buffer);

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
    if (this.status == 'disconnecting') return;
    if (!data || data.length == 0) return;

    const text = data.toString('utf8');
    //console.log(data.toString('hex'));
    //console.log(text);

    this.buffer += text;
    if (text.endsWith('\r\n>')) {
      const result = this.parseBuffer();
      this.disconnect();
      this.callback(null, result);
    }

    if (text.includes('Error')) {
      this.disconnect();
      this.callback(this.buffer, null);
    }
  }

  handleError(error) {
    this.callback(error, null);
  }

  takeMeasurement() {
    this.buffer = '';
    this.outEndpoint.transfer(Buffer.from(takeMeasurementCommand), err => {
      if (err) {
        this.callback(err, null);
      }
    });
  }

  disconnect() {
    this.status = 'disconnecting';
    this.inEndpoint.stopPoll(() => {
      this.term.close();
    });
  }

  getData(callback) {
    this.status = 'connecting;';
    this.callback = callback;
    const devices = usb.getDeviceList();
    //console.log(devices);

    this.term = usb.findByIds(6588, 52741);
    if (!this.term) {
      callback('Device not found', null);
    }
    this.term.open();

    // console.log('Interfaces: ' + term.interfaces.length);

    // for (var i = 0; i < term.interfaces.length; i++) {
    //     for (var j = 0; j < term.interfaces[i].endpoints.length; j++) {
    //         console.log('Interface ' + i + ' Endpoint ' + j + ' ' + term.interfaces[i].endpoints[j].direction);
    //     }
    // }

    this.term.interfaces[1].claim();
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
