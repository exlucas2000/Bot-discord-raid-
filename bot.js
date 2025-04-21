const { Client, GatewayIntentBits, Partials, PermissionsBitField } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel]
});

const prefix = '?';

client.on('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ban') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply("Tu n'as pas la permission.");
        const member = message.mentions.members.first();
        if (!member) return message.reply("Mentionne un membre à bannir.");
        await member.ban();
        message.channel.send(`${member.user.tag} a été banni.`);
    }

    if (command === 'kick') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return message.reply("Tu n'as pas la permission.");
        const member = message.mentions.members.first();
        if (!member) return message.reply("Mentionne un membre à expulser.");
        await member.kick();
        message.channel.send(`${member.user.tag} a été expulsé.`);
    }

    if (command === 'clear') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return message.reply("Tu n'as pas la permission.");
        const count = parseInt(args[0]);
        if (isNaN(count) || count < 1 || count > 100) return message.reply("Donne un nombre entre 1 et 100.");
        await message.channel.bulkDelete(count, true);
        message.channel.send(`J'ai supprimé ${count} messages.`).then(msg => setTimeout(() => msg.delete(), 3000));
    }
});

client.login('MTM1NTk3NzA3MDI4MjQxMjIzNA.GkMSjb.jRUanxmyCPaFdqU9LrwjCR-xndU71apfaZ6Z-Y');
