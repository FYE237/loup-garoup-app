import { images, SPECIAL_POWERS, ROLE, GAME_STATUS } from '../constants'

const getRoleName = (role) => {
  switch (role){
    case ROLE.humain:
      return "humain"
    case ROLE.loupGarou:
      return "loup"
    default:
      return ""
  }}

const getPowerNames = (power) => {
  switch (power){
    case SPECIAL_POWERS.voyanteLoup:
    case SPECIAL_POWERS.voyanteHumain:
      return "voyance"
    case SPECIAL_POWERS.spiritismeLoup:
    case SPECIAL_POWERS.spiritismeHumain:
      return "spiritisme"
    case SPECIAL_POWERS.insomnie:
      return "insomnie"
    case SPECIAL_POWERS.contamination:
      return "contamination"
    default:
      return ""
  }
}

const gameStateName = (status) => {
  switch (status){
    case GAME_STATUS.enAttente:
      return "En attendant que le jeu commence !"
    case GAME_STATUS.jour:
      return "Jour"
    case GAME_STATUS.soir:
      return "Nuit"
    case GAME_STATUS.finJeu:
      return "Le jeu est terminé"
    default:
      return ""
  }
}

const NAMING_FUNC = {
  powerNameFunc : getPowerNames, 
  roleNameFunc : getRoleName, 
  gameNameFunc : gameStateName
}

export {
  NAMING_FUNC
};

