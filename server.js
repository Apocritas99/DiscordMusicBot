const Discord = require('discord.js');
const config = require ("./config.json")
const ytdl = require('ytdl-core');
const fs = require('fs')
const { readdirSync } = require('fs');
const { join } = require('path');
const MusicClient = require('./struct/Client');
const { Collection } = require('discord.js');
const YouTube = require('simple-youtube-api');
const client = new MusicClient({ token: process.env.DISCORD_TOKEN, prefix: process.env.DISCORD_PREFIX });

const youtube = new YouTube("AIzaSyBRKeOGOpvzRIMDuyXVL5cbGEzWvQCh8Yk");

const commandFiles = readdirSync(join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(join(__dirname, 'commands', `${file}`));
	client.commands.set(command.name, command);
}

client.once('ready', () => console.log('READY!'));
client.on('message', message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  const args = message.content.slice(config.prefix.length).split(/ +/g);;
	const commandName = args.shift().toLowerCase();
  //const url = args.replace((/<(.+)>/g))//args.join(" ").replace((/<(.+)>/g), '$1')
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
	if (command.guildOnly && message.channel.type !== 'text') return message.reply('no puedo ejecutar este comando dentro de privados!');
	if (command.args && !args.length) {
		let reply = `No especificaste ningun argumento, ${message.author}!`;
		if (command.usage) reply += `\nel uso apropiado seria: \`${config.prefix}${command.name} ${command.usage}\``;
		return message.channel.send(reply);
	}
	if (!client.cooldowns.has(command.name)) {
		client.cooldowns.set(command.name, new Collection());
	}
	const now = Date.now();
	const timestamps = client.cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Por favor espera ${timeLeft.toFixed(1)} segundos para reusar el  comando \`${command.name}\``);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('hubo un error intentando ejecutar el comando contacta con el administrador');
	}
  
});

client.login(config.token);
