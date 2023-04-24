const GameState = require("./gameState");

const debug = require('debug')('NuitState');
const {GAME_STATUS, CHAT_TYPE, ROLE, PLAYER_STATUS, GAME_VALUES} = require("./constants")


class NuitState extends GameState {
  constructor(context) {
    super(context)
    this.deadPlayer = ""
  }


  /**
   * The list of action that will treated : 
   * Pouvoir special
   * Vote
   */

  async setupCode(){    
    debug("Setting up night state")
    this.updateGameStatusDataBase(GAME_STATUS.soir);
    this.sendGameStatus();
    this.sendPlayersInformation();
    this.configureTimer();
  }

  handleVote(socket,id_joueur,room,currentPlayersVote) {
    if(room != "") {
      const val = currentPlayersVote.get(id_joueur)
      currentPlayersVote.set(id_joueur,val+1)

      //On répond au joueur que son vote a été pris en compte
      socket.to(socket.id).emit("VoteNuitEnregistré",{description:"Vote-Okay"})

      //On informe les autres loup-garous du joueur voté : 
      socket.to(room).emit("notif-vote-nuit",{name:id_joueur})
    }
  }

  handlePouvoir() {
  }

  timerCooldown(){
    debug("Timer cooldown changing state, current state = "+this.context.GameState);
    
    //Game ended going to the end game state
    //debug("Game ended, trying to go to the end state");

    debug("All is valid, trying to go to the day state");
    this.context.setState(this.context.stateJour);
  }

  configureTimer(){
    this.startTime = Date.now();
    if (!this.context.dureeNuit){
      throw Error("Timer was not configured correctly; night time not present")
    }
    this.timeout = setTimeout(this.timerCooldown.bind(this), 
                    (this.context.dureeNuit*GAME_VALUES.hour_time_s)*1000);
  }

}

module.exports = NuitState;
