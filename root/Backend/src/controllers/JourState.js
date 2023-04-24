const GameState = require("./gameState");
const {GAME_VALUES} = require('../models/chat')
const debug = require('debug')('jourState');

class JourState extends GameState {
  constructor(context) {
    super(context)
    this.timeoutState = null;
  }

  /**
   * The list aof action that will treated : 
   * Chat message
   * Pouvoir special
   * Vote
   */

  /**
   * We update the number of vote on a player
   * @param {*} socket 
   * @param {*} id_joueur 
   * @param {*} currentPlayersVote 
   */
  handleVote(socket,id_joueur,currentPlayersVote) {
    const val = currentPlayersVote.get(id_joueur)
    currentPlayersVote.set(id_joueur,val+1)

    //On répond au joueur que son vote a été pris en compte
    socket.to(socket.id).emit("VoteJourEnregistré",{description:"Vote-Okay"})
    
    //On informe les autres participants du joueur voté : 
    socket.emit("notif-vote",{name:id_joueur})
  }

  handlePouvoir() {
  }

  /**
   * this method will be called every time we enter the game state, 
   * it will set the timer for changing the state that will call the change state method 
   * which will call the endcode of this class
   * This function will also be used to send all of the information related to the game to all of the players
   * like their role and their special powers and the chats that they are allowed to access 
   */
  setupCode(){
    
  }

  /**
   * this function will do a checkup upon the actual state of the votes and then 
   * it will verify that the game can continue 
   * if that is the case it will authorise the for the state to change by retuning a one 
   * and it will cancel the change stat by returning a zero
   */
  endCode(){

  }
  timerCooldown(){
  }

  configureTimer(){
    this.startTime = Date.now();
    if (!this.context.dureeJour){
      throw Error("Timer was not configured correctly; day time not present")
    }
    this.timeout = setTimeout(this.timerCooldown.bind(this), 
                    (this.context.dureeJour*GAME_VALUES.hour_time_s)*1000);
  }

}

module.exports = JourState;
