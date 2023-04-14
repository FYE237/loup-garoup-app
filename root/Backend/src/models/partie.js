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
        // type:String,
        required:true
    },
    // nb_loup:{
    //     type:Number,
    //     required:true
    // },
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
    }

}/*,opts*/);

/*partieSchema.virtual('nbparticipant').get(() => {
    return this.nb_participant;
    }
)*/


module.exports = mongoose.model('Partie',partieSchema)
