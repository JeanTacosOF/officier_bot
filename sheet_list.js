const { GoogleSpreadsheet } = require('google-spreadsheet');
const { Client, SlashCommandBuilder, MessageFlags, ChannelType, EmbedBuilder } = require('discord.js');
const config = require("./config.js");
const creds = require("./creditentials.json");
const { JWT } = require('google-auth-library'); 

function createAuth() {
    return new JWT({
        email: creds.client_email,
        key: creds.private_key.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
}

function replyInteraction(interaction, content) {
    return interaction.reply({ content, flags: MessageFlags.Ephemeral }).catch(console.error);
}

async function addToRegister(sAIT, sGrade, sSanction, sReason) {
    const auth = createAuth();
    const connection = new GoogleSpreadsheet(config.SHEET_ID, auth);
    await connection.loadInfo();
    var date = new Date();
    date = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const registreAIT = connection.sheetsByTitle[config.NAME_SHEET_CATEGORIES.registre];
    const totalRows = registreAIT.rowCount;

    await registreAIT.loadCells(`B2:B${totalRows}`);

    let lineToPut = 0;

    for (let i = 0; i < totalRows - 1; i++) {
        const cell = registreAIT.getCellByA1(`B${i + 2}`);
        if (cell.value === null || cell.value === '') {
            lineToPut = i + 2;
            break;
        }
    }

    if (lineToPut === 0) {
        console.log("[INFO] Pas assez de place dans le registre, je rajoute 25 lignes.");
        lineToPut = totalRows + 1;
        await registreAIT.resize({
            rowCount: totalRows + 25,
            columnCount: registreAIT.columnCount
        });
    }

    await registreAIT.loadCells(`B${lineToPut}:F${lineToPut}`);

    registreAIT.getCellByA1(`B${lineToPut}`).value = date;
    registreAIT.getCellByA1(`C${lineToPut}`).value = sAIT;
    registreAIT.getCellByA1(`D${lineToPut}`).value = sGrade ? sGrade : "";
    registreAIT.getCellByA1(`E${lineToPut}`).value = sSanction ? sSanction : "";
    registreAIT.getCellByA1(`F${lineToPut}`).value = sReason ? sReason : "";

    await registreAIT.saveUpdatedCells();
}

function createEmbed(sTitle, sColor) {
    var embed = new EmbedBuilder()
        .setTitle(sTitle ? sTitle : "Titre Non Défini")
        .setColor(sColor ? sColor : 0xFF0000)
        .setTimestamp(new Date())

    return embed;
}

module.exports = {createAuth, replyInteraction, addToRegister, createEmbed};