
const Partie = require('../models/partie');
const User = require('../models/user');
const {Chat, Message} = require('../models/chat')
const Joueur_partie_role = require('../models/joueur_partie_role')

const debug = require('debug')('GameState');
const {GAME_STATUS, CHAT_TYPE, ROLE, PLAYER_STATUS} = require("./constants")

class GameState {
  constructor(context) {
    this.context = context;
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

  async handleVote(socket,id_joueur,currentPlayersVote,id_socket) {
  }

  async handleVote(socket,id_joueur,room,currentPlayersVote,id_socket) {
  }

  handlePouvoir() {
    return;
  }

  //This function will be executed in the day and night state 
  //and it will just change the status of a player to disconnected
  async handleDisconnect(nsp, id_joueur, socket_id) {
    await User.updateOne({id_joueur: id_joueur},{statut : PLAYER_STATUS.deconnecte});
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


}

module.exports = GameState;
