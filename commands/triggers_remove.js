const triggers = require('../data/triggers');
const {Command} = require('./_base');

class RemoveTriggersCommand extends Command {
    constructor() {
        super({
                  name: 'tw-rm',
                  usage: '"[name1]" "[name2 (optional)]" ...',
                  args: '*',
                  description: 'Remove triggers by name.',
              })
    }

    run(message, args) {
        if (!super.run(message, args)) return;
        let responseChannel = this.getResponseChannel(message);
        triggers.remove(args);
        responseChannel.send(`Removed ${args.join(', ')} from the list of triggers.`)
    }
}

module.exports = new RemoveTriggersCommand();