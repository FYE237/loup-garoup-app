const GameState = require('./gameState');
const debug = require('debug')('FinJeuState');
const {GAME_STATUS, CHAT_TYPE, ROLE, PLAYER_STATUS,
  GAME_VALUES, SPECIAL_POWERS} = require("./constants");
const Partie = require('../models/partie');
const User = require('../models/user');
const Joueur_partie_role = require('../models/joueur_partie_role');

/**
 * This state only displays game related info to the user 
 * and recives no input
 */
class FinJeuState extends GameState {
  constructor(context) {
    super(context)
  }

  /**
   * No action gets treated is this state: 
   * Disconnect and message handlers are present simply because 
   * we don't want to call the default method
   */
  handleMessage() {}

  handleDisconnect() {}

  async sendGameResult(){
    let nbAliveLoup = await this.getCountRole(ROLE.loupGarou, PLAYER_STATUS.vivant);
    let humainAlive = await this.getCountRole(ROLE.humain, PLAYER_STATUS.vivant);
    let message = "";
    if (humainAlive>0){
      message = "Les humains ont gagné"
    }
    else{
      message = "Les loups ont gagné"
    }
    this.context.nsp.to(this.context.roomId).emit("game-result", {
        message : message,
    })
  }
  async setupCode(){    
    debug("Setting up finJeu state");
    await this.updateGameStatusDataBase(GAME_STATUS.finJeu);
    await this.sendGameStatus();
    await this.sendPlayersInformation();
    await this.sendGameResult();
    this.configureTimer();
  }

  configureTimer(){   
    this.timeout = setTimeout(this.timerCooldown.bind(this),
                  1000000);
  }

  
  timerCooldown(){
    this.context.nsp.in(this.context.roomId).disconnectSockets(true, (error) => {
      if (error) {
        debug('Error disconnecting sockets:', error);
      } else {
        debug('All sockets disconnected from room:', roomName);
      }
    });

  }



}

module.exports = FinJeuState;
