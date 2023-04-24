const GameState = require("./gameState");

class NuitState extends GameState {
  constructor(context) {
    super(context)
    //Cette valeur est à reinitialiser à chaque changement de gamestate
    this.deadPlayer = ""
    this.nbVoteNuit = 0
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

  async handleVote(socket,id_joueur,room,currentPlayersVote,id_socket) {
    if(room != "") {
      this.nbVoteNuit++ ;

      const val = currentPlayersVote.get(id_joueur)
      currentPlayersVote.set(id_joueur,val+1)

      //On répond au joueur que son vote a été pris en compte
      socket.to(id_socket).emit("VoteNuitEnregistré",{description:"Vote-Okay"})

      //On informe les autres loup-garous du joueur voté : 
      socket.emit("notif-vote-nuit",{name:id_joueur})

      //On check pour savoir si tous les joueurs vivants ont voté
      if(  this.nbVoteNuit === this.nbAlivePlayer)
      {
          //On remet le nombre de votes à 0
          this.nbVoteNuit = 0

          //variable who check if there is many person with the same number of votes
          let duplicate;

          //On recupere l'id du joueur avec le plus de votes contre lui
          let maxKey = "";
          let maxValue = -1;
          for (let [key, value] of this.currentPlayersVote) {
              if (value > maxValue) {
                  maxValue = value;
                  maxKey = key;
                  duplicate = false
              }
              else if(value === maxValue) duplicate = true
          }

          //Les loups ont pu s'entendre
          if(duplicate != true){
              //Est ce que je dois supprimer les joueurs morts de la liste des votes des joueurs
              this.currentPlayersVote.delete(maxKey)

              //On décremente le nombre de joueurs vivants :
              this.nbAlivePlayer--

              //On change le statut du joueur avec le plus de vote contre lui
              //On récupère son id_joueur
              const value = await User.findOne({name:maxKey}).select({_id:1,__v:0,password:0})
              //On change son statut
              await Joueur_partie_role.updateOne({id_joueur:value.id_joueur,id_partie:this.partieId},{statut:PLAYER_STATUS.mort});

              //On change le state pour indiquer quel joueur a été tué pendant la nuit.
              this.deadPlayer=maxKey;
              
              // On indique aux loups que leur choix a été pris en compte
              socket.in(room).emit("JoueurMortByLoup",{name:maxKey})
          }
          //Les loups n'ont pas pu s'entendre pour tuer quelqu'un
          else {
               // On indique aux loups que leur choix a été pris en compte
               socket.in(room).emit("NoJoueurMortByLoup")
          }
      }

    }
  }

  handlePouvoir() {
  }

  handleDisconnect() {
  }
}

module.exports = NuitState;

