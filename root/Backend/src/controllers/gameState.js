
const Partie = require('../models/partie');
const User = require('../models/user');

class GameState {
  constructor(context) {
    this.context = context;
  }

  /**
   * Some of these functions will be redefined 
   * by the functions that need them
   * The list of action that will treated : 
   * Login
   * Chat message
   * Pouvoir special
   * Vote
   * Disconnect
   */
  handleRejoindreJeu() {
    return;
  }

  handleMessage() {
    return
  }

  handleVote(socket,id_joueur,currentPlayersVote) {
  }

  handleVote(socket,id_joueur,room,currentPlayersVote) {
  }

  handlePouvoir() {
    return;
  }

  //This function will do some treatement at this level 
  //but it will redifined by the waiting state
  handleDisconnect(id_joueur, socket_id) {
    return;
  }

  /**
   * Configurations functions 
   * These two functions will be called when the state changes
   * (when it launches and when it leave)
   * for example when we go in the day mode some data will be sent to the players
   * regarding the game status
   */
  setupCode(){

  }

  endCode(){

  }

  /**
   * Returns the id of the player that has the pseudo given
   * as argument
   * @param {*} pseudo pseudo of the player that looking for his id
   */
  async getPlayerId(pseudo){
    const res =  await User.findOne({name:pseudo}).select({_id:1,name:0,email:0,__v:0,password:0})
    console.log(res);
    return res;
  }

  /**
   * Returns the pseudo of the player that has the playerId given
   * as argument
   * @param {*} playerId playerId of the player that looking for his id
   */
    async getPlayerPseudo(playerId){
      const res =  await User.findOne({_id:playerId}).select({name:1})
      console.log(res);
      return res;
    }


}

module.exports = GameState;
