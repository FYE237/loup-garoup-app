const { Schema } = require("mongoose")
const mongoose = require("./database")
//const uniqueValidator = require('mongoose-unique-validator')

/** Schema permettant de créer une table qui contient les joueurs-role-idpartie dans la base de données */
const joueur_partie_roleSchema = mongoose.Schema({
    //game Id
    id_partie:{
        type:Schema.Types.ObjectId,
        required:true
    },
    //Player id
    id_joueur:{
        type:Schema.Types.ObjectId,
        required:true,
    },
    //The role of the player in this game
    role:{
        type:String,
        required:true
    },
    //A table that contains the speacial powers 
    //that this player has in this game
    pouvoir_speciaux:{
        type: [String],
    },
    //A table for the identifier of the chat rooms
    chat_id_table:{
        type: [Number],
    },
    //Indicates if the player is alive
    statut:{
        type:String,
        required:true
    },
    socket_id:{
        type : String,
        default : 0
    }
   
})

module.exports = mongoose.model('joueur_partie_role',joueur_partie_roleSchema)
