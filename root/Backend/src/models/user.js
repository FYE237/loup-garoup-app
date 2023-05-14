const mongoose = require("./database")
//const uniqueValidator = require('mongoose-unique-validator')

/** Schema permettant de créer des utilisateurs dans la base de données */
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },

})

//userSchema.plugin(uniqueValidator)


module.exports = mongoose.model('User',userSchema)
