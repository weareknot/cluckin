const config = require('../config');
const utils = require('../utils');
const {Job} = require('./_base');


class KeepAlive extends Job {
    constructor() {
        super({
                  name: 'keepAlive',
                  description: 'Type every 5 minutes to keep the bot alive',
                  schedule: '0 */5 * * * *',
              })
    }

    runOnce(client) {
        let channel = utils.getChannel(client, config.botChannel);
        channel.startTyping();
        setTimeout(() => {channel.stopTyping()}, 1000);
    };

    run(client) {
        this.runOnce(client)
    };
}


module.exports = new KeepAlive();
