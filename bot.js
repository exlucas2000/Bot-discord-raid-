const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
});

// Commandes simples de modération
client.on('messageCreate', async (message) => {
  if (!message.guild || message.author.bot) return;

  // ?ban @user
  if (message.content.startsWith('?ban')) {
    if (!message.member.permissions.has('BanMembers')) return message.reply('Tu n’as pas la permission de bannir.');
    const user = message.mentions.members.first();
    if (!user) return message.reply('Mentionne un utilisateur à bannir.');
    await user.ban();
    message.channel.send(`${user.user.tag} a été banni.`);
  }

  // ?kick @user
  if (message.content.startsWith('?kick')) {
    if (!message.member.permissions.has('KickMembers')) return message.reply('Tu n’as pas la permission de kick.');
    const user = message.mentions.members.first();
    if (!user) return message.reply('Mentionne un utilisateur à kick.');
    await user.kick();
    message.channel.send(`${user.user.tag} a été kick.`);
  }

  // ?clear 5
  if (message.content.startsWith('?clear')) {
    if (!message.member.permissions.has('ManageMessages')) return message.reply('Tu n’as pas la permission de gérer les messages.');
    const args = message.content.split(' ');
    const count = parseInt(args[1]);
    if (!count || count < 1 || count > 100) return message.reply('Choisis un nombre entre 1 et 100.');
    const messages = await message.channel.bulkDelete(count, true);
    message.channel.send(`J’ai supprimé ${messages.size} messages.`).then(msg => {
      setTimeout(() => msg.delete(), 3000);
    });
  }
});

client.login('MTM1NTk3NzA3MDI4MjQxMjIzNA.GkMSjb.jRUanxmyCPaFdqU9LrwjCR-xndU71apfaZ6Z-Y');
