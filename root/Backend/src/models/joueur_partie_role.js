const { Schema } = require("mongoose")
const mongoose = require("./database")
//const uniqueValidator = require('mongoose-unique-validator')

/** Schema permettant de créer une table qui contient les joueurs-role-idpartie dans la base de données */
const joueur_partie_roleSchema = mongoose.Schema({
    id_partie:{
        type:Schema.Types.ObjectId,
        required:true
    },
    id_role:{
        // type:Schema.Types.ObjectId,
        type:String,
        required:true
    },
    id_joueur:{
        type:Schema.Types.ObjectId,
        // type:String,
        required:true,
        // unique:true
    },
    statut:{
        type:String,
        required:true
    }
   
})

//userSchema.plugin(uniqueValidator)


module.exports = mongoose.model('joueur_partie_role',joueur_partie_roleSchema)
