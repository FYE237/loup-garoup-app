const GameState = require("./gameState");

const debug = require('debug')('NuitState');
const {GAME_STATUS, CHAT_TYPE, ROLE, PLAYER_STATUS, GAME_VALUES} = require("./constants")


class NuitState extends GameState {
  constructor(context) {
    super(context)
    //Cette valeur est à reinitialiser à chaque changement de gamestate
    this.deadPlayer = ""
    this.nbVoteNuit = 0
    this.lockVotes = false;
    this.nbAliveLoup = -1;
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
    //We update the values of the alive loup
    this.nbAliveLoup = await this.getCountRole(ROLE.loupGarou, PLAYER_STATUS.vivant);
  }

  async handleVote(pseudoVoteur, candidantVote, socket) {
    if (!this.verifyThatVoteIsPossible(pseudoVoteur, candidantVote, ROLE.loupGarou)){
      debug("Vote is not possible");
    }
    const voteCounter = this.context.currentPlayersVote.get(candidantVote)
    this.context.currentPlayersVote.set(candidantVote, voteCounter+1)
    this.context.VotersList.append(pseudoVoteur);

    this.nbVoteNuit++;

    //On répond au joueur que son vote a été pris en compte
    socket.emit(id_socket).emit("VoteNuitEnregistré",{description:"Vote-Okay"})

    //On informe les autres loup-garous du joueur voté : 
    this.context.nsp.to(this.context.roomLoupId).emit("notif-vote-nuit", {
                message : pseudoVoteur + "has voted for : " + candidantVote,
                voteur : pseudoVoteur, 
                candidat : candidantVote
    });
    
    //On check pour savoir si tous les joueurs vivants ont voté
    if(this.nbVoteNuit === this.nbAliveLoup)
    {
      this.finaliseVotingProcess();
    }
  }

  async finaliseVotingProcess(){
    //On remet le nombre de votes à 0
    this.lockVotes = true;
    this.nbVoteNuit = 0
    this.context.VotersList = [];

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

    this.context.currentPlayersVote = new Map();
    //Les loups ont pu s'entendre
    if(duplicate != true){
        //Remarque : On n'a pas besoin de faire ca : 
        //Est ce que je dois supprimer les joueurs morts de la liste des votes des joueurs
        // this.currentPlayersVote.delete(maxKey)

        //On décremente le nombre de joueurs vivants :
        this.context.nbAlivePlayer--;

        //On change le statut du joueur avec le plus de vote contre lui
        //On récupère son id_joueur
        const value = await User.findOne({name:maxKey}).select({_id:1,__v:0,password:0})
        //On change son statut
        await Joueur_partie_role.updateOne({id_joueur:value.id_joueur,id_partie:this.context.partieId},{statut:PLAYER_STATUS.mort});
        
        //Je ne comprend pas cela 
        //On change le state pour indiquer quel joueur a été tué pendant la nuit.
        this.deadPlayer=maxKey;
        
        // On indique aux reste des jours la decision des loups;
        this.context.nsp.to(this.context.roomId).emit("JoueurMortByLoup",{name:maxKey})
    }
    //Les loups n'ont pas pu s'entendre pour tuer quelqu'un
    else {
        // On indique aux reste des jours la decision des loups;
        this.context.nsp.to(this.context.roomId).emit("NoJoueurMortByLoup")
    }
  }

  handlePouvoir() {
  }

  timerCooldown(){
    debug("Timer cooldown changing state, current state = "+this.context.gameStatus);
    this.finaliseVotingProcess();
    if (!this.checkGameStatus()){
      debug("Game ended, trying to go to the end state");
      this.context.setState(this.context.stateFinJeu);
      return;
    }
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
