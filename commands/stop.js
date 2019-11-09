module.exports = {
	name: 'stop',
	description: 'Stop command.',
	cooldown: 5,
	execute(message) {
		const { voiceChannel } = message.member;
		if (!voiceChannel) return message.channel.send('debes estar en el mismo canal que io para usar este comando');
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('no hay nada reproduciendose que pueda darle stop :c');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stoped');
	}
};