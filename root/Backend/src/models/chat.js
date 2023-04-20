const { Types, Schema } = require("mongoose");
const mongoose = require("./database")


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
    //This value will be used when we create
    //a custom chat thus the table is not required 
    players_id:{
      type:String,
    },
    //The reason at to why we don't use the chat id 
    //as socket io rooms to avoid conflict with the game id 
    chat_socket_id:{
      type: Number,
      default : 0
    }
    
}/*,opts*/);


module.exports = mongoose.model('Partie',partieSchema)
