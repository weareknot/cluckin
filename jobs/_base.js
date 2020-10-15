const config = require('../config');

class Job {
    constructor(options) {
        this.name = options.name;
        this.description = options.description;
        this.schedule = options.schedule;
    }

    get config(){
        return config.jobOptions[this.name];
    }

    get channel(){
        return config.jobOptions[this.name].channel;
    }

    get printable(){
        let desc = '---\n\n' + this.description;
        let codeblock = '```\n' + this.schedule + '\n```\n\n---';
        return desc + codeblock;
    }

    runOnce(client, args) {
        console.error(`${this.name} has not been implemented.`)
    }

    run(client) {
        let args = null;
        this.runOnce(client, args);
    }
}

module.exports = {
    Job: Job
};