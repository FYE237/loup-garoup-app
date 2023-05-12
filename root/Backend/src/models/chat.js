const { Types, Schema } = require("mongoose");
const mongoose = require("./database")


const messageSchema = mongoose.Schema({ 
  //Indicates the chat to which this message belongs
  id_chat : {
    type : String,
    required : true
  },
  //Message value
  text: {
     type: String,
     required: true 
  },
  //If of the the player that sent the 
  id_joueur: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
     required: true
  },
  //Timestamp
  createdAt: {
    type: Date,
    default: Date.now
  }   
});

/** Schema permettant de créer les chats dans la base de données */
const chatSchema = mongoose.Schema({
    //Chats can have multiple types:
    //chat general
    //chat loup garrou
    //chat custom  
    chat_type:{
      type:String,
      required:true
    },
    //The game to which the chat belongs
    id_partie:{
      type:Schema.Types.ObjectId,
      ref : "Partie",
      required:true
    },
    //This value will be used when we create
    //a custom chat thus the table is not required 
    players_id:{
      type:[{type: Schema.Types.ObjectId,  ref: 'User'}],
    },
    //The reason at to why we don't use the chat id 
    //as socket io rooms to avoid conflict with the game id 
    chat_room_id:{
      type : String,
      required : true
    },
    messages: [messageSchema]
    
});

const Chat = mongoose.model('Chat', chatSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = { Chat, Message };