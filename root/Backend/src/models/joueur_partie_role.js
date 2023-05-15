const { Schema } = require("mongoose")
const mongoose = require("./database")
//const uniqueValidator = require('mongoose-unique-validator')

/** The schema holds the the link between the player and the game
 * and the data that links them 
 * @id_partie game id 
 * @id_joueur the linked player id 
 * @role The role of the player in this game
 * @pouvoir_speciaux the special power of the player
 * @statut indicates if a player is alive of dead 
 * @socket_id the player socket id in this particular game
 */
const joueur_partie_roleSchema = mongoose.Schema({
    id_partie:{
        type:Schema.Types.ObjectId,
        required:true
    },
    id_joueur:{
        type:Schema.Types.ObjectId,
        required:true,
    },
    role:{
        type:String,
        required:true
    },
    pouvoir_speciaux:{
        type: String,
    },
    statut:{
        type:String,
        required:true
    },
    socket_id:{
        type : String,
        default : 0
    }
}, { concurrency: 1 });

module.exports = mongoose.model('joueur_partie_role',joueur_partie_roleSchema)
