const mongoose = require("./database")
//const uniqueValidator = require('mongoose-unique-validator')


//Pertinence ????!!
/** Schema permettant de créer des joueurs dans la base de données */
const roleSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    }

})

//userSchema.plugin(uniqueValidator)


module.exports = mongoose.model('Role',roleSchema)
