const GameState = require("./gameState");
const { GAME_STATUS, GAME_VALUES, PLAYER_STATUS, SPECIAL_POWERS } = require("./constants");
const debug = require('debug')('JourState');
const Partie = require('../models/partie');
const User = require('../models/user');
const Joueur_partie_role = require('../models/joueur_partie_role');

class JourState extends GameState {
  constructor(context) {
    super(context)
    //variablee where we store the number of player who has voted
    this.nbVoteJour = 0;
    this.lockVotes = false;
  }

  /**
   * The list of action that will treated in this state are : 
   * Chat message
   * Pouvoir special
   * Vote
   */

  /**
   * Processes and update the vote counter related to every player and 
   * global counter, if all of the players have voted we simply count the votes
   * and decide if there was a majority 
   * @param {*} pseudoVoteur 
   * @param {*} candidantVote 
   * @param {*} id_partie 
   * @param {*} socket 
   */
  async handleVote(pseudoVoteur, candidantVote, socket_id) {
    debug("Handle vote for the day state was called");
    if (!this.verifyThatVoteIsPossible(pseudoVoteur, candidantVote)){
      debug("Vote is not possible");
    }
    debug(pseudoVoteur+" can vote and is voting for  " + candidantVote);
    let voteCounter = this.context.currentPlayersVote.get(candidantVote)
    
    if(!voteCounter) {
      debug("Premier vote contre : " + candidantVote)
      voteCounter = 0
    }
    
    this.context.currentPlayersVote.set(candidantVote, voteCounter+1)
    this.context.VotersList.push(pseudoVoteur);

    //We increment the number of votes that have occured in this game 
    this.nbVoteJour++;

    //We inform the player that his vote has been registered
    this.context.nsp.to(socket_id).emit("VoteJourEnregistré",{description:"Vote-Okay"})
    
    //On informe les autres participants dont la personne a voté pour: 
    this.context.nsp.to(this.context.roomId).emit("notif-vote",{
      message : pseudoVoteur + "has voted for : " + candidantVote,
      voteur : pseudoVoteur, 
      candidat : candidantVote
    })
    //On check pour savoir si tous les joueurs vivants ont voté
    if(this.nbVoteJour === this.context.nbAlivePlayer){
      clearTimeout(this.timeout);
      await this.timerCooldown();    
    }
  }

  async finaliseVotingProcess(){
    //On remet le nombre de votes à 0
    this.lockVotes = true;
    this.nbVoteJour = 0;
    this.context.VotersList = [];
    //variable who check if there is there are many players with the
    //same number of votes
    let duplicate = true;

    //On recupere l'id du joueur avec le plus de vote contre lui
    let maxKey = "";
    let maxValue = 0;
    for (let [key, value] of this.context.currentPlayersVote) {
        if (value > maxValue) {
            maxValue = value;
            maxKey = key;
            duplicate = false
        }
        else if(value === maxValue) {duplicate = true}
    }
    //We reset the hash map as it is no longer needed and to 
    //delete all of the old roles
    this.context.currentPlayersVote = new Map();
    // if (maxValue <= 0){
    //   debug("No vote was made");
    //   return;
    // }
    //Les joueurs ont pu s'entendre
    if(duplicate != true){
        //Remarque : On n'a pas besoin de faire ca : 
        //Est ce que je dois supprimer les joueurs morts de la liste des votes des joueurs
        //this.context.currentPlayersVote.delete(maxKey)
        
        debug("Update of player statut after votes")


        //On decremente le nombre de joueurs vivants :
        this.context.nbAlivePlayer--
        //On change le statut du joueur avec le plus de vote contre lui
        //On récupère son id_joueur        
        const playerId = await this.getPlayerId(maxKey); 
        //On change son statut
        await Joueur_partie_role.updateOne({id_joueur:playerId, id_partie: this.context.partieId}, {statut:PLAYER_STATUS.mort});
        //On signale à tous les joueurs qui est mort
        this.context.nsp.to(this.context.roomId).emit("notif-vote-final",{
          message : "Un joueur a été tué : " + maxKey,
        })
        //We make the player join the wolf chat room since he can read their messages now
        
        const joueurPowerLink = await Joueur_partie_role
        .findOne({id_joueur:playerId, id_partie:this.context.partieId})
        let playerSocket = this.context.nsp.sockets.get(joueurPowerLink.socket_id);
        playerSocket.join(this.context.loupChatRoom);
    }
    //Les joueurs n'ont pas pu s'entendre
    else{
        this.context.nsp.to(this.context.roomId).emit("notif-vote-final", {
          message : "Aucun joueur a été tué",
        })
    }
  }


  
  /**
   * this method will be called every time we enter the game state, 
   * it will set the timer for changing the state that will call the change state method 
   * which will call the endcode of this class
   * This function will also be used to send all of the information related to the game to all of the players
   * like their role and their special powers and the chats that they are allowed to access 
   */
  async setupCode(){
    debug("Setting up jour state")
    await this.updateGameStatusDataBase(GAME_STATUS.jour);
    await this.sendGameStatus();
    await this.sendPlayersInformation();
    //We unlock votes
    this.context.usedPower = [];
    this.lockVotes = false;
    this.configureTimer();
  }

  /**
   * All of the 
   * this function will do a checkup upon the actual state of the votes and then 
   * it will verify that the game can continue 
   * if that is the case it will authorise the for the state to change by retuning a one 
   * and it will cancel the change stat by returning a zero
   */
  endCode(){
    debug("Currently in the end of code of the night state");
    return 1;
  }

  /**
   * This function will first finalise the voting process 
   * and it will check if we can continues the game 
   * if that is the case it will change the state 
   */
  async timerCooldown(){
    debug("Timer cooldown or all players voted changing state, current state = "+this.context.gameStatus);
    await this.finaliseVotingProcess();
    if (! (await this.checkGameStatus())){
      debug("Game ended, trying to go to the end state");
      await this.context.setState(this.context.stateFinJeu);
      return;
    }
    debug("All is valid, trying to go to the night state");
    setTimeout(this.goToNight.bind(this), 
                    3000);  
  }

  async goToNight(){
    await this.context.setState(this.context.stateNuit);
  }
  
  configureTimer(){   
    debug("Configuring timer for the jour state")
    this.startTime = Date.now();
    if (!this.context.dureeJour){
      throw Error("Timer was not configured correctly; day length not present")
    }
    this.timeout = setTimeout(this.timerCooldown.bind(this), 
                    (this.context.dureeJour*GAME_VALUES.hour_time_s)*1000);
  }

}

module.exports = JourState;
