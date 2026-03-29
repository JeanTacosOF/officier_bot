const { Client, SlashCommandBuilder, MessageFlags, ChannelType, EmbedBuilder } = require('discord.js');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const ListCMD = require("../sheet_list.js");
const getFunction = require("../functions/get.js");
const config = require("../config.js");
const insertFunction = require("../functions/insert.js");
const DiscordCMD = require("../functions/discord.js");
const SHEET_ID = '1xiDOvQEv0COVzrC--HvIN0_pm7KYDyU25ujHs064Cs0';


async function observation(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    if (!interaction.member.roles.cache.some(role => config.ROLES_SOFF.includes(role.id))) {
        await interaction.editReply({
            content: 'Vous devez avoir le rôle Officier pour utiliser cette commande !'
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

    const iObserved = tObserved.toObject()["Discord:ID"];
    const sAuthor = tAuthor.toObject()["Nom de Code"];
    const sObserved = tObserved.toObject()["Nom de Code"];
    const sGrade = tObserved.toObject()["Grade"];

    await insertFunction.insertObservation(sAuthor, sObserved, interaction.options.getString('raison'), interaction.options.getBoolean('positive') ? "Positive" : "Négative", sGrade);
    await DiscordCMD.sendObservation(interaction.client, config.SALONS.obs, interaction.user.id, iObserved, interaction.options.getString('raison'), interaction.options.getBoolean('positive') ? "Positive" : "Négative", sGrade);

    await interaction.editReply({ content: '✅ Observation enregistrée.' });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('observation')
        .setDescription('Observer un AIT.')
        .addStringOption(option =>
            option
                .setName('raison')
                .setDescription('La raison de la recommandation')
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName('positive')
                .setDescription('True = Positive, False = Négative')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('steamid')
                .setDescription('Le SteamID de la personne recommandée')
                .setRequired(true)
        ),

    async execute(interaction) {
        await observation(interaction);
    },
};