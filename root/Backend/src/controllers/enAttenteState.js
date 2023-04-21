// const Joueur_partie_role = require('../models/joueur_partie_role')

const GameState = require('./gameState');


class EnAttenteState extends GameState {
  constructor(context) {
    super(context)
  }


  /**
   * The list aof action that will treated in the wait state : 
   * Login
   * Disconnect
   */
  async handleRejoindreJeu(socket, pseudo, socket_id) {
    const player_id = this.getPlayerId(pseudo) 
    const res = await Joueur_partie_role.updateOne(
          {id_joueur:player_id, id_partie : this.context.partieId},
          {socket_id : socket_id})
    addPlayerIntoContext(pseudo);
    if (nb_actif_players == this.context.nnbParticipantSouhaite){
      this.launchGame();
    }
  }

  addPlayerIntoContext(pseudo){
    //Players can only be added if the game is in the wait state
    this.context.nb_actif_players++;
    if (this.context.pseudoList.includes(pseudo)){
      this.context.pseudoList.push(pseudo)
    }
  }

  removePlayerFromContext(pseudo){
    this.context.nb_actif_players--;
    this.context.pseudoList = this.context.pseudoList.filter(value => value !==pseudo);
  }
  
  async handleDisconnect(id_joueur, socket_id) {
    //The pseudo of the player will be extract from the sockeid
    const pseudo = await getPlayerPseudo(id_joueur); 
    removePlayerFromContext(pseudo)
    await Joueur_partie_role.deleteOne({ socket_id: socket_id });
  }
  
  //Will be called when we start the game, it will be used 
  //Roles will attributed at this level
  endCode(){

  }

  startGameTimer(){
    //Il faut vérifier que le nombre de jour connecté 
    //est supérieur ou égal à une valeur sépcifique 
    console.log("hello from timer");
    //We check if the game started
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

  /**
   * This function is used to initialize the variable of the 
   * context and it start a timer that will the check if it start the game
   */
  async setupCode(){
    await this.context.initAttributs();
    console.log("heure " + this.context.heureDebut)
    setTimeout(this.startGameTimer.bind(this), this.context.heureDebut);
  }


}

module.exports = EnAttenteState;

