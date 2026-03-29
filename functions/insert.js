const { GoogleSpreadsheet } = require('google-spreadsheet');
const config = require("../config.js");
const base = require("./base.js");

async function insertObservation(sAuthor, sObserved, sReasonn, sType, sGrade) {
    const auth = base.createAuth();
    const connection = new GoogleSpreadsheet(config.SHEET_ID, auth);
    await connection.loadInfo();
    const pageEffectif = connection.sheetsByTitle[config.NAME_SHEET_CATEGORIES.observation];

    await pageEffectif.insertDimension('ROWS', { startIndex: 1, endIndex: 2 });

    await pageEffectif.loadHeaderRow();
    const headers = pageEffectif.headerValues;

    const newData = {
        'Date': new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        'Auteur': sAuthor,
        'Observé': sObserved,
        'Grade': sGrade,
        'Raison': sReasonn,
        'Type': sType,
    };

    await pageEffectif.loadCells(`A2:${String.fromCharCode(65 + headers.length - 1)}2`);

    // Colonnes A et H à colorer différemment (index 0 et 7)
    const specialColumns = [0, 7];

    headers.forEach((header, i) => {
        const cell = pageEffectif.getCell(1, i);
        cell.value = newData[header] ?? '';

        if (specialColumns.includes(i)) {
            cell.backgroundColor = { red: 0, green: 0, blue: 0 }; // Couleur spéciale A et H
        } else {
            cell.backgroundColor = { red: 0.6, green: 0.6, blue: 0.6 }; // #999999
        }
    });

    await pageEffectif.saveUpdatedCells();
}

async function insertRecommandation(sAuthor, sObserved, sReasonn, sType, sGrade) {
    const auth = base.createAuth();
    const connection = new GoogleSpreadsheet(config.SHEET_ID, auth);
    await connection.loadInfo();
    const pageEffectif = connection.sheetsByTitle[config.NAME_SHEET_CATEGORIES.recommandation];

    await pageEffectif.insertDimension('ROWS', { startIndex: 1, endIndex: 2 });

    await pageEffectif.loadHeaderRow();
    const headers = pageEffectif.headerValues;

    const newData = {
        'Date': new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        'Fait Par': sAuthor,
        'Recommandé': sObserved,
        'Grade': sGrade,
        'Raison': sReasonn,
        'Type': sType,
    };

    await pageEffectif.loadCells(`A2:${String.fromCharCode(65 + headers.length - 1)}2`);

    // Colonnes A et H à colorer différemment (index 0 et 7)
    const specialColumns = [0, 7];

    headers.forEach((header, i) => {
        const cell = pageEffectif.getCell(1, i);
        cell.value = newData[header] ?? '';

        if (specialColumns.includes(i)) {
            cell.backgroundColor = { red: 0, green: 0, blue: 0 }; // Couleur spéciale A et H
        } else {
            cell.backgroundColor = { red: 0.6, green: 0.6, blue: 0.6 }; // #999999
        }
    });

    await pageEffectif.saveUpdatedCells();

}

async function insertRegistre(sAuthor, sGrade, sSanction, sReasonn, sType) {
    const auth = base.createAuth();
    const connection = new GoogleSpreadsheet(config.SHEET_ID, auth);
    await connection.loadInfo();
    const pageRegistre = connection.sheetsByTitle[config.NAME_SHEET_CATEGORIES.registre];

    await pageRegistre.insertDimension('ROWS', { startIndex: 1, endIndex: 2 });

    await pageRegistre.loadHeaderRow();
    const headers = pageRegistre.headerValues;

    const newData = {
        'Date': new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        'NomRP': sAuthor,
        'UP/RETRO': sGrade,
        'Sanction': sSanction,
        'Raison': sReasonn,
        'Type': sType,
    };

    await pageRegistre.loadCells(`A2:${String.fromCharCode(65 + headers.length - 1)}2`);

    // Colonnes A et H à colorer discrepantement (index 0 et 7)
    const specialColumns = [0, 7];

    headers.forEach((header, i) => {
        const cell = pageRegistre.getCell(1, i);
        cell.value = newData[header] ?? '';

        if (specialColumns.includes(i)) {
            cell.backgroundColor = { red: 0, green: 0, blue: 0 }; // Couleur spéciale A et H
        } else {
            cell.backgroundColor = { red: 0.6, green: 0.6, blue: 0.6 }; // #999999
        }
    });

    await pageRegistre.saveUpdatedCells();
}

async function insertEffectif(sName, sGrade, iSteamID, iDiscordID) {
    const auth = base.createAuth();
    const connection = new GoogleSpreadsheet(config.SHEET_ID, auth);
    await connection.loadInfo();
    const pageEffectif = connection.sheetsByTitle[config.NAME_SHEET_CATEGORIES.effectif];

    // ✅ On charge toutes les cellules sans passer par getRows()
    await pageEffectif.loadCells();

    // ✅ Cherche la dernière ligne utilisée via la colonne C
    let line = 0;
    for (let i = pageEffectif.rowCount - 1; i >= 1; i--) {
        const cell = pageEffectif.getCell(i, 2); // Colonne C
        if (cell.value !== null && cell.value !== '') {
            line = i + 1; // On insère après la dernière ligne non vide
            break;
        }
    }

    // ✅ Si le sheet est plein, on agrandit
    if (line >= pageEffectif.rowCount - 5) {
        await pageEffectif.resize({
            rowCount: pageEffectif.rowCount + 25,
            columnCount: pageEffectif.columnCount
        });
        await pageEffectif.loadCells();
    }

    // ✅ Couleurs
    const specialColumns = [0, 20, 21, 22, 23];
    for (let i = 0; i < pageEffectif.columnCount; i++) {
        const cell = pageEffectif.getCell(line, i);
        const bgColor = specialColumns.includes(i)
            ? { red: 0, green: 0, blue: 0 }
            : { red: 0.6, green: 0.6, blue: 0.6 };

        cell._rawData.userEnteredFormat = {
            ...(cell._rawData.userEnteredFormat ?? {}),
            backgroundColor: bgColor
        };
    }

    // ✅ Données
    pageEffectif.getCell(line, 1).value = sGrade === 'Agent' ? 'HDR' : sGrade;
    pageEffectif.getCell(line, 2).value = sName;
    pageEffectif.getCell(line, 3).value = sGrade;
    pageEffectif.getCell(line, 4).value = iSteamID;
    pageEffectif.getCell(line, 5).value = iDiscordID;

    // ✅ Formules
    pageEffectif.getCell(line, 11).formula = `=SI(NB.SI.ENS('Registre Absence'!C:C;C${line + 1};'Registre Absence'!F:F;"Absent");"Absent";"Présent")`;
    pageEffectif.getCell(line, 12).formula = `=SI(NB.SI.ENS('Registre Absence'!$C$2:$C$853; C${line + 1}; 'Registre Absence'!$B$2:$B$853; "<=" & AUJOURDHUI()-1; 'Registre Absence'!$E$2:$E$853; ">=" & AUJOURDHUI()-7) > 0; "Absent"; "Présent")`;
    pageEffectif.getCell(line, 13).formula = `=MAX(FILTER('Registre Global'!B:B; 'Registre Global'!C:C = C${line + 1}; 'Registre Global'!D:D <> ""))`;
    pageEffectif.getCell(line, 14).formula = `=CHECKUP(C${line + 1}; N${line + 1})`;
    pageEffectif.getCell(line, 17).formula = `=NB.SI(Recommandations!D:D; C${line + 1})`;
    pageEffectif.getCell(line, 18).formula = `=NB.SI.ENS(Observations!D:D; C${line + 1}; Observations!G:G; "Positive")`;
    pageEffectif.getCell(line, 19).formula = `=NB.SI.ENS(Observations!D:D; C${line + 1}; Observations!G:G; "Négative")`;

    await pageEffectif.saveUpdatedCells();
}

module.exports = { insertObservation, insertRecommandation, insertRegistre, insertEffectif };