const {Monitor} = require('./_base');
const utils = require('../utils');
const {RichEmbed} = require('discord.js');

class LogEditedMonitor extends Monitor {
    constructor() {
        super({
                  name: 'logEdited',
                  description: 'Logs edited messages.',
                  event: 'messageUpdate'
              })
    }

    run(client, oldMessage, newMessage) {
        let channel = utils.getChannel(client, this.channel);
        if (oldMessage.deleted || oldMessage.author.bot) {
            return;
        }
        let richEmbed = new RichEmbed();
        let authorField = oldMessage.author;
        if (oldMessage.member !== null && 'nickname' in oldMessage.member && oldMessage.member.nickname !== null) {
            authorField = authorField + ` (as "${oldMessage.member.nickname}")`
        }
        richEmbed.addField('Author', authorField, false);
        richEmbed.addField('Channel', oldMessage.channel);
        richEmbed.addField('Old Message', oldMessage.content);
        if (oldMessage.content.length + newMessage.content.length >= 900) {
            let richEmbed2 = new RichEmbed();
            richEmbed.setTitle('MESSAGE EDITED [part 1]');
            richEmbed2.setTitle('MESSAGE EDITED [part 2]');
            richEmbed2.addField('Author', authorField, false);
            richEmbed2.addField('Channel', oldMessage.channel);
            richEmbed2.addField('New Message', newMessage.content);
            channel.send(richEmbed);
            channel.send(richEmbed2);
        }
        else {
            richEmbed.setTitle('MESSAGE EDITED');
            richEmbed.addField('New Message', newMessage.content);
            channel.send(richEmbed);
        }
    }
}

module.exports = new LogEditedMonitor();
