const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel]
});

const prefix = '?';

// Ton token ici :
client.login('MTM1ODg3OTM3Njc4MjkxNzY3Mg.Gjp-oY.3sVhd_5DWHTfHlb8RwQGVNql7F2u0XbqtxqRyw');

client.on('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Commande ?ping
  if (command === 'ping') {
    message.reply('Pong !');
  }

  // Commande ?dmall <id_salon>
  if (command === 'dmall') {
    if (!message.member.permissions.has('Administrator')) {
      return message.reply("Tu n'as pas la permission d'utiliser cette commande.");
    }

    const channelId = args[0];
    if (!channelId) return message.reply("Donne l'ID d'un salon du serveur cible.");

    try {
      const inviteChannel = await client.channels.fetch(channelId);
      const invite = await inviteChannel.createInvite({ maxAge: 0, maxUses: 0 });

      const members = await message.guild.members.fetch();

      members.forEach(member => {
        if (!member.user.bot) {
          member.send(`Rejoins ce serveur : ${invite.url}`).catch(() => {
            console.log(`Impossible d'envoyer un DM à ${member.user.tag}`);
          });
        }
      });

      message.reply("Invitation envoyée à tous les membres en DM !");
    } catch (error) {
      console.error(error);
      message.reply("Erreur lors de la création de l'invitation.");
    }
  }
});
