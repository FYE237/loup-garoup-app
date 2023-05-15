const { Types, Schema } = require("mongoose");
const mongoose = require("./database")


/** Schema that is used to create a game
 *  @heure_debut the amount of seconds need for the game to start
 *  @hote_id the id of the player that created the game
 *  @nb_participant the number of player that we wish to have in the game
 *  @duree_jour the lengh of the day in houres
 *  @duree_nuit the lengh of the night in houres
 *  @statut the current game status
 *  @proportion_loup the proportion of wolfs
 *  @proba_pouvoir_speciaux the probabilty of the super powers
 *  @room_id the game socket room id 
 *  @room_loup_id the socket room id for the the wolfs of the game 
 */
const partieSchema = mongoose.Schema({
    heure_debut:{
        type:Number,
        required:true
    },
    nb_participant:{
        type:Number,
        required:true
    },
    hote_id:{
        type:Schema.Types.ObjectId,
        required:true
    },
    duree_jour:{
        type:Number,
        required:true
    },
    duree_nuit:{
        type:Number,
        required:true
    },
    statut:{
        type:String,
        required:true
    },
    proportion_loup: {
        type:Number,
        required:true    
    },
    proba_pouvoir_speciaux: {
        type : Number,
        required : true 
    },
    room_id:{
        type : String,
        required : true 
    },
    room_loup_id:{
        type : String,
        required : true 
    }

}/*,opts*/);



module.exports = mongoose.model('Partie',partieSchema)










