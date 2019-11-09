module.exports = {
	name: 'np',
	description: 'reproduciendo actualmente',
	cooldown: 5,
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('no hay nada reproduciendose :c');
		return message.channel.send(`🎶 Escuchando ahora: **${serverQueue.songs[0].title}**`);
	}
};