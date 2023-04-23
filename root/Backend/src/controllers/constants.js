/**
 * This files contains the contant value that will be used in the player management
 *  part of the game
 */
const GAME_STATUS = {
  enAttente : "enAttente",
  jour : "jour",
  soir : "soir",
  finJeu : "finJeu"
}

const PLAYER_STATUS = {
  vivant : "vivant",
  mort : "mort",
  deconnecte : "deconnecte" //déconnecté
}

const ROLE = {
  villageois : "villageois",
  loupGarrou : "loupGarrou",
  //this value we will be used when the game is on hold and 
  //it has not started yet but when the game starts 
  //every player will be associated a certain role
  noRole : "noRole"
}

const CHAT_TYPE = {
  general_chat : "general_chat",
  loup_chat : "loup_chat",
  custom_chat : "customChat"
}


module.exports =  {
  GAME_STATUS,
  PLAYER_STATUS,
  CHAT_TYPE,
  ROLE
}
