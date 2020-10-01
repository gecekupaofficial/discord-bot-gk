const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');

exports.run = (client, message, args) => {
    const embed = new Discord.RichEmbed()
        
        .setTitle(`${client.user.username} Davet Menüsü `)
        .setDescription(`<a:hypesquad1:755370163292864614> **Botun Davet Linki İçin** [TIKLA](https://discord.com/api/oauth2/authorize?client_id=755341312303300618&permissions=8&scope=bot) \n <a:hypesquad1:755370163292864614> **Destek Sunucusu İçin** [TIKLA](https://discord.gg/H54BNFR) \n `)
        .setThumbnail(client.user.avatarURL)
        .setFooter(`${message.author.username} Başarıyla ${ayarlar.prefix} Davet Sistemi Kullandı`, message.author.avatarURL)
    .setColor(`#ffd100`)
    return message.channel.sendEmbed(embed);
  
  
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
};

exports.help = {
  name: 'davet',
  description: '',
  usage: 'davet'
};