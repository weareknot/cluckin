const birthdays = require('../data/birthdays');
const {Command} = require('./_base');

class RemoveBirthdayCommand extends Command {
    constructor() {
        super({
                  name: 'bday-rm',
                  usage: '"[name1 (optional)]" "[name2 (optional)]" ...',
                  args: '*',
                  description: 'Remove registered birthdays. Leave blank to remove all of them; list names to remove only specific ones.',
              })
    }

    run(message, args) {
        if (!super.run(message, args)) return;
        let responseChannel = this.getResponseChannel(message);
        let names = args.length >= 1 ? args : undefined;
        let user = message.author;
        birthdays.remove(user, names);
        let response = `Removed ${names === undefined ? 'everything' : names.join(', ')} from your list of birthdays`;
       responseChannel.send(response);
    }
}

module.exports = new RemoveBirthdayCommand();