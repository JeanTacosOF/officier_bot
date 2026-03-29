const SHEET_ID = 'N/A';

const ROLES_SOFF = [
    "1474305229611859980",
    "1474305199563735187"
]

const ROLES_OFF = [
    "1474305229611859980"
]

const ROLES_AGENT_AIT = [
    "1474304597462876160",
    "1474304581537370295"
]

const SALONS = {
    logs: "1474164046495355002",
    reco: "1474304662046773309",
    obs: "1474304673987956831",
    reco_off: "1474312152364875908",
    obs_off: "1474516341443657880",
    cr_agt_ait: "1474304695098019972",
    cr_refus_rct: "1474513887935201462",
    dev_error: "1474687166771626108",
    obs_off: "1476503617556185198",
    obs_off_sup: "1476503617556185198",
    etat_major: "1474153424722464781",
}

const RCT_NOTATION_VALIDE = 7

const ROLES_SANCTION = {
    avert_compt: "1474305229611859980",
    avert_activ: "1474305229611859980",
    blame1: "1474305229611859980",
    blame2: "1474305199563735187",
    blame3: "1474305229611859980",
    blacklist: "1474305229611859980"
}

const NAME_SHEET_CATEGORIES = {
    effectif: "Effectif Global",
    registre: "Registre Global",
    recommandation: "Recommandations",
    observation: "Observations"
};

const ACTIVITY_STATUS = {
    sName: "Surveiller les AIT",
    sChannel: "https://www.twitch.tv/cosmosait"
}

const CRON_Events = {
    etat_major: "0 18 * * 5",
    obs_off_sup: "0 17 * * 5"
}

const ROLES = {
    off: "1474305229611859980",
    etat_major: "1476506576289402901",
    off_sup: "1476506648922292369"
}


module.exports = { SHEET_ID, ROLES_SOFF, ROLES_OFF, ROLES_AGENT_AIT, ROLES_SANCTION, SALONS, RCT_NOTATION_VALIDE, NAME_SHEET_CATEGORIES, ACTIVITY_STATUS, CRON_Events, ROLES };