const { Util } = require('discord.js');
const ytdl = require('ytdl-core');
const ytdlDiscord = require('ytdl-core-discord');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube("AIzaSyBRKeOGOpvzRIMDuyXVL5cbGEzWvQCh8Yk");

module.exports = {
	name: 'play',
	description: 'Play command.',
	usage: 'nombre  de la cancion o url',
	args: true,
	cooldown: 5,
	async execute(message, args) {
  //const {url} = message
    const buscar = args.slice(0).join(" ");
    const url = args[0].replace((/<(.+)>/g), "$1")
		const { voiceChannel } = message.member;
		if (!voiceChannel) return message.channel.send('lo siento pero tienes que estar en un canal para que reproduzca esto -.-!');
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) return message.channel.send('no me puedo conectar a tu  canal asegurate de que tengo los permisos!');
		if (!permissions.has('SPEAK')) return message.channel.send('no puedo hablar en el canal asegurate de que no este muteado!');
    try {
      var video = await youtube.get.Video(url);
    } catch(error){
      try {
        var videos = await youtube.searchVideos(buscar, 1)
        var video = await youtube.getVideoByID(videos[0].id);
      } catch(err){
        console.error(err)
        return message.channel.send('no pude encontrar ninguna cancion')
      }
      //return console.log(buscar)
    }
		const serverQueue = message.client.queue.get(message.guild.id);
		const song = {
			id: video.id,
			title: video.title,
			url: `https://www.youtube.com/watch?v=${video.id}`,
		};

		if (serverQueue) {
			serverQueue.songs.push(song);
			console.log(serverQueue.songs);
			return message.channel.send(`✅ **${song.title}** se añadio a la cola!`);
		}

		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel,
			connection: null,
			songs: [],
			volume: 2,
			playing: true
		};
		message.client.queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);

		const play = async song => {
			const queue = message.client.queue.get(message.guild.id);
			if (!song) {
				queue.voiceChannel.leave();
				message.client.queue.delete(message.guild.id);
				return;
			}

			const dispatcher = queue.connection.playOpusStream(await ytdlDiscord(song.url), { passes: 3 })
				.on('end', reason => {
					if (reason === 'el stream no se esta reproduciendo bien') console.log('Song ended.');
					else console.log(reason);
					queue.songs.shift();
					play(queue.songs[0]);
				})
				.on('error', error => console.error(error));
			dispatcher.setVolumeLogarithmic(queue.volume / 5);
			queue.textChannel.send(`🎶 Start playing: **${song.title}**`);
		};

		try {
			const connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(queueConstruct.songs[0]);
		} catch (error) {
			console.error(`no puedo conectarme al canal de voz ${error}`);
			message.client.queue.delete(message.guild.id);
			await voiceChannel.leave();
			return message.channel.send(`no puedo conectarme al canal de voz: ${error}`);
		}
	}
};