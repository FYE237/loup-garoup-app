const GameState = require('./gameState');
const debug = require('debug')('EndGame');
const {GAME_STATUS, CHAT_TYPE, ROLE, PLAYER_STATUS,
  GAME_VALUES, SPECIAL_POWERS} = require("./constants");
const Partie = require('../models/partie');
const User = require('../models/user');
const Joueur_partie_role = require('../models/joueur_partie_role');

class FinJeuState extends GameState {
  constructor(context) {
    super(context)
  }

  /**
   * The list of action that will treated : 
   * Login
   * Chat message
   * Pouvoir special
   * Vote
   * Disconnect
   */
  handleMessage() {
  }

  handleDisconnect() {
  }

  async setupCode(){    
    await this.updateGameStatusDataBase(GAME_STATUS.finJeu);
    await this.sendGameStatus();
  }


}

module.exports = FinJeuState;
