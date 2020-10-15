const triggers = require('../data/triggers');
const client = require('discord.js');
const utils = require('../utils');
const {Command} = require('./_base');


class SearchTriggersCommand extends Command {
    constructor() {
        super({
                  name: 'tw-list',
                  description: 'Search or list triggers currently in the server\'s database. Text is NOT censored - please proceed at your own risk. Sends the results in a DM.',
                  args: '?*',
                  usage: '[keyword(s) (optional - if left out, will list *everything*)]'
              })
    }

    run(message, args) {
        if (!super.run(message, args)) return;
        let responseChannel = this.getResponseChannel(message);
        let keywords = args.join(' ');
        let doSearch = function() {
            triggers.select(keywords, 3, (rows) => {
                if (rows.length === 0) {
                    let search = keywords === '' ? '' : `'${keywords}' `;
                    responseChannel.send(`The search ${search}didn't return any results.`)
                }
                else {
                    for (let i = 0; i < rows.length; i = i  + 24) {
                        let richEmbed = new client.RichEmbed();
                        if (i === 0){
                            let search = keywords === '' ? ':' : ` '${keywords}':`;
                            richEmbed.setTitle(
                                `These are the results for your search${search}`);
                        }
                        let upper = Math.min(i + 24, rows.length);
                        rows.slice(i, upper).forEach((r) => {
                            let t = utils.displayTrigger(r, false);
                            richEmbed.addField(t.name, t.description, false)
                        });
                        responseChannel.send(richEmbed);
                    }
                }
            });
        };
        if (keywords === '') {
            utils.confirm(responseChannel, 'This will list _everything_. Are you sure?', doSearch, () => responseChannel.send('Cancelled search.'))
        }
        else {
            doSearch();
        }
    }
}

module.exports = new SearchTriggersCommand();