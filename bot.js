const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const moment = require('moment');
var Jimp = require('jimp');
const { Client, Util } = require('discord.js');
const weather = require('weather-js')
const fs = require('fs');
const db = require('quick.db');
const http = require('http');
const express = require('express');
require('./util/eventLoader.js')(client);
const path = require('path');
const request = require('request');
const snekfetch = require('snekfetch');
const queue = new Map();
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');


const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + "Lord Creative | Youtube Channel");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

var prefix = ayarlar.prefix;

const log = message => {
    console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   l0RDconsole.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// }); //DEVİLHOUSE//

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);

//---------------------------------KOMUTLAR---------------------------------\\


//////////////////////////MODLOG///////////////////
client.on('messageDelete', async message   => { // mod-log
      let modlogs = db.get(`log_${message.guild.id}`)
    const modlogkanal = message.guild.channels.find(kanal => kanal.id === modlogs);    
if (!modlogkanal) return;
  const embed = new Discord.RichEmbed()
  .setColor("#ffd100")
  .setTitle("MESAJ SİLİNDİ")
.setDescription(`<a:hypesquad1:755370163292864614> <@!${message.author.id}> adlı kullanıcı tarafından <#${message.channel.id}> kanalına gönderilen mesaj silindi!\n\nSilinen Mesaj: **${message.content}**`)
  .setFooter("Kyrizers Bot | Log Sistemi")
  modlogkanal.sendEmbed(embed);
  })

client.on('guildBanAdd', async message  => {
      let modlogs = db.get(`log_${message.guild.id}`)
    const modlogkanal = message.guild.channels.find(kanal => kanal.id === modlogs);    
if (!modlogkanal) return;
  const embed = new Discord.RichEmbed()
  .setColor("#ffd100")

    .setDescription(`<a:hypesquad1:755370163292864614> Üye Sunucudan Yasaklandı! \n<@!${message.user.id}>, ${message.user.tag}`)
        .setThumbnail(message.user.avatarURL)
  .setFooter("Kyrizers Bot | Log Sistemi")
  modlogkanal.sendEmbed(embed);
  })
client.on('channelCreate', async channel  => {
      let modlogs = db.get(`log_${channel.guild.id}`)
    const modlogkanal = channel.guild.channels.find(kanal => kanal.id === modlogs);    
if (!modlogkanal) return;
    if (channel.type === "text") {
                let embed = new Discord.RichEmbed()
                    .setColor('#ffd100')
                .setDescription(`<a:hypesquad1:755370163292864614> ${channel.name} adlı metin kanalı oluşturuldu.`)
                .setFooter(`Kyrizers Bot | Log Sistemi Kanal ID: ${channel.id}`)
                modlogkanal.send({embed});
            };
            if (channel.type === "voice") {
                let embed = new Discord.RichEmbed()
                .setColor('#ffd100')
.setTitle("SES KANALI OLUŞTURULDU")
                .setDescription(`<a:hypesquad1:755370163292864614> ${channel.name} adlı ses kanalı oluşturuldu!`)
                .setFooter(`Kyrizers Bot | Log Sistemi Kanal ID: ${channel.id}`)

                modlogkanal.send({embed});
            }
        
    })
client.on('channelDelete', async channel  => {
      let modlogs = db.get(`log_${channel.guild.id}`)
    const modlogkanal = channel.guild.channels.find(kanal => kanal.id === modlogs);    
if (!modlogkanal) return;
    if (channel.type === "text") {
                let embed = new Discord.RichEmbed()
                    .setColor('#ffd100')
                .setDescription(`<a:hypesquad1:755370163292864614> ${channel.name} adlı metin kanalı silini!`)
                .setFooter(`Kyrizers Bot | Log Sistemi Kanal ID: ${channel.id}`)
                modlogkanal.send({embed});
            };
            if (channel.type === "voice") {
                let embed = new Discord.RichEmbed()
                .setColor('#ffd100')
.setTitle("SES KANALI SİLİNDİ")
                .setDescription(`<a:hypesquad1:755370163292864614> ${channel.name} adlı ses kanalı silindi`)
            .setFooter(`Kyrizers Bot | Log Sistemi  Kanal ID: ${channel.id}`)
                modlogkanal.send({embed});
            }
    })
client.on("messageUpdate", async (oldMsg, newMsg) => {
  if (oldMsg.author.bot) return;
  var user = oldMsg.author;
  if (db.has(`log_${oldMsg.guild.id}`) === false) return;
  var kanal = oldMsg.guild.channels.get(db.fetch(`log_${oldMsg.guild.id}`).replace("<#", "").replace(">", ""))
  if (!kanal) return;
  const embed = new Discord.RichEmbed()
  .setColor("#ffd100")
  .addField("Kullanıcı", oldMsg.author.tag, true)
  .addField("Eski Mesaj",`  ${oldMsg.content}  `)
  .addField("Yeni Mesaj", `${newMsg.content}`)
  .setThumbnail(oldMsg.author.avatarURL)
  kanal.send(embed);  
        
    })
//////////////////////////////MODLOG///////////////////////////







/////////////////sayaç//////////////

client.on("guildMemberAdd", async member => {
let Piratesayı = await db.fetch(`PirateCode+SayaçSayı_${member.guild.id}`)  
let Piratekanal = await db.fetch(`PirateCode+SayaçKanal_${member.guild.id}`)  
if(!Piratesayı || !Piratekanal) return
let sonuç = Piratesayı - member.guild.memberCount
client.channels.get(Piratekanal).send(`? ${member} Katıldı **${Piratesayı}** Kişiye Ulaşmak için **${sonuç}** Kişi Kaldı`)
})
client.on("guildMemberRemove", async member => {
let Piratesayı = await db.fetch(`PirateCode+SayaçSayı_${member.guild.id}`)  
let Piratekanal = await db.fetch(`PirateCode+SayaçKanal_${member.guild.id}`)  
if(!Piratesayı || !Piratekanal) return
let sonuç = Piratesayı - member.guild.memberCount
  
client.channels.get(Piratekanal).send(`?? ${member} Ayrıldı **${Piratesayı}** Kişiye Ulaşmak İçin **${sonuç}** Kişi Kaldı`)
return
})




//////////////////////////
client.on('voiceStateUpdate', (oldMember, newMember) => {
    // todo create channel
    if (newMember.voiceChannel != null && newMember.voiceChannel.name.startsWith('?-2 Kişilik Oda')) {
        newMember.guild.createChannel(`¦?? ${newMember.displayName}`, {
            type: 'voice',
            parent: newMember.voiceChannel.parent
       }).then(cloneChannel => {
        newMember.setVoiceChannel(cloneChannel)
        cloneChannel.setUserLimit(2)
      })
    }
    // ! leave
    if (oldMember.voiceChannel != undefined) {
        if (oldMember.voiceChannel.name.startsWith('¦?? ')) {
            if (oldMember.voiceChannel.members.size == 0) {
                oldMember.voiceChannel.delete()
            }
            else { // change name
                let matchMember = oldMember.voiceChannel.members.find(x => `¦?? ${x.displayName}` == oldMember.voiceChannel.name);
                if (matchMember == null) {
                    oldMember.voiceChannel.setName(`¦?? ${oldMember.voiceChannel.members.random().displayName}`)
                }
            }
        }
    }
});
//----------------------------------GEÇİCİ KANAL----------------------------// 
//----------------------------------GEÇİCİ KANAL----------------------------// 
client.on('voiceStateUpdate', (oldMember, newMember) => {
    // todo create channel
    if (newMember.voiceChannel != null && newMember.voiceChannel.name.startsWith('?-3 Kişilik Oda')) {
        newMember.guild.createChannel(`¦?? ${newMember.displayName}`, {
            type: 'voice',
            parent: newMember.voiceChannel.parent
       }).then(cloneChannel => {
        newMember.setVoiceChannel(cloneChannel)
        cloneChannel.setUserLimit(3)
      })
    }
    // ! leave
    if (oldMember.voiceChannel != undefined) {
        if (oldMember.voiceChannel.name.startsWith('¦?? ')) {
            if (oldMember.voiceChannel.members.size == 0) {
                oldMember.voiceChannel.delete()
            }
            else { // change name
                let matchMember = oldMember.voiceChannel.members.find(x => `¦?? ${x.displayName}` == oldMember.voiceChannel.name);
                if (matchMember == null) {
                    oldMember.voiceChannel.setName(`¦?? ${oldMember.voiceChannel.members.random().displayName}`)
                }
            }
        }
    }
});
//----------------------------------GEÇİCİ KANAL----------------------------// 
//----------------------------------GEÇİCİ KANAL----------------------------// 
client.on('voiceStateUpdate', (oldMember, newMember) => {
    // todo create channel
    if (newMember.voiceChannel != null && newMember.voiceChannel.name.startsWith('?-4 Kişilik Oda')) {
        newMember.guild.createChannel(`¦?? ${newMember.displayName}`, {
            type: 'voice',
            parent: newMember.voiceChannel.parent
       }).then(cloneChannel => {
        newMember.setVoiceChannel(cloneChannel)
        cloneChannel.setUserLimit(4)
      })
    }
    // ! leave
    if (oldMember.voiceChannel != undefined) {
        if (oldMember.voiceChannel.name.startsWith('¦?? ')) {
            if (oldMember.voiceChannel.members.size == 0) {
                oldMember.voiceChannel.delete()
            }
            else { // change name
                let matchMember = oldMember.voiceChannel.members.find(x => `¦?? ${x.displayName}` == oldMember.voiceChannel.name);
                if (matchMember == null) {
                    oldMember.voiceChannel.setName(`¦?? ${oldMember.voiceChannel.members.random().displayName}`)
                }
            }
        }
    }
});
//----------------------------------GEÇİCİ KANAL----------------------------// 
//----------------------------------GEÇİCİ KANAL----------------------------// 
client.on('voiceStateUpdate', (oldMember, newMember) => {
    // todo create channel
    if (newMember.voiceChannel != null && newMember.voiceChannel.name.startsWith('?-5 Kişilik Oda')) {
        newMember.guild.createChannel(`¦?? ${newMember.displayName}`, {
            type: 'voice',
            parent: newMember.voiceChannel.parent
       }).then(cloneChannel => {
        newMember.setVoiceChannel(cloneChannel)
        cloneChannel.setUserLimit(5)
      })
    }
    // ! leave
    if (oldMember.voiceChannel != undefined) {
        if (oldMember.voiceChannel.name.startsWith('¦?? ')) {
            if (oldMember.voiceChannel.members.size == 0) {
                oldMember.voiceChannel.delete()
            }
            else { // change name
                let matchMember = oldMember.voiceChannel.members.find(x => `¦?? ${x.displayName}` == oldMember.voiceChannel.name);
                if (matchMember == null) {
                    oldMember.voiceChannel.setName(`¦?? ${oldMember.voiceChannel.members.random().displayName}`)
                }
            }
        }
    }
});
//----------------------------------GEÇİCİ KANAL----------------------------// 
//----------------------------------Özel oda sistemi----------------------------// 
client.on('message', async message => {
  const ms = require('ms');
  const prefix = await require('quick.db').fetch(`prefix_${message.guild.id}`) || ayarlar.prefix
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  let u = message.mentions.users.first() || message.author;
  if (command === "özeloda") {
  if (message.guild.channels.find(channel => channel.name === "Bot Kullanımı")) return message.channel.send(" Bot Paneli Zaten Ayarlanmış.")
  if (!message.member.hasPermission('ADMINISTRATOR'))
  return message.channel.send(" Bu Kodu `Yönetici` Yetkisi Olan Kişi Kullanabilir.");
    message.channel.send(`Özel Oda Sisteminin Kurulmasını İstiyorsanız **Kur** Yazınız.`)
      message.channel.awaitMessages(response => response.content === 'Kur', {
        max: 1,
        time: 10000,
        errors: ['time'],
     })
    .then((collected) => {

message.guild.createChannel('????2 Kişilik Odalar????', 'category', [{
  id: message.guild.id,
}]);

message.guild.createChannel(`?-2 Kişilik Oda`, 'voice')
.then(channel =>
      channel.setParent(message.guild.channels.find(channel => channel.name === "????2 Kişilik Odalar????")))

message.guild.createChannel('????3 Kişilik Odalar????', 'category', [{
  id: message.guild.id,
}]);

message.guild.createChannel(`?-3 Kişilik Oda`, 'voice')
.then(channel =>
      channel.setParent(message.guild.channels.find(channel => channel.name === "????3 Kişilik Odalar????")))

message.guild.createChannel('????4 Kişilik Odalar????', 'category', [{
  id: message.guild.id,
}]);

message.guild.createChannel(`?-4 Kişilik Oda`, 'voice')
.then(channel =>
      channel.setParent(message.guild.channels.find(channel => channel.name === "????4 Kişilik Odalar????")))

message.guild.createChannel('????5 Kişilik Odalar????', 'category', [{
  id: message.guild.id,
}]);
message.guild.createChannel(`?-5 Kişilik Oda`, 'voice')
.then(channel =>
      channel.setParent(message.guild.channels.find(channel => channel.name === "????5 Kişilik Odalar????")))

       message.channel.send("Özel Oda Sistemi Aktif")
     
            })   
      
}
});
//----------------------------------Özel oda sistemi Son--------------------------

///////////////////////////////////REKLAMENLGEL


client.on('message', async message => {
let aktif = await db.fetch(`reklamEngelPirate_${message.channel.id}`)
if (!aktif) return 
let reklamlar = ["discord.app", "discord.gg" ,"discordapp","discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az", ".cf", ".me", ".in"]
let kelimeler = message.content.slice(" ").split(/ +/g)
if (reklamlar.some(word => message.content.toLowerCase().includes(word))) {
if (message.member.hasPermission("BAN_MEMBERS")) return;
message.delete()
message.reply('<a:hypesquad1:755370163292864614> **Hey Dostum Bu Sunucuda Reklam Yasak**').then(msg => msg.delete(7000)) 
}
});
//Pirate Code
client.on("messageUpdate", async (oldMsg, newMsg) => {
let aktif = await db.fetch(`reklamEngelPirate_${oldMsg.channel.id}`)
if(!aktif) return
let reklamlar = ["discord.app", "discord.gg","discordapp","discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az", ".cf", ".me", ".in"]
let kelimeler = newMsg.content.slice(" ").split(/ +/g)
if (reklamlar.some(word => newMsg.content.toLowerCase().includes(word))) {
if (newMsg.member.hasPermission("BAN_MEMBERS")) return;
newMsg.delete()
oldMsg.reply('<a:hypesquad1:755370163292864614> **Hey Dostum Bu Sunucuda Reklam Yasak**').then(msg => msg.delete(7000)) 
}
});

////////////////////REKLAMENGEL






//////////////////////////////////////////REKLAMKİCK

 client.on("message", async message => {
      let uyarisayisi = await db.fetch(`reklamuyari_${message.author.id}`);
      let reklamkick = await db.fetch(`reklamkick_${message.guild.id}`)
      let kullanici = message.member;
      if (reklamkick == 'kapali') return;
      if (reklamkick == 'acik') {
          const reklam = ["discord.app", "discord.gg", "invite", "discordapp", "discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az",];
          if (reklam.some(word => message.content.toLowerCase().includes(word))) {
              if (!message.member.hasPermission("ADMINISTRATOR")) {
                  message.delete();
                  db.add(`reklamuyari_${message.author.id}`, 1) //uyarı puanı ekleme
                  if (uyarisayisi === null) {
                      let uyari = new Discord.RichEmbed()
                          .setColor("#ffd100")
                          .setFooter('Kyrizers BOT', client.user.avatarURL)
                          .setDescription(`<a:hypesquad1:755370163292864614> **<@${message.author.id}> Reklam Kick Sistemine Yakalandın! Reklam Yapmaya Devam Edersen Kickleniceksin (1/3)**`)
                          .setTimestamp()
                      message.channel.send(uyari)                
  }
                  if (uyarisayisi === 1) {
                      let uyari = new Discord.RichEmbed()
                          .setColor("#ffd100")
                          .setFooter('Kyrizers BOT ', client.user.avatarURL)
                          .setDescription(`<a:hypesquad1:755370163292864614> **<@${message.author.id}> Reklam Kick Sistemine Yakalandın! Reklam Yapmaya Devam Edersen Kickleniceksin (2/3)**`)
                          .setTimestamp()
                      message.channel.send(uyari)
                  }
                  if (uyarisayisi === 2) {
                      message.delete();
                      await kullanici.kick({
                          reason: `Reklam kick sistemi`,
                      })
                      let uyari = new Discord.RichEmbed()
                          .setColor("#ffd100")
                          .setFooter('Kyrizers BOT', client.user.avatarURL)
                          .setDescription(`<a:hypesquad1:755370163292864614> **<@${message.author.id}> 3 Adet Reklam Uyarısı Aldığı İçin Kicklendi. Bir Kez Daha Yaparsa Banlanacak**`)
                          .setTimestamp()
                      message.channel.send(uyari)
                  }
                  if (uyarisayisi === 3) {
                      message.delete();
                      await kullanici.ban({
                          reason: `Kyrizers Reklam Kick Sistemi`,
                      })
                      db.delete(`reklamuyari_${message.author.id}`)
                      let uyari = new Discord.RichEmbed()
                          .setColor("#ffd100")
                          .setFooter('Kyrizers BOT', client.user.avatarURL)
                          .setDescription(`<a:hypesquad1:755370163292864614> **<@${message.author.id}> Kick Yedikten Sonra Tekrar Devam Ettiği İçin Banlandı.**`)
                          .setTimestamp()
                      message.channel.send(uyari)
                  }

              }
          }
      }
  });


///////////////////////reklamkick


const invites = {};

const wait = require("util").promisify(setTimeout);

client.on("ready", () => {
  wait(1000);

  client.guilds.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
});

client.on("guildMemberRemove", async member => {
  let kanal = await db.fetch(`davetkanal_${member.guild.id}`);
  if (!kanal) return;
  let veri = await db.fetch(`rol1_${member.guild.id}`);
  let veri12 = await db.fetch(`roldavet1_${member.guild.id}`);
  let veri21 = await db.fetch(`roldavet2_${member.guild.id}`);
  let veri2 = await db.fetch(`rol2_${member.guild.id}`);
  let d = await db.fetch(`bunudavet_${member.id}`);
  const sa = client.users.get(d);
  const sasad = member.guild.members.get(d);
  let sayı2 = await db.fetch(`davet_${d}_${member.guild.id}`);
  db.add(`davet_${d}_${member.guild.id}`, -1);

  if (!d) {
    const aa = new Discord.RichEmbed()
      .setColor("#d20b0d")
      .setDescription(
        `\`\`${member.user.tag}\`\` **Adlı Kullanıcı Aramızdan Ayrıldı\n Davet Eden** \`\`Bulunamadı!\`\``
      )
      .setFooter(client.user.username, client.user.avatarURL);
    client.channels.get(kanal).send(aa);
    return;
  } else {
    const aa = new Discord.RichEmbed()
      .setColor("#d20b0d")
      .setDescription(
        `\`\`${member.user.tag}\`\` **Adlı Kullanıcı Aramızdan Ayrıldı\n Davet Eden** \`\`${sa.tag}\`\``
      )
      .setFooter(client.user.username, client.user.avatarURL);
    client.channels.get(kanal).send(aa);

    if (!veri) return;

    if (sasad.roles.has(veri)) {
      if (sayı2 <= veri12) {
        sasad.removeRole(veri);
        return;
      }
    }
    if (sasad.roles.has(veri2)) {
      if (!veri2) return;
      if (sayı2 <= veri21) {
        sasad.removeRole(veri2);
        return;
      }
    }
  }
});

client.on("guildMemberAdd", async member => {
  member.guild.fetchInvites().then(async guildInvites => {
    let veri = await db.fetch(`rol1_${member.guild.id}`);
    let veri12 = await db.fetch(`roldavet1_${member.guild.id}`);
    let veri21 = await db.fetch(`roldavet2_${member.guild.id}`);
    let veri2 = await db.fetch(`rol2_${member.guild.id}`);
    let kanal = await db.fetch(`davetkanal_${member.guild.id}`);
    if (!kanal) return;
    const ei = invites[member.guild.id];

    invites[member.guild.id] = guildInvites;

    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
    const sasad = member.guild.members.get(invite.inviter.id);
    const davetçi = client.users.get(invite.inviter.id);

    db.add(`davet_${invite.inviter.id}_${member.guild.id}`, +1);
    db.set(`bunudavet_${member.id}`, invite.inviter.id);
    let sayı = await db.fetch(`davet_${invite.inviter.id}_${member.guild.id}`);

    let sayı2;
    if (!sayı) {
      sayı2 = 0;
    } else {
      sayı2 = await db.fetch(`davet_${invite.inviter.id}_${member.guild.id}`);
    }

    const aa = new Discord.RichEmbed()
      .setColor("#ffd100")
      .setDescription(
        `\`\`${member.user.tag}\`\` **Adlı Kullanıcı Sunucuya Katıldı\n Davet Eden** \`\`${davetçi.tag}\`\`\n**Toplam \`\`${sayı2}\`\` Daveti Oldu!**`
      )
      .setFooter(client.user.username, client.user.avatarURL);
    client.channels.get(kanal).send(aa);
    if (!veri) return;

    if (!sasad.roles.has(veri)) {
      if (sayı2 => veri12) {
        sasad.addRole(veri);
        return;
      }
    } else {
      if (!veri2) return;
      if (sayı2 => veri21) {
        sasad.addRole(veri2);
        return;
      }
    }
  });
});




client.on("guildMemberAdd", async member => {
  let rol = await db.fetch(`sayaçhedef_${member.guild.id}`);
  let kanal = await db.fetch(`sayaçkanal_${member.guild.id}`);
  let msj = await db.fetch(`sayaçmsjhg_${member.guild.id}`);
  if (!rol) return;
  if (!kanal) return;

  if (rol == member.guild.memberCount) {
    const embed = new Discord.RichEmbed()
      .setColor("#ffd100")
      .setDescription(`Tebrikler! Başarılı Bir Şekilde ${rol} Kişi olduk!`)
      .setFooter(client.user.username, client.user.avatarURL);
    client.channels.get(kanal).send(embed);
    db.delete(`sayaçhedef_${member.guild.id}`);
    db.delete(`sayaçkanal_${member.guild.id}`);
    db.delete(`sayaçmsjhg_${member.guild.id}`);
    db.delete(`sayaçmsjbb_${member.guild.id}`);
    return;
  }
  if (rol < member.guild.memberCount) {
    const embed = new Discord.RichEmbed()
      .setColor("#ffd100")
      .setDescription(`Tebrikler Başarılı Bir Şekilde ${rol} Kişi Olduk`)
      .setFooter(client.user.username, client.user.avatarURL);
    client.channels.get(kanal).send(embed);
    db.delete(`sayaçhedef_${member.guild.id}`);
    db.delete(`sayaçkanal_${member.guild.id}`);
    db.delete(`sayaçmsjhg_${member.guild.id}`);
    db.delete(`sayaçmsjbb_${member.guild.id}`);
    return;
  }
  if (!msj) {
    const embed = new Discord.RichEmbed()
      .setColor("#ffd100")
      .setDescription(
        `**@${
          member.user.tag
        }** Adlı Kullanıcı Aramıza Katıldı! **${rol}** Kişi Olmamıza **${rol -
          member.guild.memberCount}** Kişi Kaldı!`
      )
      .setFooter(client.user.username, client.user.avatarURL);
    client.channels.get(kanal).send(embed);
    return;
  } else {
    var msj2 = msj
      .replace(`-sunucu-`, `${member.guild.name}`)
      .replace(`-uye-`, `${member.user.tag}`)
      .replace(`-uyetag-`, `<@${member.user.id}>`)
      .replace(`-hedef-`, `${rol}`)
      .replace(`-hedefkalan-`, `${rol - member.guild.memberCount}`);
    const embed = new Discord.RichEmbed()
      .setColor("#ffd100")
      .setDescription(msj2)
      .setFooter(client.user.username, client.user.avatarURL);
    client.channels.get(kanal).send(embed);
    return;
  }
});



//////////////






client.on('guildMemberAdd', async (member, guild, message) => {

let role = db.fetch(`otorolisim_${member.guild.id}`)
 let otorol = db.fetch(`autoRole_${member.guild.id}`)
 let i = db.fetch(`otorolKanal_${member.guild.id}`)
 if (!otorol || otorol.toLowerCase() === 'yok') return;
else {
 try {
  ///////////lord

  if (!i) return 
if (!role) {
  member.addRole(member.guild.roles.get(otorol))
                        var embed = new Discord.RichEmbed()
                        .setDescription("<a:hypesquad1:755370163292864614> **Sunucuya Yeni Katılan** @" + member.user.tag + " **Kullanıcısına** <@&" + otorol + ">  **Rolü verildi**")
                        .setColor('#ffd100') 
                        .setFooter(`Kyrizers Otorol Sistemi`)
     member.guild.channels.get(i).send(embed) 
} else if (role) {
    member.addRole(member.guild.roles.get(otorol))
                        var embed = new Discord.RichEmbed()
                        .setDescription(`<a:hypesquad1:755370163292864614> **Sunucuya Yeni Katılan** \`${member.user.tag}\` **Kullanıcısına** \`${role}\` **Rolü verildi**`)
                        .setColor('#ffd100') 
                        .setFooter(`Kyrizers Otorol Sistemi`)
     member.guild.channels.get(i).send(embed) 
  
}
 } catch (e) {
 console.log(e)
}
}

});



/////////////////////////
client.on('message', async (msg, member, guild) => {
  let i = await  db.fetch(`saas_${msg.guild.id}`)
      if(i === 'açık') {
        if (msg.content.toLowerCase() === 'sa') {
        msg.reply('<a:hypesquad1:755370163292864614> **Aleyküm Selam Hoşgeldin**');      
      } 
      }
    });
///////////////////////


//////////////////////////
client.on("guildMemberAdd", async member => {
  let codeming = await db.fetch(`ototag_${member.guild.id}`)
    let miran= await db.fetch(`ototagk_${member.guild.id}`);
  if (!codeming) return;
  //if (!kanal) return;{}
  if(miran){
     member.setNickname(`${codeming} | ${member.user.username}`);
    const amil = new Discord.RichEmbed()
      .setColor("#ffd100")
      .setDescription(`<a:hypesquad1:750076071721828452> **@${member.user.tag}** Adlı Kişiye Tag Verildi!`)
      .setFooter(client.user.username, client.user.avatarURL);
    client.channels.get(miran).send(amil);
    return;
  }
  else if(!miran){
     member.setNickname(`${codeming} ${member.user.username}`);
    return;
  } 


})
/////// OTTAG











///<a:EMOJİİSİM:EMOJİİD>

client.on("message", msg => {
  var dm = client.channels.get("718503187153158194")
  if(msg.channel.type === "dm") {
  if(msg.author.id === client.user.id) return;
  const botdm = new Discord.RichEmbed()
  .setTitle(`${client.user.username} Dm`)
  .setTimestamp()
  .setColor("#ffd100")
  .setThumbnail(`${msg.author.avatarURL}`)
  .addField("Gönderen", msg.author.tag)
  .addField("Gönderen ID", msg.author.id)
  .addField("Gönderilen Mesaj", msg.content)
  
  dm.send(botdm)
  
  }
  if(msg.channel.bot) return;
  });







  client.on("guildMemberAdd", async(member) => {
    let sunucupaneli = await db.fetch(`sunucupanel_${member.guild.id}`)
    if(sunucupaneli) {
      let rekoronline = await db.fetch(`panelrekor_${member.guild.id}`)
      let toplamuye = member.guild.channels.find(x =>(x.name).startsWith("Toplam Üye •"))
      let toplamaktif = member.guild.channels.find(x =>(x.name).startsWith("Aktif Üye •"))
      let botlar = member.guild.channels.find(x =>(x.name).startsWith("Botlar •"))
      let rekoraktif = member.guild.channels.find(x =>(x.name).startsWith("Rekor Aktiflik •"))
      
      if(member.guild.members.filter(off => off.presence.status !== 'offline').size > rekoronline) {
        db.set(`panelrekor_${member.guild.id}`, member.guild.members.filter(off => off.presence.status !== 'offline').size)
      }
      try{
        toplamuye.setName(`Toplam Üye • ${member.guild.members.size}`)
        toplamaktif.setName(`Aktif Üye • ${member.guild.members.filter(off => off.presence.status !== 'offline').size}`)
        botlar.setName(`Botlar • ${member.guild.members.filter(m => m.user.bot).size}`)
        rekoraktif.setName(`Rekor Aktiflik • ${rekoronline}`)
     } catch(e) { }
    }
  })
  
  client.on("guildMemberRemove", async(member) => {
    let sunucupaneli = await db.fetch(`sunucupanel_${member.guild.id}`)
    if(sunucupaneli) {
      let rekoronline = await db.fetch(`panelrekor_${member.guild.id}`)
      let toplamuye = member.guild.channels.find(x =>(x.name).startsWith("Toplam Üye •"))
      let toplamaktif = member.guild.channels.find(x =>(x.name).startsWith("Aktif Üye •"))
      let botlar = member.guild.channels.find(x =>(x.name).startsWith("Botlar •"))
      let rekoraktif = member.guild.channels.
      find(x =>(x.name).startsWith("Rekor Aktiflik •"))
      
      if(member.guild.members.filter(off => off.presence.status !== 'offline').size > rekoronline) {
        db.set(`panelrekor_${member.guild.id}`, member.guild.members.filter(off => off.presence.status !== 'offline').size)
      }
      try{
        toplamuye.setName(`Toplam Üye • ${member.guild.members.size}`)
        toplamaktif.setName(`Aktif Üye • ${member.guild.members.filter(off => off.presence.status !== 'offline').size}`)
        botlar.setName(`Botlar • ${member.guild.members.filter(m => m.user.bot).size}`)
        rekoraktif.setName(`Rekor Aktiflik • ${rekoronline}`)
     } catch(e) { }
    }
  })


const DBL = require("dblapi.js");
const dbl = new DBL('', client);

// Optional events
dbl.on('posted', () => {
  console.log('Server count posted!');
})

dbl.on('error', e => {
 console.log(`Oops! ${e}`);
})




         client.on("roleDelete", async(role , channel , message , guild) => {
          let rolkoruma = await db.fetch(`rolk_${role.guild.id}`);
            if (rolkoruma == "acik") {
          role.guild.createRole({name: role.name, color: role.color,  permissions: role.permissions}) 
                role.guild.owner.send(`<a:hypesquad1:755370163292864614> **${role.name}** Adlı Rol Silindi Ve Ben Rolü Tekrar Oluşturdum  :white_check_mark:`)
        
          
        }
        }) 



        client.on("guildMemberAdd", async member => {
          if (db.has(`botkoruma_${member.guild.id}`) === false) return;
          if (member.user.bot === false) return;
          if (db.has(`botİzinli_${member.id}`) === true) return;
          
          member.kick(member, `Bot Koruması Aktif!`)
          
          member.guild.owner.send(`<a:hypesquad1:755370163292864614> Sunucunuza Bir Bot Eklendi ve Sunucudan Otomatik Olarak Atıldı, Sunucuya Eklenmesini Onaylıyor iseniz \`-giriş-izni ${member.id}\``)
          })


