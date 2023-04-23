// const Joueur_partie_role = require('../models/joueur_partie_role')

const GameState = require('./gameState');
const {GAME_STATUS, CHAT_TYPE, ROLE} = require("./constants")
const Joueur_partie_role = require('../models/joueur_partie_role')
const {Chat} = require('../models/chat')
const { v4: uuidv4 } = require('uuid');

const debug = require('debug')('EnAttenteState');


class EnAttenteState extends GameState {
  constructor(context) {
    super(context);
    this.nsp = null;
  }

  /**
   * The list of action that will treated in this state are : 
   * Login
   * Disconnect
   */
  async handleRejoindreJeu(nsp, socket, pseudo, socket_id) {
    //We save this so that we can use it later
    this.nsp = nsp; 
    debug("[EnAttenteState] handleRejoindreJeu");
    const player_id = await this.getPlayerId(pseudo) 
    debug("[EnAttenteState] Joining player pseudo = "+pseudo+" + player_id = "+ player_id._id)
    debug("[EnAttenteState] Game id " + this.context.partieId)
    if (!player_id){
      debug("[EnAttenteState]Player is unknown");
    }
    const res = await Joueur_partie_role.updateOne(
          {id_joueur:player_id._id, id_partie : this.context.partieId},
          {socket_id : socket_id}).then(result => {return result;})
    //We check to see if a match was found
    if (res.n == 0){
      //no match, we leave immediatly 
      //as the player is not registerd in the game
      debug("Player is not registerd in the game")
      return;
    }
    if (!this.addPlayerIntoContext(pseudo)){
      //Player is in the game already
      return;
    }
    //We connect the player to the game room  one we have verified
    //his id and made sure is registered to the game
    socket.join(this.context.roomId);
    let data = {
      message : pseudo + " has joined the game",
      nb_players_actuel : this.context.nb_actif_players,
      nb_participant_souhaite : this.context.nbParticipantSouhaite,
      temps_restant : this.remainingTime(),
      status : GAME_STATUS.enAttente,
      // room :  chat_id  //TODO delete this since it is used for debugging
    }
    debug("[EnAttenteState] PLayer "+pseudo+" has joined the game : " + this.context.partieId);
    // this.createGamechat();
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
      return true;
    }
    return false;
  }

  removePlayerFromContext(pseudo){
    this.context.nb_actif_players--;
    this.context.pseudoList = this.context.pseudoList.filter(value => value !==pseudo);
  }
  
  async handleDisconnect(nsp, id_joueur, socket_id) {
    debug("[EnAttenteState] handleDisconnect");
    //The pseudo of the player will be extract from the sockeid
    const {name} = await this.getPlayerPseudo(id_joueur); 
    if (!name){
      return;
    }
    debug("[EnAttenteState] player disconnecting = " + name);
    this.removePlayerFromContext(name);
    await Joueur_partie_role.deleteOne({ socket_id: socket_id, id_joueur : id_joueur });
    let data = {
      message : name + " has left the game",
      nb_players_actuel : this.context.nb_actif_players,
      nb_participant_souhaite : this.context.nbParticipantSouhaite,
      temps_restant : this.remainingTime(),
      status : GAME_STATUS.enAttente,
    };
    nsp.to(this.context.roomId).emit('status-game', data);
  }
  
  //Will be called when we start the game, it will be used 
  //Roles will attributed at this level
  endCode(){
    
  }

  /**
   * Creates the general chat and loup chat 
   * and adds players to their respectif rooms
   */
  async createGamechat(){
    debug("Creating chats rooms for the game : "+ this.context.partieId);
    if (this.nsp == null){
      debug("No player joined the game thus this game context is connected to any socket")
      return;
    }

    const generalChatRoom = uuidv4();
    const chatGeneral = new Chat({
      chat_type: CHAT_TYPE.general_chat,
      id_partie: this.context.partieId, 
      chat_room_id : generalChatRoom
    })

    await chatGeneral.save()
    .catch((err) => {debug("General chat wasn't created  error"+err)})

    const loupChatRoom = uuidv4();
    const chatLoup = new Chat({
      chat_type: CHAT_TYPE.loup_chat,
      id_partie: this.context.partieId, 
      chat_room_id : loupChatRoom
    })
    await chatLoup.save()
    .catch((err) => {debug("Chat loup chat wasn't created  error"+err)})

    const playerJoueurLink = await Joueur_partie_role.find({ id_partie: this.context.partieId });
    if (!playerJoueurLink){
      debug("Players were not found in the database")
    }
    playerJoueurLink.map((player) =>{
      let playerSocket = this.nsp.sockets.get(player.socket_id);
      if (!playerSocket){
        debug("Player socket was not found, id of the player = " + player.id_joueur)
        return;
      }
      playerSocket.join(generalChatRoom)
      if (player.role === ROLE.loupGarrou){
        playerSocket.join(loupChatRoom)
      }
      else if (player.role === ROLE.noRole){
      //  throw new Error("A player in the game does not have a role")
      }
    })
    debug("Chats rooms have been created for the game  : "+ this.context.partieId);
    debug("general chat id  = " + generalChatRoom)
    // return generalChatRoom; TODO: REMOVE THIS ;; Used for debugging
  }


  startGameTimer(){
    //Il faut vérifier que le nombre de jour connecté 
    //est supérieur ou égal à une valeur sépcifique 
    //We check if the game started
    debug("[EnAttenteState] Timer Starting game");
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


