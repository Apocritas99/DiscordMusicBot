module.exports = {
	name: 'volumen',
	description: 'Volume command.',
	cooldown: 5,
	execute(message, args) {
		const { voiceChannel } = message.member;
		if (!voiceChannel) return message.channel.send('debes estar en el mismo canal que io para usar este comando');
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('no hay nada reproduciendose :c');
		if (!args[0]) return message.channel.send(`El volumen actual es: **${serverQueue.volume}**`);
		serverQueue.volume = args[0]; // eslint-disable-line
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
		return message.channel.send(`Puse el volumen en: **${args[0]}**`);
	}
};