const { Client, SlashCommandBuilder, MessageFlags, ChannelType, EmbedBuilder } = require('discord.js');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const config = require("../config.js");
const sheetCMD = require("../sheet_list.js");
const insertFunction = require("../functions/insert.js");
const getFunction = require("../functions/get.js");
const discordFunction = require("../functions/discord.js");
const { JWT } = require('google-auth-library'); // nécessaire pour v6+

async function recommander(interaction) {
    if (!interaction.member.roles.cache.some(role => config.ROLES_OFF.includes(role.id))) {
        await interaction.reply(interaction, 'Vous devez avoir le rôle Officier pour utiliser cette commande !');
        return;
    }

    if (isNaN(interaction.options.getString('steamid'))) {
        await interaction.reply(interaction, 'Le SteamID Semble être incorrect !');
        return;
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    if (interaction.options.getInteger('notation') < 7) {
        await discordFunction.sendCRRefus(interaction.client, config.SALONS.cr_refus_rct, interaction.user.id, interaction.options.getMentionable('utilisateur').id, "Note trop faible", interaction.options.getInteger('notation'));
        await discordFunction.sendMPRefus(interaction.client, interaction.options.getMentionable('utilisateur').id,  interaction.options.getString('note'), interaction.options.getInteger('notation'));
        await interaction.editReply({ content: `✅ Formation Agent Enregistrée !` });
        return;
    }



    const tAuthor = await getFunction.byDiscordID(interaction.user.id);
    const tObserved = await getFunction.bySteamID(interaction.options.getString('steamid'));
    const tDObserved = await getFunction.byDiscordID(interaction.options.getMentionable('utilisateur').id);

    if (tDObserved !== undefined &&  tObserved !== undefined) {
        await interaction.editReply({ content: '❌ Il y a deja un membre avec ce SteamID ou cet Id Discord.' });
        return;
    }

    let sName = interaction.options.getString('nomrecrue');
    let sGrade = "Agent";
    let iSteamID = interaction.options.getString('steamid');
    let iDiscordID = interaction.options.getMentionable('utilisateur').id;

    await insertFunction.insertEffectif(sName, "Agent", iSteamID, iDiscordID);
    await insertFunction.insertRegistre(sName, sGrade, "", `Formation Agent Reussi ( Fait par ${tAuthor.toObject()["Nom de Code"]} )`, "Bot");
    await interaction.editReply({ content: `✅ Formation Agent Enregistrée !` });
    await discordFunction.sendCompteRendus(interaction.client, config.SALONS.cr_agt_ait, interaction.user.id, interaction.options.getMentionable('utilisateur').id, interaction.options.getString('note'), interaction.options.getInteger('notation'));
    await discordFunction.sendMPAuto(interaction.client, iDiscordID, sName, interaction.options.getString('note'), interaction.options.getInteger('notation'));
    await interaction.guild.members.edit(iDiscordID, {
        nick: `AGT-AIT ${sName}`
    });

    const member = await interaction.guild.members.fetch(iDiscordID);
    await member.roles.add(config.ROLES_AGENT_AIT);
    

}   

module.exports = {
    data: new SlashCommandBuilder()
        .setName('formation_agent')
        .setDescription('Recommande un AIT sur Discord.')
        .addStringOption(option =>
            option
                .setName('note')
                .setDescription('Un avis sur la personne recruté. Si Refus alors il faut indiquer pourquoi ou les questions fausses')
                .setRequired(true)
        )
        .addMentionableOption(option =>
            option
                .setName('utilisateur')
                .setDescription('Mentionner la personne recommandée')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('nomrecrue')
                .setDescription('Entrez le nom de la personne formée')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('notation')
                .setDescription('notation entre 1 et 10')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('steamid')
                .setDescription('Le SteamID de la personne recommandée')
                .setRequired(true)
        ),

    async execute(interaction) {
        await recommander(interaction);
    },
};