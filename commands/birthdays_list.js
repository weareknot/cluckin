const birthdays = require('../data/birthdays');
const client = require('discord.js');
const utils = require('../utils');
const {Command} = require('./_base');


class OurBirthdaysCommand extends Command {
    constructor() {
        super({
                  name: 'bday-list',
                  description: 'List the birthdays you have set (sends in a DM!)'
              })
    }

    run(message, args) {
        if (!super.run(message, args)) return;
        let responseChannel = this.getResponseChannel(message);
        let user = message.author;
        birthdays.ours(user, (rows) => {
                     if (rows.length === 0) {
                         responseChannel.send('You don\'t have any birthdays set.')
                     } else {
                         for (let i=0;i<rows.length;i+=25) {
                             let rowChunk = rows.slice(i, i+25);
                             let richEmbed = new client.RichEmbed();
                             richEmbed.setTitle('These are the birthdays I know about:');
                             rowChunk.forEach((r) => {
                                 richEmbed.addField(r.names,
                                                    `${r.day} ${utils.monthName(r.month)}`,
                                                    true)
                             });
                             responseChannel.send(richEmbed);
                         }
                     }
                 });
    }
}

module.exports = new OurBirthdaysCommand();
