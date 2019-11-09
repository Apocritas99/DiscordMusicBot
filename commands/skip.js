  
module.exports = {
	name: 'next',
	description: 'comando next',
	cooldown: 5,
	execute(message) {
		const { voiceChannel } = message.member;
		if (!voiceChannel) return message.channel.send('lo siento pero tienes que estar en el canal para saltar la musica');
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('no hay nada reproduciendose que pueda saltar :c');
		serverQueue.connection.dispatcher.end('Skip Hecho');
	}
};