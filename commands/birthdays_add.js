const birthdays = require('../data/birthdays');
const birthdayJob = require('../jobs/birthdays');
const {Command} = require('./_base');
const utils = require('../utils');

class SetBirthdayCommand extends Command {
    constructor() {
        super({
                  name: 'bday-add',
                  usage: '"[name]" [day] [month]',
                  args: 3,
                  description: 'Set or update a birthday for yourself or someone in your system.',
              })
    }

    run(message, args) {
        if (!super.run(message, args)) return;
        let responseChannel = this.getResponseChannel(message);
        let [name, day, month] = args.slice(0, 3);
        let user = message.author;
        let today = new Date();
        if (day === today.getDate() && month ===
            today.getMonth() + 1) {
            message.reply('Hey, that\'s today!');
            try {
                birthdayJob.runOnce(message.client, user, name);
            }
            catch (e) {
                console.error(e);
            }
        }
        birthdays.add(user, name, day, month);
        let possessiveName = name.endsWith('s') ? name + "'" : name + "'s";
        let response = `Set ${possessiveName} birthday to ${day} ${utils.monthName(
            month)}.`
        responseChannel.send(response);
    }
}

module.exports = new SetBirthdayCommand();