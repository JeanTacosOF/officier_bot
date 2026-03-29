const { Client, SlashCommandBuilder, MessageFlags, ChannelType, EmbedBuilder } = require('discord.js');
const config = require("../config.js");
const base = require("./base.js");

async function sendRecommandation(client, iChannel, iAuthord, iObserved, sReason, sType, sGrade) {
    let embed = new EmbedBuilder()
        .setTitle(`:pushpin: | Nouvelle recommandation !`)
        .addFields(
            { name: ":shield: | Recommandé", value: `<@${iObserved}>`, inline: true },
            { name: ":speech_balloon: | Observateur", value: `<@${iAuthord}>`, inline: true },
            { name: ":page_with_curl: | Raison", value: sReason, inline: true },
            { name: ":radio: | Type", value: sType, inline: true },
            { name: ":calendar_spiral: | Date", value: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }), inline: true },
            { name: ":mortar_board: | Grade", value: sGrade, inline: true }
        )
        .setTimestamp()
        .setColor("#510069")
        .setThumbnail("https://i.imgur.com/A3aQhBM.png")
        .setFooter({ text: `Cosmos-Community | Fait par Newtown` });

    const channel = await client.channels.fetch(iChannel);
    await channel.send({ embeds: [embed] });
}


async function sendObservation(client, iChannel, iAuthord, iObserved, sReason, sType, sGrade) {
    let embed = new EmbedBuilder()
        .setTitle(`:pushpin: | Nouvelle observation !`)
        .addFields(
            { name: ":shield: | Observé", value: `<@${iObserved}>`, inline: true },
            { name: ":speech_balloon: | Observateur", value: `<@${iAuthord}>`, inline: true },
            { name: ":page_with_curl: | Raison", value: sReason, inline: true },
            { name: ":radio: | Type", value: sType, inline: true },
            { name: ":calendar_spiral: | Date", value: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }), inline: true },
            { name: ":mortar_board: | Grade", value: sGrade, inline: true }
        )
        .setTimestamp()
        .setColor("#510069")
        .setThumbnail("https://i.imgur.com/A3aQhBM.png")
        .setFooter({ text: `Cosmos-Community | Fait par Newtown` });

    const channel = await client.channels.fetch(iChannel);
    await channel.send({ embeds: [embed] });
}

async function sendCompteRendus(client, iChannel, iAuthord, iObserved, sReason, sNotation) {
    let embed = new EmbedBuilder()
        .setTitle(`:pushpin: | Nouveau compte rendu !`)
        .addFields(
            { name: ":speech_balloon: | Formatteur", value: `<@${iAuthord}>`, inline: true },
            { name: ":shield: | Formé(e) ", value: `<@${iObserved}>`, inline: true },
            { name: ":page_with_curl: | Avis", value: sReason, inline: true },
            { name: ":calendar_spiral: | Date", value: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }), inline: true },
            { name: ":mortar_board: | Notation", value: String(sNotation), inline: true }
        )
        .setTimestamp()
        .setColor("#510069")
        .setThumbnail("https://i.imgur.com/A3aQhBM.png")
        .setFooter({ text: `Cosmos-Community | Fait par Newtown` });

    const channel = await client.channels.fetch(iChannel);
    await channel.send({ embeds: [embed] });
}

async function sendCRRefus(client, iChannel, iAuthord, iObserved, sReason, sNotation) {
    let dateTommorow = new Date()
    dateTommorow.setDate(dateTommorow.getDate() + 1);
    dateTommorow = dateTommorow.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    let embed = new EmbedBuilder()
        .setTitle(`:pushpin: | Nouveau refusé !`)
        .addFields(
            { name: ":speech_balloon: | Formatteur", value: `<@${iAuthord}>`, inline: true },
            { name: ":shield: | Formé(e) ", value: `<@${iObserved}>`, inline: true },
            { name: ":page_with_curl: | Avis", value: sReason, inline: true },
            { name: ":calendar_spiral: | Peut Repasser le", value: dateTommorow, inline: true },
            { name: ":mortar_board: | Notation", value: String(sNotation), inline: true }
        )
        .setTimestamp()
        .setColor("#510069")
        .setThumbnail("https://i.imgur.com/A3aQhBM.png")
        .setFooter({ text: `Cosmos-Community | Fait par Newtown` });

    const channel = await client.channels.fetch(iChannel);
    await channel.send({ embeds: [embed] });
}


async function sendMPAuto(client, idDiscord, sName, sAvis, iNotation) {
    let embed = new EmbedBuilder()
        .setTitle(`:pushpin: | Bienvenue chez les AIT !`)
        .setDescription("**Merci de Mettre :** \n ```AGT-AIT " + sName + "``` **En Nom sur le Discord** (Si pas déja mis) !")
        .addFields(
            { name: ":speech_balloon: | Formatteur", value: `<@${idDiscord}>`, inline: true },
            { name: ":page_with_curl: | Avis", value: sAvis, inline: true },
            { name: ":calendar_spiral: | Date", value: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }), inline: true },
            { name: ":mortar_board: | Notation", value: String(iNotation), inline: true }
        )
        .setTimestamp()
        .setColor("#510069")
        .setThumbnail("https://i.imgur.com/A3aQhBM.png")
        .setFooter({ text: `Cosmos-Community | Fait par Newtown` });

    await client.users.fetch(idDiscord).then(async (user) => {
        await user.send({ embeds: [embed] });
    });

}

async function sendMPRefus(client, idDiscord, sAvis, iNotation) {
    let dateTommorow = new Date()
    dateTommorow.setDate(dateTommorow.getDate() + 1);
    dateTommorow = dateTommorow.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    let embed = new EmbedBuilder()
        .setTitle(`:pushpin: | Vous êtes refusé(e) !`)
        .addFields(
            { name: ":speech_balloon: | Formatteur", value: `<@${idDiscord}>`, inline: true },
            { name: ":page_with_curl: | Avis", value: sAvis, inline: true },
            { name: ":calendar_spiral: | Repassez le", value: dateTommorow, inline: true },
            { name: ":mortar_board: | Notation", value: String(iNotation), inline: true }
        )
        .setTimestamp()
        .setColor("#510069")
        .setThumbnail("https://i.imgur.com/A3aQhBM.png")
        .setFooter({ text: `Cosmos-Community | Fait par Newtown` });
    await client.users.fetch(idDiscord).then(async (user) => {
        await user.send({ embeds: [embed] });
    });
}
module.exports = { sendRecommandation, sendObservation, sendCompteRendus, sendMPAuto, sendMPRefus, sendCRRefus };