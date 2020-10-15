const {Monitor} = require('./_base');
const utils = require('../utils');
const {RichEmbed} = require('discord.js');

class LogDeletedMonitor extends Monitor {
    constructor() {
        super({
                  name: 'logDeleted',
                  description: 'Logs deleted messages.',
                  event: 'messageDelete'
              })
    }

    run(client, eventData) {
        let channel = utils.getChannel(client, this.channel);
        let richEmbed = new RichEmbed();
        richEmbed.setTitle('MESSAGE DELETED');
        let authorField = eventData.author;
        if ('nickname' in eventData.member && eventData.member.nickname !== null) {
            authorField = authorField + ` (as "${eventData.member.nickname}")`
        }
        richEmbed.addField('Author', authorField || 'Unknown author (somehow)', false);
        richEmbed.addField('Channel', eventData.channel || 'Unknown channel');
        richEmbed.addField('Message', eventData.content || 'Content mysteriously missing');
        channel.send(richEmbed);
    }
}

module.exports = new LogDeletedMonitor();
