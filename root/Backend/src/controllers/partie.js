const status = require('http-status');

const Partie = require('../models/partie');
const Partie_role = require('../models/partie_role')
const Joueur_partie_role = require('../models/joueur_partie_role')
const  User = require('../models/user')


const bcrypt = require('bcrypt')
const has = require('has-keys');
const jws = require('jws')

require('mandatoryenv').load([
    'TOKENSECRET'
]);

const { TOKENSECRET } = process.env;

const CodeError = require("../util/CodeError");
// const partie = require('../models/partie');

async function getUser(name){

    const res =  await User.findOne({name:name}).select({_id:1,name:0,email:0,__v:0,password:0})

    return res

}


/*
*  Il s'agit des fonctions qui sont appélés lorsqu'on sollicite les endpoints
* des parties
*/
module.exports = {

    async newPartie(req,res){
        // #swagger.tags = ['Partie']
        // #swagger.summary = 'New Partie'
        // #swagger.parameters['obj'] = { in: 'body', description:'heure_debut,nb_participant,hote_name,duree_jour,duree_nuit,statut ', schema: { $heure_debut:'15',$nb_participant:'5',$hote_name:'fye',$duree_jour:'10',$duree_nuit:'15',$statut:'en attente',$roles:[{$name:'loup',$nombre:'2'}]}}


        const tmp = JSON.parse(req.body.data)
        if(!has(tmp , ['heure_debut','nb_participant','hote_name'/* ,'nb_loup' */,'duree_jour','duree_nuit','statut']))
            throw  new CodeError('Précisez heure_début,nb_participant,hote_name,duree_jour,duree_nuit,statut, roles ', status.BAD_REQUEST)
    
        const { heure_debut,nb_participant,hote_name,duree_jour,duree_nuit,statut } = tmp;
        const {roles} = tmp

        //On retrouve l'id associé au pseudo dans le body à hote_name
        const {_id} = await User.findOne({name:hote_name}).select({_id:1,name:0,email:0,__v:0,password:0})

        const partie = new Partie({
            heure_debut,
            nb_participant,
            hote_id:_id,
            duree_jour,
            duree_nuit,
            statut
        })

        //On crée la partie
        partie.save()
        .then((obj) => {
            //On crée les roles de la partie
            for(i=0;i<roles.length;i++){
                let partie_role = new Partie_role({
                    id_partie:obj._id,
                    id_role:roles[i].name,
                    nombre:roles[i].nombre
                })
                
               partie_role.save()
               .then()
               .catch(() => {throw  new CodeError('Add ROLE failed', status.BAD_REQUEST)})
            }

            //On inscrit directement l'hote à la partie
            const joueur_partie_role = new Joueur_partie_role({
                id_partie:obj._id,
                id_role:"villageois",
                id_joueur:obj.hote_id,
                statut:"vivant"
            })
    
            joueur_partie_role.save()
            .then(() => { res.json({status:true,message:'Party created',data:{id:obj._id}})  })
            .catch((err) => {throw  new CodeError('Add failed-Add first player failed', status.BAD_REQUEST)})
             
        
        })
        .catch(() => {throw  new CodeError('Add failed', status.BAD_REQUEST)})
    },

    //Middleware permettant de checker si un joueur a déjà rejoint la partie. Cela évite de dupliquer les joueurs dans une même partie
    async checkIfUserPresent(req,res,next){

        const hote_name = (JSON.parse(req.body.data)).id_joueur

        //On retrouve l'id de l'user dont le pseudo est dans hote_name
        const {_id} = await User.findOne({name:hote_name}).select({_id:1,name:0,email:0,__v:0,password:0})

        
        const joueur =  await Joueur_partie_role.find({id_partie:req.params.id,id_joueur:_id}).select({_id:0,id_role:0,id_partie:0,statut:0,__v:0})

        if(joueur.length != 0)
            throw  new CodeError('Add failed - PLayer has already joined', status.BAD_REQUEST) 

        next()

    },

    async checkNumberOfPlayer(req,res,next){
        const partie = await  Partie.findById(req.params.id)

        const nb_joueurs = partie.nb_participant

        const joueurs =  await Joueur_partie_role.find({id_partie:req.params.id}).select({_id:0,id_role:0,id_joueur:0,statut:0,__v:0})

        if(joueurs.length >= nb_joueurs) 
            throw  new CodeError('Add failed - Maximum number of player reached', status.BAD_REQUEST)

        next()

    },


    async addPlayer(req,res){
    // #swagger.tags = ['Partie']
    // #swagger.summary = 'Add player to a  Partie'
    // #swagger.parameters['obj'] = { in: 'body', description:'id_partie:req.params.id ,id_role:nom-rôle,id_joueur:nom du joueur,statut:vivant/mort', schema: { id_role:"loup",id_joueur:"fye",statut:"vivant"}}
     

        const tmp = JSON.parse(req.body.data)
        if(!has(tmp , ['id_role','id_joueur','statut']))
            throw  new CodeError('Précisez id_role,id_joueur,statut', status.BAD_REQUEST)
    
        const { id_role,statut } = tmp;
        const idpartie = req.params.id;

        //On retrouve l'id du joueur dont le pseudo est tmp.id_joueur
        const {_id} = await User.findOne({name:tmp.id_joueur}).select({_id:1,name:0,email:0,__v:0,password:0})


        const joueur_partie_role = new Joueur_partie_role({
            id_partie:idpartie,
            id_role,
            id_joueur:_id,
            statut
        })

        joueur_partie_role.save()
        .then(() => { res.json({status:true,message:'Player added to the party'} )  })
        .catch((err) => {throw  new CodeError('Add failed', status.BAD_REQUEST)})

    }


}