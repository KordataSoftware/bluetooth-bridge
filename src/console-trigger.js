import readline from 'readline';
import { Logger } from 'log4js';
import { getLogger } from 'log4js';

export default class ConsoleTrigger {
    constructor(usbManager)
    {
        this.usbManager = usbManager;
        this.logger = getLogger('ConsoleTrigger');

        this.beginListening();
    }

    beginListening()
    {
        this.rl = readline.createInterface({
            input: process.stdin
        });

        this.rl.on('line', async (input) => {
           var data = await this.usbManager.getData();
           console.log('Got Data');
           console.log(data);
        });
    }
}