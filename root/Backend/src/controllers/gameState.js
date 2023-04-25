
const Partie = require('../models/partie');
const User = require('../models/user');
const {Chat, Message} = require('../models/chat')
const Joueur_partie_role = require('../models/joueur_partie_role')

const debug = require('debug')('GameState');
const {GAME_STATUS, CHAT_TYPE, ROLE, PLAYER_STATUS} = require("./constants")

class GameState {
  constructor(context) {
    this.context = context;
    //These two values are used for timers
    this.startTime = null;
    this.timeoutState = null;
  }

  /**
   * Some of these functions will be redefined 
   * by the functions that need them
   * The list of action that will treated : 
   * Login
   * Chat message
   * Pouvoir special
   * Vote
   * Disconnect
   */
  handleRejoindreJeu() {
    debug("A player is trying to join the game but it has already started!!")
    return;
  }

  
  /**
   * This function will first check the state of the game and checks if it valid or not
   * by valid i mean the game state is either day or night then it will :
   * --check that chat room exists and check if the player is allowed in the room
   * --check if the message can be sent, for example in the day we can not write in the lup garou
   * chat and vice-verca also some players that have used their power 
   * can only viw the chat and not read from it
   * 
   * finally if all is valid we will save the message in the database and  
   * emit it to the concerned parties    
   * 
   * @param {*} nsp socket io connection
   * @param {*} socket sender socket
   * @param {*} message value message sent
   * @param {*} roomId the room at which we would like to add the chat 
   * @param {*} pseudo the player name
   * @returns 
   */
  async handleMessage(nsp, socket, message, roomId, pseudo){
    debug("handleMessage called");
    const resPartie =  await Partie.findOne({_id:this.context.partieId}).select({statut:1})
    if (!resPartie){
      debug("Game was not found while sending message");
      return;
    }
    if (resPartie.statut !== GAME_STATUS.jour || resPartie.statut !== GAME_STATUS.nuit){
      debug("Game in not in a status that permit messages being sent");
      return;
    }
    const playerId = await this.getPlayerId(pseudo);
    if (!playerId){
      debug("Player was not found while sending message")
      return;
    }
    const playerStatus = await Joueur_partie_role
                            .findOne({id_partie:this.context.partieId, id_joueur:playerId})
                            .select({Role : 1, statut : 1})
    if(!playerStatus){
      debug("Player role and status were not found")
      return;
    }
    const resChat = await Chat
                    .findOne({chat_room_id: roomId})
                    .select({_id: 1,chat_type:1, players_id: 1})
    if (!resChat){
      debug("Chat was not found while sending messages")
      return;
    }
    //At this point we treat all of the cases that we have
    switch (resChat.chat_type){
      case CHAT_TYPE.general_chat:
        if (resPartie.statut !== GAME_STATUS.jour){
          debug("Game is not in the day state, message cannot be sent in the general chat");
          return;
        }
        if (playerStatus.statut !== PLAYER_STATUS.vivant){
          debug("Player is not alive, message cannot be written into thE general chat");
          return;
        }
        this.saveAndEmitMessage(nsp, socket, resChat._id, message, playerId, pseudo, roomId, CHAT_TYPE.general_chat);
        break;
      case CHAT_TYPE.loup_chat:
        if (resPartie.statut !== GAME_STATUS.nuit){
          debug("Game is not in the night state, message cannot be sent in the loup chat ");
          return;
        }
        if (playerStatus.statut !== PLAYER_STATUS.vivant && playerStatus.Role !== ROLE.loupGarrou){
          debug("Player is not alive or not a loup, message cannot be written into the loup chat");
          return;
        }
        this.saveAndEmitMessage(nsp, socket, resChat._id, message, playerId, pseudo, roomId, CHAT_TYPE.loup_chat);
        break;
      case CHAT_TYPE.custom_chat:
        if (resPartie.statut !== GAME_STATUS.nuit){
          debug("Game is not in the night state, custom chats cannot be written into");
          return;
        }  
        if (!resChat.players_id.incules()){
          debug("Player is not registered in this chat");
          return; 
        }
        this.saveAndEmitMessage(nsp, socket, resChat._id, message, playerId, pseudo, roomId, CHAT_TYPE.custom_chat);
        break;
      default:
        break;
    }
  }

  /**
   * saveAndEmitMessage adds the message to the corresponding database and 
   * then broadcasts the message to chat room that  
   */
  async saveAndEmitMessage(nsp, socket, chatId, message, playerId, pseudo, roomId, chatType){
    await this.addMessageToChatDb(chatId, message, playerId, pseudo);
    let data = {
      message : message,
      partie_id : this.context.partieId,
      chat_room : roomId, 
      chat_type : chatType,
      sender : pseudo
    }
    // socket.broadcast.to(roomId).emit('new-message', data);
    socket.to(roomId).emit('new-message', data);
    debug("Message sent with success");
  }

  /**
   * This method is used to vac a message in a database 
   * @param {*} chatId the if of the chat room
   * @param {*} message the message to save
   * @param {*} id_joueur the player that sent the message
   * @param {*} pseudo the pseudo of the player that sent the message
   */
  async addMessageToChatDb(chatId, message, id_joueur, pseudo){
    const chat  = await Chat.findById(chatId)
    if (!chat){
      debug("chat was not found");
      return;
    }
    const newMessage = new Message({
      id_chat: chatId,
      text: message,
      id_joueur: id_joueur,
      pseudo_joueur : pseudo
    });

    // Save the new message to chat the database
    const resSave = await newMessage.save().then(() => {debug("Message saved into message database");return 1;})
    .catch((err) => {debug("Could not create a message in the message chat error = " + err);return 0;});
    if (!resSave){//Message could not of been saved
      return;
    }
    // Add the new message to the chat's messages array
    chat.messages.push(newMessage);
    // Save the updated chat to the database
    await chat.save()
    .then(() => debug('Message written by ' +pseudo+ ' added to the chat database!'))
    .catch((err) => {
        console.error(err)})
  }

  /**
   * This functions verifies that the vote that we are about to process is valid 
   * meaning that:
   * The vote is not locked
   * The players are in the game
   * The voter has not already voted
   * The two players are alive
   * 
   * @param {*} pseudoVoteur  the player that made the vote 
   * @param {*} candidantVote the player that we wish to eliminate
   * @param {*} verifyRole this functions will verify that the player that made the vote
   * has this role
   * @returns 
   */
  async verifyThatVoteIsPossible(pseudoVoteur, candidantVote, verifyRole){
    if (this.lockVotes){
      debug("Vote are locked !!!!");
      throw new Error("Vote are locked !!!!");
    }
    if(!this.context.pseudoList.includes(pseudoVoteur) &&
        !this.context.pseudoList.includes(candidantVote)){
          debug("One of the given players does not exists in the game");
          throw new Error("One of the given players does not exists in the game");
    }
    if (!this.context.VotersList.includes(pseudoVoteur)){
      debug("This player has already voted");
      throw new Error("This player has already voted");
    }
    const voteurId = await getPlayerId(pseudoVoteur);
    const candidatId = await getPlayerId(candidantVote);
    const voteurInfo = await Joueur_partie_role
                            .findOne({id_partie:this.context.partieId, id_joueur:voteurId})
    const candidatInfo = await Joueur_partie_role
                      .findOne({id_partie:this.context.partieId, id_joueur:candidatId})
    if (voteurInfo.statut !==  PLAYER_STATUS.vivant || candidatInfo.statut !== PLAYER_STATUS.vivant){
      debug("One of the players that you are trying to vote for is dead");
      throw new Error("One of the players that you are trying to vote for is dead");
    }
    //We check if we need to compare roles
    if (verifyRole){
      if (voteurInfo.role != verifyRole){
        debug("the player that made the vote does not have the required role");
        throw new Error("the player that made the vote does not have the required role");  
      }
    }
    return true;
  }


  handleVote() {
    return;
  }

  handleSpiritisme() {
    return;
  }

  //This function will be executed in the day and night state 
  //and it will just change the status of a player to disconnected
  async handleDisconnect(nsp, id_joueur, socket_id) {
    //TODO decrement the active players and make the player dead instead of
    debug("A player has left the game that has already started !!!")
    this.context.nbAlivePlayer--;
    //disconnected
    await User.updateOne({id_joueur: id_joueur},{statut : PLAYER_STATUS.mort});
    //A message could be sent to inform the others that a player disconnected but this will not be necessary
    //as when the game change, a message is emitted to inform the players of the current game status
    return;
  }

  //-------------
  //Configuration functions
  //-------------

  /**
   * Configurations functions 
   * These two functions will be called when the state changes
   * (when it launches and when it leaves)
   * for example when we go in the day mode some data will be sent to the players
   * regarding the game status
   */
  setupCode(){
    return;
  }

  endCode(){
    return;
  }
  
  async updateGameStatusDataBase(newStatus){
    if (!newStatus){
      throw Error("Please set a game status")
    }
    await Partie.updateOne({_id: this.context.partieId}, {statut : newStatus});
    this.context.gameStatus = newStatus;
  }
  
  /**
   * This method is used to inform all players that the currect game 
   * status has changed
   */
  async sendGameStatus(){
    const partieInfo = await Partie.findOne({_id: this.context.partieId});
    let data = {
      message : "Changing game status to : " + partieInfo.statut,
      status : partieInfo.statut,
    }
    this.context.nsp.to(this.context.roomId).emit('status-game', data);
  }

  /**
   * This function is sent in a custom manner to every player
   * and with it we inform the player of all the special powers that hes has
   * and we will also inform him of the state of the player, we just tell him 
   * that they are alive or dead 
   */
  async sendPlayersInformation(){
    //We gather all of the players of a game and we place them in a 
    //struct
    const playerJoueurLink = await Joueur_partie_role.find({ id_partie: this.context.partieId });
    if (!playerJoueurLink){
      debug("Players were not found in the database")
      throw Error("No players found while send player information")
    }
    //This table will hold list that has minimal information reagrding all of the players
    //like their current status indicating if they are alive or not and their pseudo
    const playersData = []
    playerJoueurLink.map(async (player) =>{
      const {name} = await this.getPlayerPseudo(player.id_joueur);
      playersData.push({
        playerName : name,
        playerStatus : player.status
      })
    })
    playerJoueurLink.map(async (player) =>{
      //Some information is redundant but it will allow for faster access time
      //and much easier use
      let {name} = await this.getPlayerPseudo(player.id_joueur);
      let data = {
        partieId : this.context.partieId,
        partieStatus : this.context.gameStatus,
        roomId : this.context.roomId, 
        roomLoupId : this.context.roomLoupId,
        nbPersonneDansLejeu : this.context.nb_actif_players,
        playerPseudo : name,
        playerRole : player.role,
        playerStatut : player.statut,
        SpecialPowers: player.pouvoir_speciaux,
        playersData : playersData,
      }
      let chats = {
        generalChat : this.context.generalChat
      }
      if (player.role === ROLE.loupGarrou){
        chats.loupChat = this.context.loupChatRoom;
      }
      //Todo add custom chat structure if needed in this form : 
      /*
       * customChat : customChatId  
       * or customChat : {
       *      customChatID
       *      playersInTheChat : [] //Not important but will see
       * } 
      */
      data.chats = chats;
      if (player.socket_id != 0){
        debug("Sending Player info to  "+name);
        this.context.nsp.to(player.socket_id).emit("Player-info", data);
      }
      else{
        debug("Player "+name+" is registered but has not logged in")
      }
    })
  }

  /**
   * This functions checks that the number of wolfs that are still alive 
   * and the villageois are superior to zero
   * @returns true if the game can continue and false otherwise if the game cannot continue
   */
  async checkGameStatus(){
    let nbAliveLoup = await this.getCountRole(ROLE.loupGarou, PLAYER_STATUS.vivant);
    let humainAlive = await this.getCountRole(ROLE.villageois, PLAYER_STATUS.vivant);
    if (nbAliveLoup == 0 || humainAlive == 0){
      return false;
    }
    return true;
  }

  //-------------
  //Useful functions
  //-------------

  /**
   * Returns the id of the player that has the pseudo given
   * as argument
   * @param {*} pseudo pseudo of the player that looking for his id
   */
  async getPlayerId(pseudo){
    const res =  await User.findOne({name:pseudo}).select({_id:1,name:0,email:0,__v:0,password:0})
    return res;
  }

  /**
   * Returns the pseudo of the player that has the playerId given
   * as argument
   * @param {*} playerId playerId of the player that looking for his id
   */
  async getPlayerPseudo(playerId){
      const res =  await User.findOne({_id:playerId}).select({name:1})
      return res;
  }

  /**
   * Returns the number of people that have a certain role
   * @param {*} role that we are trying to find out how many have it 
   */
  async getCountRole(role, statut){
    let players = null;
    if (statut){
      players = await Joueur_partie_role.find({id_partie: this.context.partieId, partierole: role, statut: statut})
    }
    else {
      players = await Joueur_partie_role.find({id_partie: this.context.partieId})
    }
    if (players){
      return players.length;
    }
    return -1;  
  }


}

module.exports = GameState;
