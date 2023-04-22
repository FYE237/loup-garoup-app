// const Joueur_partie_role = require('../models/joueur_partie_role')

const GameState = require('./gameState');
const {GAME_STATUS} = require("./constants")
const Joueur_partie_role = require('../models/joueur_partie_role')

class EnAttenteState extends GameState {
  constructor(context) {
    super(context)
  }

  /**
   * The list of action that will treated in this state are : 
   * Login
   * Disconnect
   */
  async handleRejoindreJeu(nsp, socket, pseudo, socket_id) {
    console.log("[EnAttenteState] handleRejoindreJeu");
    const player_id = await this.getPlayerId(pseudo) 
    console.log("[EnAttenteState] join idplayer " + player_id)
    console.log("[EnAttenteState] idGame to join" + this.context.partieId)
    if (!player_id){
      console.log("[EnAttenteState]Player is unknown");
    }
    const res = await Joueur_partie_role.updateOne(
          {id_joueur:player_id, id_partie : this.context.partieId},
          {socket_id : socket_id}).then(result => {console.log("res"+JSON.stringify(result));return result;})
    //We check to see if a match was found
    if (res.n == 0){
      //no match, we leave immediatly 
      //as the player is not registerd in the game
      return;
    }
    this.addPlayerIntoContext(pseudo);
    //We connect the player to the game room  one we have verified
    //his id and made sure is registered to the game
    socket.join(this.context.roomId);
    let data = {
      message : pseudo + " has joined the game",
      nb_players_actuel : this.context.nb_actif_players,
      nb_participant_souhaite : this.context.nbParticipantSouhaite,
      temps_restant : this.remainingTime(),
      status : GAME_STATUS.enAttente
    }
    console.log("[EnAttenteState] PLayer "+pseudo+" has joind the game : " + this.context.partieId);
    nsp.to(this.context.roomId).emit('status-game', data);
    if (this.context.nb_actif_players == this.context.nbParticipantSouhaite){
      this.launchGame();
    }
  }

  addPlayerIntoContext(pseudo){
    //Players can only be added if the game is in the wait state
    if (!this.context.pseudoList.includes(pseudo)){
      this.context.nb_actif_players++;
      this.context.pseudoList.push(pseudo)
    }
  }

  removePlayerFromContext(pseudo){
    this.context.nb_actif_players--;
    this.context.pseudoList = this.context.pseudoList.filter(value => value !==pseudo);
  }
  
  async handleDisconnect(nsp, id_joueur, socket_id) {
    console.log("[EnAttenteState] handleDisconnect");
    //The pseudo of the player will be extract from the sockeid
    const {name} = await this.getPlayerPseudo(id_joueur); 
    if (!name){
      return;
    }
    console.log("[EnAttenteState] player disconnecting = " + name);
    this.removePlayerFromContext(name);
    await Joueur_partie_role.deleteOne({ socket_id: socket_id, id_joueur : id_joueur });
    let data = {
      message : name + " has left the game",
      nb_players_actuel : this.context.nb_actif_players,
      nb_participant_souhaite : this.context.nbParticipantSouhaite,
      temps_restant : this.remainingTime(),
      status : GAME_STATUS.enAttente
    };
    nsp.to(this.context.roomId).emit('status-game', data);
  }
  
  //Will be called when we start the game, it will be used 
  //Roles will attributed at this level
  endCode(){

  }

  startGameTimer(){
    //Il faut vérifier que le nombre de jour connecté 
    //est supérieur ou égal à une valeur sépcifique 
    //We check if the game started
    console.log("[EnAttenteState] Starting game");
    if (this.context != this.context.EnAttenteState){
      return;
    }
    this.launchGame();
  }

  launchGame(){
    if (this.context != this.context.EnAttenteState){
      return;
    }
    this.context.setState(this.context.stateJour);
  }

  remainingTime(){
    const elapsedTime = Date.now() - this.startTime;
    const timeLeft = this.context.heureDebut - elapsedTime;
    return timeLeft;
  }
  /**
   * This function is used to initialize the variable of the 
   * context and it start a timer that will the check if it start the game
   */
  async setupCode(){
    await this.context.initAttributs();
    this.startTime = Date.now();
    setTimeout(this.startGameTimer.bind(this), this.context.heureDebut);
  }


}

module.exports = EnAttenteState;

