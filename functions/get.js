const { GoogleSpreadsheet } = require('google-spreadsheet');
const config = require("../config.js");
const base = require("./base.js");

async function bySteamID(sSteamID) {
    const auth = base.createAuth();
    const connection = new GoogleSpreadsheet(config.SHEET_ID, auth);
    await connection.loadInfo();
    const pageEffectif = connection.sheetsByTitle[config.NAME_SHEET_CATEGORIES.effectif];

    const rows = await pageEffectif.getRows();
    const row = rows.find(r => String(r.toObject()['Steam:ID 64']) === String(sSteamID));
    return row;
}

async function byDiscordID(sDiscordID) {
    const auth = base.createAuth();
    const connection = new GoogleSpreadsheet(config.SHEET_ID, auth);
    await connection.loadInfo();
    const pageEffectif = connection.sheetsByTitle[config.NAME_SHEET_CATEGORIES.effectif];

    const rows = await pageEffectif.getRows();
    const row = rows.find(r => String(r.toObject()['Discord:ID']) === String(sDiscordID));
    return row;
}

module.exports = { bySteamID, byDiscordID };