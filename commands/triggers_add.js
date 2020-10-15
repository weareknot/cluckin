const triggers = require('../data/triggers');
const client = require('discord.js');
const utils = require('../utils');
const {Command} = require('./_base');

class RequestTriggerCommand extends Command {
    constructor() {
        super({
                  name: 'tw-add',
                  usage: '"[trigger name]" "[brief description (optional)]"',
                  args: '*',
                  description: 'Anonymously add a trigger to the server\'s database. Try to keep the trigger name short.',
              })
    }

    getFlags(channel, cb) {
        channel.send(
            'Is this blacklisted (❌), 18+ only (🔞), or neither (✅)? (You can only choose one)')
               .then((msg) => {
                   let blacklistEmoji = '❌';
                   let underageEmoji = '🔞';
                   let okayEmoji = '✅';
                   msg.react(blacklistEmoji);
                   msg.react(underageEmoji);
                   msg.react(okayEmoji);
                   msg.createReactionCollector((r, u) => {
                       let inList = [blacklistEmoji, underageEmoji, okayEmoji].includes(
                           r.emoji.name);
                       return inList && !u.bot;
                   }).once('collect', (r) => {
                       let emoji = r.emoji.name;
                       let flags = {
                           blacklist: emoji === blacklistEmoji,
                           adult: emoji === underageEmoji
                       };
                       if (!flags.blacklist) {
                           this.getChannels(channel, (channels) => {
                               flags.channels = channels;
                               cb(flags);
                           })
                       } else {
                           flags.channels = null;
                           cb(flags);
                       }
                   })
               });
    }

    getChannels(channel, cb) {
        let askForChannels = (question) => {
            question.channel.createMessageCollector(
                (m) => {
                    return m.mentions.channels.size !== 0 ||
                           /#/.test(m.content);
                })
                    .once('collect', (m) => {
                        let ids = m.mentions.channels.map(
                            (c) => c.id);
                        ids = ids === null ? [] : ids;
                        let named = m.content.match(
                            /#[0-9A-Za-z-]+/g);
                        if (named !== null) {
                            named.forEach((c) => {
                                let namedChannel = utils.getChannel(
                                    channel.client,
                                    c.slice(1));
                                if (namedChannel !== null) {
                                    ids.push(namedChannel.id);
                                }
                            });
                        }
                        cb(ids.join(','))
                    })
        };

        channel.send(
            'Are there specific channels for this topic (aside from 18+ channels & adult content)?')
               .then((msg) => {
                   let yesEmoji = '✅';
                   let noEmoji = '❌';
                   msg.react(yesEmoji);
                   msg.react(noEmoji);
                   msg.createReactionCollector((r, u) => {
                       let inList = [yesEmoji, noEmoji].includes(r.emoji.name);
                       return inList && !u.bot;
                   }).once('collect', (r) => {
                       let emoji = r.emoji.name;
                       if (emoji === yesEmoji) {
                           channel.send('Name or mention them below (include the #):')
                                  .then(askForChannels);
                       } else {
                           cb(null);
                       }
                   })
               })

    }

    run(message, args) {
        if (!super.run(message, args)) return;
        let responseChannel = this.getResponseChannel(message);
        let thank = () => responseChannel.send('Thank you for contributing!');
        let name = args[0].trim();
        let description = args.length > 1 ? args[1].trim() : '';

        let addName;
        let addDesc;
        triggers.select(name, 3, (rows) => {
            if (rows.length === 0) {
                addName = name;
                addDesc = description;
                if (utils.isModerator(message.client, message.author)) {
                    this.getFlags(responseChannel, (flags) => {
                        triggers.add(addName, addDesc, flags.blacklist, flags.adult,
                                     flags.channels);
                        thank();
                    });
                } else {
                    triggers.add(addName, addDesc, false, false);
                    thank();
                }
            } else {
                let richEmbed = new client.RichEmbed();
                richEmbed.setTitle(
                    `There are ${rows.length} items similar to '${name}' in the database - did you mean one of these?`);
                richEmbed.setFooter(
                    'If one of those looks like what you meant, type its number. If not, type 0. This just helps us to know which triggers are the most common.');
                rows.forEach((r, i) => {
                    let t = utils.displayTrigger(r, false);
                    richEmbed.addField(`${i + 1}: ${t.name}`, t.description, false)
                });

                let ambiguous = (question) => {
                    question.channel.createMessageCollector(
                        (m) => utils.isInt(m.content.trim()))
                            .once('collect', (m) => {
                                let option = parseInt(m.content.trim());
                                if (option === 0) {
                                    addName = name;
                                    addDesc = description;
                                    if (utils.isModerator(message.client,
                                                          message.author)) {
                                        this.getFlags(responseChannel,
                                                      (flags) => {
                                                          triggers.add(
                                                              addName,
                                                              addDesc,
                                                              flags.blacklist,
                                                              flags.adult,
                                                              flags.channels);
                                                          thank();
                                                      });
                                    } else {
                                        triggers.add(addName, addDesc, false, false);
                                        thank();
                                    }
                                } else {
                                    let row = rows[option - 1];
                                    addName = row.name;
                                    addDesc =
                                        row.description === '' ?
                                        description :
                                        '';
                                    triggers.add(addName, addDesc);
                                    thank();
                                }
                            })
                };

                responseChannel.send(richEmbed)
                               .then(ambiguous)

            }
        });
    }
}

module.exports = new RequestTriggerCommand();