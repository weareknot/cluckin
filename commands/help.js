const client = require('discord.js');
const config = require('../config');
const {Command} = require('./_base');


class HelpCommand extends Command {
    constructor() {
        super({
                  name: 'help',
                  description: `Get help on ${config.name}'s commands`
              })
    }

    run(message, args) {
        if (!super.run(message, args)) return;
        let responseChannel = this.getResponseChannel(message);
        let user = message.author;
        let richEmbed = new client.RichEmbed();
        richEmbed.setTitle('This is what I can do for you:\n\n---');
        let descriptions = message.client.commands.map((c) => {
            return {
                name: c.name,
                description: c.printable,
                permitted: c.isPermitted(user, message.client)
            }
        }).filter((c) => c.permitted).filter((c, i, a) => {
            return a.map((x) => x.name).indexOf(c.name) === i;
        }).sort((a, b) => {
            return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)
        });
        descriptions.forEach((c) => {
            richEmbed.addField(c.name, c.description)
        });
       responseChannel.send(richEmbed);
       responseChannel.send(`If you have any technical issues with ${config.name}, please ask <@${config.maintainer}>. Please do not put all your faith in ${config.name}. ${config.name} is but a simple bot and will get things wrong sometimes.`)
    }
}

module.exports = new HelpCommand();