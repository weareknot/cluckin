const client = require('discord.js');
const config = require('../config');
const {Command} = require('./_base');
const {RichEmbed} = require('discord.js');


class StaffMsgUserCommand extends Command {
    constructor() {
        super({
                  name: 'msgstaff',
                  description: 'Send a message to the staff.',
                  args: '*'
              })
    }

    run(message, args) {
        if (!super.run(message, args)) return;
        let responseChannel = this.getResponseChannel(message);
        let user = message.author;
        let userMsg = args.join(' ');
        let msg = `Message from ${user}:\n---\n\n${userMsg}`;
        responseChannel.send(msg);
    }
}

module.exports = new StaffMsgUserCommand();
