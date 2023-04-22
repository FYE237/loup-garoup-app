const GameState = require("./gameState");

class NuitState extends GameState {
  constructor(context) {
    super(context)
    this.deadPlayer = ""
  }


  /**
   * The list aof action that will treated : 
   * Login
   * Chat message
   * Pouvoir special
   * Vote
   * Disconnect
   */
  handleRejoindreJeu() {
  }

  handleMessage() {
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

  handleDisconnect() {
  }
}

module.exports = NuitState;

