import { images, SPECIAL_POWERS, ROLE } from '../constants'


const getRoleImage = (role) => {
  if (role == ROLE.humain){
    return images.villager_icon;
  }
  if (role == ROLE.loupGarou){
    return images.wolf_game_icon;
  }
}

const getPowerImage = (power) => {
  switch (power){
    case SPECIAL_POWERS.voyanteLoup:
    case SPECIAL_POWERS.voyanteHumain:
      return images.voyance_icon
    case SPECIAL_POWERS.spiritismeLoup:
    case SPECIAL_POWERS.spiritismeHumain:
      return images.spiritisme_icon
    case SPECIAL_POWERS.insomnie:
      return images.Insomnie_icon
    case SPECIAL_POWERS.contamination:
      return images.contamination_icon
    default:
      return null
  }
}

const IMAGE_FUNC = {
  powerImageFunc : getPowerImage, 
  roleImageFunc : getRoleImage, 
}

export {
  IMAGE_FUNC
};
