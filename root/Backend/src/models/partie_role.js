const { Schema } = require("mongoose")
const mongoose = require("./database")
//const uniqueValidator = require('mongoose-unique-validator')

/** Schema permettant de créer les rôles d'une partie dans la BD  */
const partie_roleSchema = mongoose.Schema({
    id_partie:{
        type:Schema.Types.ObjectId,
        required:true
    },
    id_role:{
        // type:Schema.Types.ObjectId,
        type:String,
        require:true,
    },
    nombre:{
        type:Number,
        required:true
    }
   
})

//userSchema.plugin(uniqueValidator)


module.exports = mongoose.model('Partie_role',partie_roleSchema)
