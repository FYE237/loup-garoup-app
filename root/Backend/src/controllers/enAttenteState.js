// const Joueur_partie_role = require('../models/joueur_partie_role')

const GameState = require('./gameState');
const {GAME_STATUS, CHAT_TYPE, ROLE, GAME_VALUES} = require("./constants")
const Joueur_partie_role = require('../models/joueur_partie_role')
const {Chat} = require('../models/chat')
const { v4: uuidv4 } = require('uuid');

const debug = require('debug')('EnAttenteState');


class EnAttenteState extends GameState {
  constructor(context) {
    super(context);
  }

  /**
   * The list of action that will treated in this state are :
   * Login
   * Disconnect
   */
  async handleRejoindreJeu(nsp, socket, pseudo, socket_id) {
    //We save this so that we can use it later
    //the nsp reference needs to get updated everytime a player joins 
    //so that the rooms and sockets are well configured, if we take a reference to 
    //the same object this will not be necessary but we have nothing
    //to lose with this approach
    this.context.nsp = nsp;
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
    if (res.n == 0) {
      //no match, we leave immediatly
      //as the player is not registerd in the game
      debug("Player is not registerd in the game")
      return;
    }
    if (!this.addPlayerIntoContext(pseudo)){
      //Player is in the game already
      debug("Player is in the game "+pseudo);
      return;
    }
    //We connect the player to the game room  one we have verified
    //his id and made sure is registered to the game
    socket.join(this.context.roomId);
    let data = {
      message : pseudo + " has joined the game",
      status : GAME_STATUS.enAttente,
      nb_players_actuel : this.context.nb_actif_players,
      nb_participant_souhaite : this.context.nbParticipantSouhaite,
      temps_restant : this.remainingTime(),
      // room :  chat_id  //TODO delete this since it is used for debugging
    }
    debug("[EnAttenteState] PLayer "+pseudo+" has joined the game : " + this.context.partieId);
    nsp.to(this.context.roomId).emit('status-game', data);
    if (this.context.nb_actif_players == this.context.nbParticipantSouhaite){
      if (this.timeout){
        clearTimeout(this.timeout);
        this.launchGame();
      }
      else{
        throw new Error("Timer was not set up correctly or the we are not in the correct state");
      }
    }
  }

  addPlayerIntoContext(pseudo) {
    //Players can only be added if the game is in the wait state
    if (!this.context.pseudoList.includes(pseudo)) {
      this.context.nb_actif_players++;
      this.context.nbAlivePlayer++;
      this.context.pseudoList.push(pseudo)
      return true;
    }
    return false;
  }

  removePlayerFromContext(pseudo) {
    this.context.nb_actif_players--;
    this.context.nbAlivePlayer--;
    this.context.pseudoList = this.context.pseudoList.filter(
      (value) => value !== pseudo
    );
  }

  async handleDisconnect(nsp, id_joueur, socket_id) {
    debug("[EnAttenteState] handleDisconnect");
    //The pseudo of the player will be extract from the sockeid
    const { name } = await this.getPlayerPseudo(id_joueur);
    if (!name) {
      return;
    }
    debug("[EnAttenteState] player disconnecting = " + name);
    this.removePlayerFromContext(name);
    await Joueur_partie_role.deleteOne({
      socket_id: socket_id,
      id_joueur: id_joueur,
    });
    let data = {
      message : name + " has left the game",
      status : GAME_STATUS.enAttente,
      nb_players_actuel : this.context.nb_actif_players,
      nb_participant_souhaite : this.context.nbParticipantSouhaite,
      temps_restant : this.remainingTime(),
    };
    nsp.to(this.context.roomId).emit("status-game", data);
  }



  /**
   * Creates the general chat and loup chat 
   * and adds players to their respectif rooms
   */
  async createGamechat(){
    debug("Creating chats rooms for the game : "+ this.context.partieId);
    if (this.context.nsp == null){
      debug("No player joined the game thus this game context is connected to any socket")
      return;
    }

    const generalChatRoom = uuidv4();
    this.context.generalChatRoom = generalChatRoom; 
    const chatGeneral = new Chat({
      chat_type: CHAT_TYPE.general_chat,
      id_partie: this.context.partieId, 
      chat_room_id : generalChatRoom
    })

    await chatGeneral.save()
    .catch((err) => {debug("General chat wasn't created  error"+err)})

    const loupChatRoom = uuidv4();
    this.context.loupChatRoom = loupChatRoom; 
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
      let playerSocket = this.context.nsp.sockets.get(player.socket_id);
      if (!playerSocket){
        debug("Player socket was not found, id of the player = " + player.id_joueur)
        return;
      }
      playerSocket.join(generalChatRoom)
      if (player.role === ROLE.loupGarrou){
        playerSocket.join(loupChatRoom)
      }
      else if (player.role === ROLE.noRole){
        //TODO REMOVE THE COMMENT FROM HERE
        //  throw new Error("A player in the game does not have a role")
      }
    })
    debug("Chats rooms have been created for the game  : "+ this.context.partieId);
    debug("general chat room id  = " + generalChatRoom)
    debug("loup chat room id  = " + loupChatRoom)
    // return generalChatRoom; TODO: REMOVE THIS ;; Used for debugging
  }

  /**
   * Will be called when we start the game, it will be used
   * Roles will attributed at this level
   * @returns 0 if it failed and 1 it it was successfull
   */
  async endCode() {
    if (!this.context.nsp){
      debug("No one connected to the game");
      return 0;
    }
    if (this.context.nb_actif_players < GAME_VALUES.min_players) {
      debug("Game cannot get started that are very litle players")
      return 0;
    }
    // computing of the number of wolves in the game
    const wolvesNumber = Math.ceil(
      this.context.nb_actif_players * this.context.proportion_loup
    );

    // checking if we should have special powers depending on the probability entered by the user
    const shouldSpecialPowerExist =
      this.context.probaPouvoirSpeciaux > 0 ? true : false;

    // function to generate numbers between min and max
    const generateNumber = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const shouldHaveSpecialPower = (specialPowerProbability) => {
      // Perform a Bernoulli test with the specified probability
      const willHaveSpecialPower = Math.random() < specialPowerProbability;

      // return true or false depending on if the user should have special power or not
      return willHaveSpecialPower ? true : false;
    };

    let wolvesList = [];
    // getting randomly the wolves of the game
    for (let i = 0; i < wolvesNumber; i++) {
      wolvesList.push(generateNumber(0, this.context.nb_actif_players - 1));
    }

    let powerInd = -1;

    // assigning special powers if they should to some wolves
    const assignedWolvesRoles = wolvesList.map((playerIndice) => {
      if (shouldHaveSpecialPower(this.context.probaPouvoirSpeciaux)) {
        powerInd += 1;
        return {
          indice: playerIndice,
          role: ROLE.speciauxLoup[powerInd % ROLE.speciauxLoup.length],
        };
      } else {
        return { indice: playerIndice, role: ROLE.loupGarou };
      }
    });

    // create an array containing all the indices
    const indices = Array.from(
      { length: this.context.nb_actif_players - 1 },
      (_, i) => 0 + i
    );

    // filter the ones that are wolves
    const humanList = indices.filter((ind) => !wolvesList.includes(ind));

    // assigning special powers if they should to some humans
    const assignedHumansRoles = humanList.map((playerIndice) => {
      if (shouldHaveSpecialPower(this.context.probaPouvoirSpeciaux)) {
        powerInd += 1;
        return {
          indice: playerIndice,
          role: ROLE.speciauxHumain[powerInd % ROLE.speciauxHumain.length],
        };
      } else {
        return { indice: playerIndice, role: ROLE.villageois };
      }
    });

    // get all the users roles from the database
    const playerRolesList = await Joueur_partie_role.find({
      id_partie: this.context.partieId,
    });

    // update now the roles of the users
    // assuming that all the players in the waiting list are now in the database and ready for adding the roles
    for (const wolves of assignedWolvesRoles) {
      playerRolesList[wolves.indice].role = ROLE.loupGarou;
      playerRolesList[wolves.indice].pouvoir_speciaux = wolves.role;
      playerRolesList[wolves.indice].save()
      //   (err) => {
      //   if (err) {
      //     console.log(err);
      //   }
      // });
    }

    for (const human of assignedHumansRoles) {
      playerRolesList[human.indice].role = ROLE.villageois;
      playerRolesList[human.indice].pouvoir_speciaux = human.role;
      playerRolesList[human.indice].save();
        // (err) => {
        // if (err) {
        //   console.log(err);
        // }
      // });
    }
    this.createGamechat();
    return 1;
  }

  startGameTimer() {
    //Il faut vérifier que le nombre de jour connecté
    //est supérieur ou égal à une valeur sépcifique
    //We check if the game started
    debug("Timer reached its end Starting game ...");
    this.launchGame();
  }

  launchGame() {
    if (this.context.state != this.context.stateEnAttente) {
      throw new Error("Game context is not in the en attente state");
    }
    if (this.nb_actif_players == 0){
      debug("No one is in the game ")
      return;
    }
    //This will change the state and before it does that it will
    //call the endcode method of the currect state class 
    //and the setup method of the next state class
    debug("Starting the game with the day state");
    if (!this.context.setState(this.context.stateJour)){
      this.context.setState(this.context.stateNuit);
    }
  }

  remainingTime() {
    const elapsedTime = Date.now() - this.startTime;
    const timeLeft = this.context.tempsDebut*1000 - elapsedTime;
    return timeLeft;
  }
  /**
   * This function is used to initialize the variable of the
   * context and it start a timer that will the check if it start the game
   */
  async setupCode() {
    await this.context.initAttributs();
    this.startTime = Date.now();
    debug("Launched game timer, starting the game in :", this.context.tempsDebut*1000+ " ms");
    this.timeout = setTimeout(this.startGameTimer.bind(this), this.context.tempsDebut*1000);
  }
}

module.exports = EnAttenteState;