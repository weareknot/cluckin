const config = require('../config');
const utils = require('../utils');

class Command {
    constructor(options) {
        this.name = options.name;
        this.description = options.description;
        this.args = options.args || 0;
        this.usage = config.prefix + this.name + ' ' + (options.usage || '');
    }

    get aliases() {
        return [this.name].concat(config.commandOptions[this.name].aliases);
    }

    get channel() {
        return config.commandOptions[this.name].channel;
    }

    get roles() {
        return config.commandOptions[this.name].roles;
    }

    get printable() {
        let desc = '---\n\n' + this.description;
        let codeblock = '```\n' + this.usage + '\n```\n\n---';
        return desc + codeblock;
    }

    isPermitted(user, client) {
        if (this.roles.length === 0 || user.id === config.maintainer) {
            return true;
        } else {
            let server = client.guilds.find((c) => {
                return c.id === config.primaryServer
            });
            let userRoles = server.member(user).roles;
            let intersection = new Set(
                userRoles.filter(x => {
                    return this.roles.includes(x.name)
                }));
            return intersection.size > 0;
        }
    }

    run(message, args) {
        let isPermitted = this.isPermitted(message.author, message.client);
        if (!isPermitted) {
            message.author.send('You don\'t have permission to do that.')
        }
        return isPermitted;
    }

    getResponseChannel(ogMessage) {
        return utils.getChannel(ogMessage.client, this.channel,
                                               ogMessage.author, ogMessage.channel);
    }
}

module.exports = {
    Command: Command
};
