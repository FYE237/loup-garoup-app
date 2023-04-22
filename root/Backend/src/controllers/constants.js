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
  vivant: "vivant",
  mort: "mort",
};

const ROLE = {
  villageois: "villageois",
  loupGarou: "loupGarou",
  speciauxLoup: ["voyanteLoup", "spiritismeLoup", "contamination"],
  speciauxHumain: ["voyanteHumain", "spiritismeHumain", "insomnie"],
  //this value we will be used when the game is on hold and
  //it has not started yet but when the game starts
  //every player will be associated a certain role
  noRole: "norole",
};

const CHAT_TYPE = {
  general: "general_chat",
  loup: "loup_chat",
  customChat: "customChat",
};

module.exports = {
  GAME_STATUS,
  PLAYER_STATUS,
  CHAT_TYPE,
  ROLE,
};
