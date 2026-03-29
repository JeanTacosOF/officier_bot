const { 
    Client, 
    Collection, 
    GatewayIntentBits, 
    REST, 
    Routes,
    ActivityType,
    MessageFlags,
    EmbedBuilder,
    ChannelType
} = require('discord.js');

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const config = require('./config.js');
const cron = require('node-cron');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, // ✅ obligatoire pour guild.members.fetch()
        GatewayIntentBits.GuildMessages
    ]
});

client.commands = new Collection();
const commands = [];

// 📂 Chargement des commandes
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
        console.log(`[INFO] Commande ${file} chargée.`);
    } else {
        console.log(`[WARNING] Commande ${file} invalide.`);
    }
}

// 🚀 Ready
client.once('clientReady', async () => {
    console.log(`[INFO] ${client.user.tag} est connecté.`);

    client.user.setActivity(config.ACTIVITY_STATUS.sName, {
        type: ActivityType.Streaming,
        url: config.ACTIVITY_STATUS.sChannel
    });

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('[INFO] Déploiement des slash commands...');
        startCron();
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log('[INFO] Slash commands déployées ✅');
    } catch (error) {
        console.error(error);
    }
});

// 🎯 Interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'Erreur lors de l’exécution.',
                flags: MessageFlags.Ephemeral
            });
        } else {
            await interaction.reply({
                content: 'Erreur lors de l’exécution.',
                flags: MessageFlags.Ephemeral
            });
        }
    }
});

function startCron() {
    cron.schedule(config.CRON_Events.etat_major, () => {
        let channelAnnonce = client.channels.cache.get(config.SALONS.etat_major);
        
        channelAnnonce.send({
            content: "<@&" + config.ROLES.etat_major + "> | Etat Major Maintenant ! 🚨",
        })
        
    });
    cron.schedule(config.CRON_Events.obs_off_sup, async () => {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        await guild.members.fetch();
        console.log("[INFO] Observation sur ")
        const tRoles_OffSup = guild.roles.cache.get(config.ROLES.off_sup);
        const tRoles_OFF = guild.roles.cache.get(config.ROLES.off);
        const channel_Obs_OFFSUP = client.channels.cache.get(config.SALONS.obs_off_sup);
        const RoleMembers = [...tRoles_OffSup.members.values()];
        const RoleMembers2 = [...tRoles_OFF.members.values()];

        for (let i = 0; i < RoleMembers.length; i++) {
            const offSup = RoleMembers[i];
            const randomOFF = RoleMembers2[Math.floor(Math.random() * RoleMembers2.length)];

            await channel_Obs_OFFSUP.threads.create({
                name: `Observation sur ${randomOFF.user.tag} ( par ${offSup.user.tag} )`,
                message: {
                    content: `<@${randomOFF.id}> Est chargé d'être observé cette semaine par : <@${offSup.id}>`,
                }
            });

            console.log(`✅ ${randomOFF.user.tag} observé par ${offSup.user.tag}`);
        }
    });
}


client.login(process.env.DISCORD_TOKEN);

