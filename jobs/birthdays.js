const birthdays = require('../data/birthdays');
const ejs = require('ejs');
const config = require('../config');
const utils = require('../utils');
const {Job} = require('./_base');


class BirthdaysToday extends Job {
    constructor() {
        super({
                  name: 'birthdaysToday',
                  description: 'Say happy birthday',
                  schedule: '0 0 12 * * *',
              })
    }

    runOnce(client, user, name) {
        let channel = utils.getChannel(client, this.channel, user, null);
        let randomMsg = this.config.messages[Math.floor(
            Math.random() * this.config.messages.length)];
        let renderedMsg = ejs.render(randomMsg,
                                     {name: name, user: user});
        channel.send(renderedMsg);
    };

    run(client) {
        birthdays.today((row) => {
            client.fetchUser(row.userid).then((user) => {
                this.runOnce(client, user, row.name)
            }, (e) => {
                console.error(e)
            });
        });
    };
}


module.exports = new BirthdaysToday();