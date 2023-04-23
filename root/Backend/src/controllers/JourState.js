const GameState = require("./gameState");

class JourState extends GameState {
  constructor(context) {
    super(context)
  }

  /**
   * The list aof action that will treated : 
   * Login
   * Chat message
   * Pouvoir special
   * Vote
   * Disconnect
   */
  handleMessage() {
  }

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

  //Changes the current game state to jour
  //and sends game state information  to the players 
  setupCode(){

  }

}

module.exports = JourState;
