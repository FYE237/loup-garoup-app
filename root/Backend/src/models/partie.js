const { Types, Schema } = require("mongoose");
const mongoose = require("./database")
//const uniqueValidator = require('mongoose-unique-validator')

//const opts = { toJSON: { virtuals: true } };


/** Schema permettant de créer des utilisateurs dans la base de données */
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

/*partieSchema.virtual('nbparticipant').get(() => {
    return this.nb_participant;
    }
)*/


module.exports = mongoose.model('Partie',partieSchema)
