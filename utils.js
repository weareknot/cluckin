const config = require('./config');
const {DMChannel} = require('discord.js');


function getChannel(client, name, ogAuthor, ogChannel) {
    let channel;
    if (name === '@dm') {
        channel = ogAuthor;
    } else if (name === '@this') {
        channel = ogChannel;
    } else {
        channel = client.channels.find((c) => {
            return c.name === name && c.guild.id === config.primaryServer
        });
    }
    return channel
}

function isUser(client, user) {
    let server = client.guilds.find((c) => {
        return c.id === config.primaryServer
    });
    let serverUser = server.member(user);
    return serverUser !== null;
}

function isMod(client, user) {
    let server = client.guilds.find((c) => {
        return c.id === config.primaryServer
    });
    let userRoles = server.member(user).roles;
    let intersection = new Set(
        userRoles.filter(x => {
            return config.moderators.includes(x.name)
        }));
    return intersection.size > 0;
}

function monthName(number) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
                    'Nov', 'Dec'];
    return months[number - 1];
}

function isInt(s) {
    try {
        let i = parseInt(s);
        return !isNaN(i);
    }
    catch (e) {
        return false;
    }
}

function makePaste(title, text) {
    let params = ['api_key=g8F4GoHEvXiSb8vfNHszCH7a7eE2BFtV',
                  `title=${title}`,
                  'language=markdown'].join('&');
    //return axios.post('https://www.pastery.net/api/paste/?' + params, text);
}

function displayTrigger(t, show_description) {
    //let name = r.name.replace(/[AEIOUYaeiouy]/m, '*');
    show_description = show_description | false;
    let name = t.name;
    let desc = t.description.split('|')[0].trim();
    desc = desc === '' ? '(no description)' :
           desc.replace(t.name, name).replace("'", "\\'");
    let blacklisted = t.blacklist ?
                      ':x: **not allowed anywhere on the server**' : '';
    let adult = t.adult && !t.blacklist ? ':underage: **18+ channels only**' :
                '';
    let channels = t.channels !== null ? t.channels.split(',').map((c) => {
        return '  - <#' + c + '>';
    }) : [];
    channels = channels.length > 0 && !t.blacklist ?
               `we have specific channels for this: \n${channels.join(
                   '\n')}` : '';

    if (!show_description) {
        let url = 'https://www.google.com/#q=define+' + encodeURIComponent(t.name);
        desc = `_[hover for description; click to open google](${url} '${desc}')_`;
    }
    desc = [desc, blacklisted, adult, channels].filter((x) => x !== '').join('\n\n') +
           '\n\n---';

    return {
        name: name,
        description: desc
    }
}

function confirm(channel, prompt, resolve, reject) {
    channel.send(prompt)
           .then((msg) => {
               let yesEmoji = '✅';
               let noEmoji = '❌';
               msg.react(yesEmoji);
               msg.react(noEmoji);
               msg.createReactionCollector((r, u) => {
                   let inList = [yesEmoji, noEmoji].includes(r.emoji.name);
                   return inList && !u.bot;
               }).once('collect', (r) => {
                   if (r.emoji.name === yesEmoji) {
                       resolve()
                   }
                   else {
                       reject()
                   }
               })
           })
}

module.exports = {
    getChannel: getChannel,
    monthName: monthName,
    isInt: isInt,
    displayTrigger: displayTrigger,
    isModerator: isMod,
    confirm: confirm,
    isUser: isUser,
};
