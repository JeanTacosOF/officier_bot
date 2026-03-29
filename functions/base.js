const { GoogleSpreadsheet } = require('google-spreadsheet');
const config = require("../config.js");
const creds = require("../creditentials.json");
const { JWT } = require('google-auth-library'); 

function createAuth() {
    return new JWT({
        email: creds.client_email,
        key: creds.private_key.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return { red: r, green: g, blue: b };
}

module.exports = {createAuth, hexToRgb};