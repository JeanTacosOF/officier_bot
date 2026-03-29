const { Client, SlashCommandBuilder, MessageFlags, ChannelType, EmbedBuilder } = require('discord.js');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const ListCMD = require("../sheet_list.js");
const getFunction = require("../functions/get.js");
const config = require("../config.js");
const insertFunction = require("../functions/insert.js");
const DiscordCMD = require("../functions/discord.js");
const { JWT } = require('google-auth-library'); // nécessaire pour v6+

async function recommander(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    
    if (!interaction.member.roles.cache.some(role => config.ROLES_OFF.includes(role.id))) {
        await interaction.reply({
            content: 'Vous devez avoir le rôle Officier pour utiliser cette commande !',
            flags: MessageFlags.Ephemeral
        });
        return;
    }

    const tAuthor = await getFunction.byDiscordID(interaction.user.id);
    const tObserved = await getFunction.bySteamID(interaction.options.getString('steamid'));

    if (!tObserved) {
        await interaction.editReply({
            content: '❌ Aucun membre trouvé avec ce SteamID.'
        });
        return;
    }
    
    if (!tAuthor) {
        await interaction.editReply({
            content: '❌ Votre compte Discord n\'est pas lié à un membre.'
        });
        return;
    }

    const iRecommended = tObserved.toObject()["Discord:ID"];
    const sAuthor = tAuthor.toObject()["Nom de Code"];
    const sRecommanded = tObserved.toObject()["Nom de Code"];
    const sGrade = tObserved.toObject()["Grade"];

    await insertFunction.insertRecommandation(sAuthor, sRecommanded, interaction.options.getString('raison'), interaction.options.getBoolean('mission') ? "Mission" : "PCS/EXP/Autre", sGrade);
    await DiscordCMD.sendRecommandation(interaction.client, config.SALONS.reco_off, interaction.user.id, iRecommended, interaction.options.getString('raison'), interaction.options.getBoolean('mission') ? "Mission" : "PCS/EXP/Autre", sGrade);

await interaction.editReply({ content: '✅ Recommandation enregistrée.' });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reco_off')
        .setDescription('Recommande un AIT sur Discord.')
        .addStringOption(option =>
            option
                .setName('raison')
                .setDescription('La raison de la recommandation')
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName('mission')
                .setDescription('True = Mission, False = PCS/EXP/Autre')
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