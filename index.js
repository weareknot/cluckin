const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const schedule = require('node-schedule');
const utils = require('./utils');
const yargs = require('yargs-parser');

const client = new Discord.Client();


// load command files from folder
client.commands = new Discord.Collection();
const commandRoot = './commands';
fs.readdirSync(commandRoot)
  .filter((file) => {
      return file.endsWith('.js') && !file.startsWith('_');
  })
  .forEach((f) => {
      let c = require(`${commandRoot}/${f}`);
      if (config.commandOptions[c.name].enabled) {
          c.aliases.forEach((a) => {
              client.commands.set(a, c)
          });
      }
  });


// load scheduled jobs
client.jobs = new Discord.Collection();
const jobRoot = './jobs';
fs.readdirSync(jobRoot)
  .filter((file) => {
      return file.endsWith('.js') && !file.startsWith('_');
  })
  .forEach((f) => {
      let j = require(`${jobRoot}/${f}`);
      client.jobs.set(j.name, j);
  });


// load monitors
client.monitors = new Discord.Collection();
const monitorRoot = './monitors';
fs.readdirSync(monitorRoot)
  .filter((file) => {
      return file.endsWith('.js') && !file.startsWith('_');
  })
  .forEach((f) => {
      let m = require(`${monitorRoot}/${f}`);
      client.monitors.set(m.name, m);
  });


client.on('error', (e) => {
    let botChannel = utils.getChannel(client, 'bot-log');
    botChannel.send(`<@${config.maintainer}>, error: ${e.message}.`);
    console.error(e);
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    let botChannel = utils.getChannel(client, 'bot-log')
    botChannel.send(`<@${config.maintainer}>, I've restarted myself again because I am a silly chicken.`)

    client.user.setActivity(`${config.prefix}help`, {'type': 'PLAYING'})
          .then(p => {
              console.log(`Status set to ${p.game ? p.game.name : p}.`)
          })
          .catch(e => console.log(e));

    client.jobs.forEach((j) => {
        let job = schedule.scheduleJob(j.schedule, () => {
            j.run(client);
        });
        console.log(`${j.name} scheduled: ${j.schedule}`);
    });

    client.monitors.forEach((m) => {
        client.on(m.event, (...eventData) => m.run(client, ...eventData));
    })
});

client.on('message', msg => {
    if (!msg.content.startsWith(config.prefix) || msg.author.bot || msg.content.startsWith(config.prefix + ' ')) {
        return;
    }

    console.log('MSG: ' + msg.content);

    const args = yargs(msg.content.slice(config.prefix.length), {array: ['_']})['_'];
    const commandName = args.shift();
    if (!client.commands.has(commandName)) {
        msg.reply(`I don't understand ${commandName}, sorry! Try ${config.prefix}help to see a list of commands.`)
        return;
    }

    const command = client.commands.get(commandName);
    if ((command.args === '?' && args.length > 1) ||
        (command.args === '*' && args.length === 0) ||
        (utils.isInt(command.args.toString()) && args.length !==
         command.args)) {
        msg.reply(
            `That didn't work! Try this: \`${command.usage}\`\nIf there are spaces in your answers, try putting quotes around them: \`>command "answer 1" "answer 2"\``);
        return;
    }
    try {
        command.run(msg, args);
    }
    catch (e) {
        console.error(e);
    }
});

client.login(config.token);
