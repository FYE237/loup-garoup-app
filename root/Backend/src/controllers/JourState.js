const GameState = require("./gameState");

class JourState extends GameState {
  constructor(context) {
    super(context)
    //variablee where we store the number of player who has voted
    this.nbVoteJour = 0
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
   * @param {*} id_socket 
   * //id_socket is the player socket
   */
  async handleVote(socket,id_joueur,currentPlayersVote,id_socket) {
    const val = currentPlayersVote.get(id_joueur)
    currentPlayersVote.set(id_joueur,val+1)

    //On met à jour le nombre de vote
    this.nbVoteJour ++

    //On répond au joueur que son vote a été pris en compte
    socket.to(id_socket).emit("VoteJourEnregistré",{description:"Vote-Okay"})
    
    //On informe les autres participants du joueur voté : 
    socket.emit("notif-vote",{name:id_joueur})
    //On check pour savoir si tous les joueurs vivants ont voté
    if(  this.nbVoteJour === this.nbAlivePlayer)
    {
        //On remet le nombre de votes à 0
        this.nbVoteJour = 0

        //variable who check if there is many person with the same number of votes
        let duplicate;

        //On recupere l'id du joueur avec le plus de vote contre lui
        let maxKey = "";
        let maxValue = 0;
        for (let [key, value] of this.currentPlayersVote) {
            if (value > maxValue) {
                maxValue = value;
                maxKey = key;
                duplicate = false
            }
            else if(value === maxValue) duplicate = true
            
        }

        //Les joueurs ont pu s'entendre
        if(duplicate != true){
            //Est ce que je dois supprimer les joueurs morts de la liste des votes des joueurs
            this.currentPlayersVote.delete(maxKey)
            //On decremente le nombre de joueurs vivants :
            this.nbAlivePlayer--

            //On change le statut du joueur avec le plus de vote contre lui
            //On récupère son id_joueur
            const value = await User.findOne({name:maxKey}).select({_id:1,__v:0,password:0})
            //On change son statut
            await Joueur_partie_role.updateOne({id_joueur:value.id_joueur,id_partie:this.partieId},{statut:PLAYER_STATUS.mort});
            
            //On signale à tous les joueurs qui est mort
            socket.emit("JoueurMort",{name:maxKey})
        }
        //Les joueurs n'ont pas pu s'entendre
        else{
            socket.emit("NoJoueurMORT")
        }
    }
    
  }

  handlePouvoir() {
  }

  //Changes the current game state to jour
  //and sends game state information  to the players 
  setupCode(){

  }

}

module.exports = JourState;
