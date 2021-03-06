import Driver from '../src/driver';
import SerialPort from 'serialport';

class MarSurfPS10 extends Driver {
  get name() {
    return 'MarSurf PS 10';
  }

  parseBuffer() {
    this.logger.info(this.buffer);
    var points = this.buffer.replace('\r', '').split(';');

    return {
      RA: points[0],
      RZ: points[1]
    };
  }

  handleData(data) {
    this.logger.debug('received data');

    if (this.status == 'disconnecting') return;
    if (!data || data.length == 0) return;

    const text = data.toString('utf8');

    this.buffer += text;
    if (text.endsWith('\r')) {
      const result = this.parseBuffer();

      this.disconnect();
      this.callback(null, result);
    }
  }

  handleError(error) {
    this.logger.error(error);
    this.callback(error, null);
  }

  takeMeasurement() {
    this.buffer = '';
    this.logger.debug('taking measurement');

    this.port.set({rts: true, dtr: false}, err => {
      if (err) {
        this.logger.error(err);

        this.callback(err, null);
      }
    });
  }

  disconnect() {
    this.status = 'disconnecting';
    this.port.set({rts: false, dtr: false}, err => {
      this.port.close();
    })
  }

  getData(callback) {
    this.status = 'connecting;';
    this.callback = callback;
    this.logger.debug('connecting');

    this.port = new SerialPort('/dev/ttyUSB0', { baudRate: 4800, dataBits: 7, parity: 'even', stopBits: 2});

    this.port.on('data', data => {
      this.handleData(data);
    })
    this.port.on('error', error => {
      this.handleError(error);
    });

    this.port.on('open', x => {
      this.logger.trace('port open');

      this.takeMeasurement();
    });
  }
}

export default new MarSurfPS10();
