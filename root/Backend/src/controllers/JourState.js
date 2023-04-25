const GameState = require("./gameState");
const { GAME_STATUS, GAME_VALUES, PLAYER_STATUS } = require("./constants");
const debug = require('debug')('JourState');

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
  async handleVote(pseudoVoteur, candidantVote, socket) {
    if (!this.verifyThatVoteIsPossible(pseudoVoteur, candidantVote)){
      debug("Vote is not possible");
    }
    const voteCounter = this.context.currentPlayersVote.get(candidantVote)
    this.context.currentPlayersVote.set(candidantVote, voteCounter+1)
    this.context.VotersList.append(pseudoVoteur);

    //We increment the number of votes that have occured in this game 
    this.nbVoteJour++;

    //We inform the player that his vote has been registered
    socket.emit("VoteJourEnregistré",{description:"Vote-Okay"})
    
    //On informe les autres participants dont la personne a voté pour: 
    this.context.nsp.to(this.context.roomId).emit("notif-vote",{
      message : pseudoVoteur + "has voted for : " + candidantVote,
      voteur : pseudoVoteur, 
      candidat : candidantVote
    })
    //On check pour savoir si tous les joueurs vivants ont voté
    if( this.nbVoteJour === this.context.nbAlivePlayer){
      await this.finaliseVotingProcess();
    }
  }

  async finaliseVotingProcess(){
    //On remet le nombre de votes à 0
    this.lockVotes = true;
    this.nbVoteJour = 0;
    this.context.VotersList = [];
    //variable who check if there is there are many players with the
    //same number of votes
    let duplicate;

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
    //Les joueurs ont pu s'entendre
    if(duplicate != true){
        //Remarque : On n'a pas besoin de faire ca : 
        //Est ce que je dois supprimer les joueurs morts de la liste des votes des joueurs
        //this.context.currentPlayersVote.delete(maxKey)
        
        //On decremente le nombre de joueurs vivants :
        this.context.nbAlivePlayer--
        //On change le statut du joueur avec le plus de vote contre lui
        //On récupère son id_joueur
        const value = await User.findOne({name:maxKey}).select({_id:1,__v:0,password:0})
        //On change son statut
        await Joueur_partie_role.updateOne({id_joueur:value.id_joueur,id_partie: this.context.partieId},{statut:PLAYER_STATUS.mort});
        //On signale à tous les joueurs qui est mort
        this.context.nsp.to(this.context.roomId).emit("JoueurMort",{name:maxKey})
    }
    //Les joueurs n'ont pas pu s'entendre
    else{
        this.context.nsp.to(this.context.roomId).emit("NoJoueurMORT")
    }
  }

  async handleSpiritisme(nsp, socket, pseudoJoueur, pseudoCible){
    debug("Handle pouvoir spiritisme called");
    //On retoruve l'_id de la sorciere
    const joueurPowerId = await this.getPlayerId(pseudoJoueur);
    //On retrouve l'_id du joueur mort
    const cibleId = await this.getPlayerId(pseudoCible);
    if (!joueurPowerId || !cibleId){
      debug("One or all of the specified players do not exist, please restate the verify pseudo values")
      throw new Error("One or all of the specified players do not exist, please restate the verify pseudo values")
    }
    
    //On retrouve le socket.id du joueur mort dans la partie
    const joueur = await joueur_partie_role.findOne({id_joueur:value._id,id_partie:this.context.id_partie})
    //On retrouve le socket.id de la sorciere dans la partie
    const sorciere = await joueur_partie_role.findOne({id_joueur:value_sorciere._id,id_partie:this.context.id_partie})

    
    /** 
     * TODO VERIFY THAT BOTH PLAYERS ARE FIT THIS POWER
     * Create a chat room and add both players in it 
     * create a new table in joueur partie link that had a list of all custom chat toom that 
     * this player can access
     * Reset this list going from night to day
     * Join both sockets to the chat messages
     * Add the created chat to the list of chats that will be sent when we send player info
     * Test this functionallity
    */

    //On informe  le joueur qu'on souhaite lui parler et on lui communique le socket.id de la sorciere
    socket.to(joueur.socket_id).emit("RequestDiscussionSorciere",{emetteur:id_joueur,socket_id_sorciere:sorciere.socket_id})
    //On envoie le socket.id de l'autre joueur à la sorciere 
    socket.to(sorciere.socket_id).emit("SendPlayerSocketIdToSorciere",{socket_id_joueur:joueur.socket_id})

    //On ecoute les méssages sortant de la sorciere  
    //room ici c'est le socket.id du joueur mort avec lequel la socket veut communiquer
    socket.on("send-message-Sorciere",(message,room) => {

        debug("send:"+message)

        //Seule le joueur discutant avec la sorciere recoit les méssages
        socket.to(room).emit('receive-message-Sorciere',message)
        
    })
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
    this.updateGameStatusDataBase(GAME_STATUS.jour);
    this.sendGameStatus();
    this.sendPlayersInformation();
    this.configureTimer();
  }

  /**
   * this function will do a checkup upon the actual state of the votes and then 
   * it will verify that the game can continue 
   * if that is the case it will authorise the for the state to change by retuning a one 
   * and it will cancel the change stat by returning a zero
   */
  endCode(){

  }

  /**
   * This function will see if we can continues the game and
   * if that is the case it will change the state 
   */
  timerCooldown(){
    debug("Timer cooldown or all players voted changing state, current state = "+this.context.gameStatus);
    if (!this.checkGameStatus()){
      debug("Game ended, trying to go to the end state");
      this.context.setState(this.context.stateFinJeu);
      return;
    }
    debug("All is valid, trying to go to the night state");
    this.context.setState(this.context.stateNuit);
  }

  configureTimer(){   
    debug("Configuring timer for the jour state")
    this.startTime = Date.now();
    if (!this.context.dureeJour){
      throw Error("Timer was not configured correctly; day time not present")
    }
    this.timeout = setTimeout(this.timerCooldown.bind(this), 
                    (this.context.dureeJour*GAME_VALUES.hour_time_s)*1000);
  }

}

module.exports = JourState;
