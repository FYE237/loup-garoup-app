/**
 * This files contains the contant value that will be used in the player management
 *  part of the game
 */
const GAME_STATUS = {
  enAttente: "enAttente",
  jour: "jour",
  soir: "soir",
  finJeu: "finJeu",
};

const PLAYER_STATUS = {
  vivant : "vivant",
  mort : "mort",
  deconnecte : "deconnecte"
}

const SPECIAL_POWERS = {
  voyanteLoup : "voyanteLoup", 
  spiritismeLoup : "spiritismeLoup", 
  contamination : "contamination",
  voyanteHumain : "voyanteHumain", 
  spiritismeHumain : "spiritismeHumain", 
  insomnie : "insomnie",
}

const ROLE = {
  villageois: "villageois",
  loupGarou: "loupGarou",
  speciauxLoup: ["voyanteLoup", "spiritismeLoup", "contamination"],
  speciauxHumain: ["voyanteHumain", "spiritismeHumain", "insomnie"],
  noRole : "noRole"
}


const CHAT_TYPE = {
  general_chat : "general_chat",
  loup_chat : "loup_chat",
  custom_chat : "customChat"
}

module.exports = {
  GAME_STATUS,
  PLAYER_STATUS,
  CHAT_TYPE,
  ROLE,
  SPECIAL_POWERS
};
