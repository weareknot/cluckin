const config = require('../config');

class Monitor {
    constructor(options) {
        this.name = options.name;
        this.description = options.description;
        this.event = options.event;
    }

    get channel(){
        return config.monitorOptions[this.name].channel;
    }

    get printable(){
        let desc = '---\n\n' + this.description;
        let codeblock = '```\n' + this.event + '\n```\n\n---';
        return desc + codeblock;
    }

    run(client, eventData) {
        console.log(eventData);
    }
}

module.exports = {
    Monitor: Monitor
};