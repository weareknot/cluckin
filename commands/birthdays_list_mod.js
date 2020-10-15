const birthdays = require('../data/birthdays');
const client = require('discord.js');
const {Command} = require('./_base');


class BirthdayUsersCommand extends Command {
    constructor() {
        super({
                  name: 'bday-users',
                  description: 'List users with a birthday set. Mention a user to search for them.',
                  args: '?',
                  usage: '[user (optional)]'
              });
    }

    run(message, args) {
        if (!super.run(message, args)) return;
        let responseChannel = this.getResponseChannel(message);
        let user = message.mentions.users.size > 0 ? message.mentions.users.first() :
                   undefined;
        birthdays.users(user, (rows) => {
            if (rows.length === 0) {
               responseChannel.send('No birthdays found.')
            }
            else {
                let richEmbed = new client.RichEmbed();
                rows.forEach((r) => {
                    let rowUser = message.client.users.find((u) => {
                        return u.id === r.userid;
                    });
                    let username;
                    if (rowUser === null) {
                        username = 'unknown user';
                    }
                    else {
                        username = rowUser.username;
                    }
                    richEmbed.addField(username, r.names)
                });
               responseChannel.send(richEmbed);
            }
        });
    }
}

module.exports = new BirthdayUsersCommand();
