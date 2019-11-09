const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {
	name: 'queue',
	description: 'Queue command.',
	cooldown: 5,
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('no hay nada reproduciendose :c');
    let embed = new Discord.RichEmbed()
          let songs = []
          
    serverQueue.songs.map(song => {
      let numero = 1;
      songs.forEach(function(element){
        numero++
      })
      songs.push('['+numero+']' + '> ' + song.title)
      embed.setTitle('Canciones en Cola Para '+ message.guild.name)
      embed.setDescription('```js\n'+songs.join('\n ======================================================= \n')+'```')
      embed.setColor('RANDOM')
      embed.setFooter(`🎶 Escuchando ahora: ${serverQueue.songs[0].title}`)
      
    })
		return message.channel.send(embed);
	}
};