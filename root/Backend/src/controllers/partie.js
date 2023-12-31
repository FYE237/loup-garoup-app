const status = require('http-status');

const Partie = require('../models/partie');
const Joueur_partie_role = require('../models/joueur_partie_role')
const User = require('../models/user')
const debug = require('debug')('Partie');

const {GAME_STATUS, PLAYER_STATUS, CHAT_TYPE, ROLE} = require("./constants")
const { StateContext, partieContextHashTable} = require("./gameContext")
const { v4: uuidv4 } = require('uuid');

const bcrypt = require('bcrypt')
const has = require('has-keys');
const jws = require('jws')

require('mandatoryenv').load([
    'TOKENSECRET'
]);

const { TOKENSECRET } = process.env;

const CodeError = require("../util/CodeError");

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
        /*
        #swagger.tags = ['Partie']
        #swagger.summary = 'Create a new game'
        #swagger.description = 'This request is used to create a new game with the specified parameters.'
        #swagger.parameters['obj'] = { 
            in: 'body', 
            description: 'The following values should be placed in the body of the request: heure_debut, nb_participant, hote_name,
            duree_jour, duree_nuit, statut, proba_pouvoir_speciaux, proportion_loup', 
            schema: { 
                $heure_debut: '15', 
                $nb_participant: '5', 
                $duree_jour: '10', 
                $duree_nuit: '15', 
                $proba_pouvoir_speciaux: '0.3',
                $proportion_loup : '0.3'
            } 
        }
        #swagger.responses[200] = {
            schema: {
                "message": "Game created successfully."
            }
        }
        #swagger.responses[400] = {
            schema: {
                "message": "Invalid request parameters. A message will be sent 
                with the response indicating the problem"
            }
        }
        #swagger.responses[500] = {
            schema: {
                "message": "Internal server error."
            }
        }
        */
        debug("Trying to create a new game");
        const tmp = JSON.parse(req.body.data)
        if(!has(tmp , [
                    'heure_debut',
                    'nb_participant', 
                    'proportion_loup',
                    'proba_pouvoir_speciaux', 
                    'duree_jour', 
                    'duree_nuit'
                ])){
                    debug("Game creation failed");
                    throw  new CodeError('Please provide heure_debut, nb_participant,'+
                    'proportion_loup, proba_pouvoir_speciaux, duree_jour, duree_nuit', status.BAD_REQUEST)
                }
                
        const {heure_debut, nb_participant, duree_jour,
             duree_nuit, proportion_loup, proba_pouvoir_speciaux} = tmp;
        if (heure_debut<0){
            throw  new CodeError('Heure de debut doit être positif', status.BAD_REQUEST)
        }
        if (nb_participant<1 || nb_participant>20){
            throw  new CodeError('Le nombre de participant doit être entre 1 et 20', status.BAD_REQUEST)
        }
        if (!(!isNaN(parseInt(duree_jour)) || !isNaN(parseInt(duree_nuit)))) {
            throw  new CodeError('Les nombre d"heure doit être des entiers', status.BAD_REQUEST)
        }
        if ((parseInt(duree_jour) + parseInt(duree_nuit)) != 24 || duree_jour>23 || duree_nuit>23 || duree_jour<1 || duree_nuit<1){
            throw  new CodeError("La somme des heures doit être égal à 24" 
                                +" et duree jour et nuit doit être entre 1 et 23", status.BAD_REQUEST)
        }
        if (proba_pouvoir_speciaux<0 || proba_pouvoir_speciaux>1 
            || proportion_loup<0 || proportion_loup>1){
                throw  new CodeError('proba_pouvoir_speciaux et proportion_loup doit être en 0 et 1 ', status.BAD_REQUEST)
        }
        let hote_name = req.login;
        debug("Starting game in = " + heure_debut)
        //On retrouve l'id associé au pseudo dans le body à hote_name
        const {_id} = await User.findOne({name:hote_name}).select({_id:1,name:0,email:0,__v:0,password:0})
        //We create the game instance
        const partie = new Partie({
            heure_debut:heure_debut,
            nb_participant:nb_participant,
            hote_id:_id,
            duree_jour: duree_jour,
            duree_nuit:duree_nuit,
            statut: GAME_STATUS.enAttente,
            proportion_loup: proportion_loup,
            proba_pouvoir_speciaux : proba_pouvoir_speciaux,
            room_id : uuidv4(),
            room_loup_id : uuidv4()
        })

        //On crée la partie
        partie.save()
        .then((obj) => {
            //On inscrit directement l'hote à la partie
            debug("---------Creating game --------------");
            debug("New game id =  ", obj._id.toString());
            partieContextHashTable.set(obj._id.toString(), new StateContext(obj._id.toString()))
            let partie = partieContextHashTable.get(obj._id.toString())
            if (partie){ partie.state.setupCode();} 
            const joueur_partie_role = new Joueur_partie_role({
                id_partie:obj._id,
                //The role of the player will give to him as soon as the game starts
                role: ROLE.noRole, 
                id_joueur:obj.hote_id,
                statut: PLAYER_STATUS.vivant,
            })

            joueur_partie_role.save()
            .then(() => { res.json({status:true,message:'Game was created',data:{game_id:obj._id}})})
            .catch((err) => {debug("Error while creating game");throw  new CodeError('Game was successfully created but the '+
                                                    'player was not added to the game '+ err, status.INTERNAL_SERVER_ERROR)})
        })
        .catch((err) => {debug("Error while creating game");throw  new CodeError('Database error, game was not created; error : '+ err, status.INTERNAL_SERVER_ERROR)})
    },  
    //Middleware permettant de checker si un joueur a déjà rejoint la partie. Cela évite de dupliquer les joueurs dans une même partie
    async checkIfUserPresent(req,res,next){
        const user_name = req.login;
        debug("Tying to fetch user details + tmp = " + user_name);
        //On retrouve l'id de l'user dont le pseudo est dans user_name
        const {_id} = await User.findOne({name:user_name}).select({_id:1,name:0,email:0,__v:0,password:0})

        if (_id === null){
            throw new CodeError('Cound not find the specified user in the database', status.BAD_REQUEST) 
        }

        const joueur =  await Joueur_partie_role.find({id_partie:req.params.id,id_joueur:_id}).select({_id:0,id_role:0,id_partie:0,statut:0,__v:0})

        if(joueur.length != 0)
            throw  new CodeError('Add failed - player has already joined', status.BAD_REQUEST) 

        next()

    },

    async checkNumberOfPlayer(req,res,next){
        debug("type = " + typeof req.params.id) 
        const partie = await  Partie.findById(req.params.id)

        //We check to see if the game already started
        if (partie.statut !== GAME_STATUS.enAttente){
            throw  new CodeError('The game has already started', status.FORBIDDEN)
        }

        const nb_joueurs = partie.nb_participant

        const joueurs =  await Joueur_partie_role.find({id_partie:req.params.id}).select({_id:0,id_role:0,id_joueur:0,statut:0,__v:0})

        if(joueurs.length >= nb_joueurs) 
            throw  new CodeError('Add failed - Maximum number of player reached', status.BAD_REQUEST)

        next()

    },


    async addPlayer(req,res){
    /*
    #swagger.tags = ['Partie']
    #swagger.summary = 'Add player to a game'
    #swagger.description = 'This request is used to add a player into a game. The game must be pending and it has not reached the player limit.
                 The id of the game is in the link and the player you wish to add should be specified in the request body.'
    #swagger.parameters['gameId'] = {
        in: 'path',
        description: 'The ID of the game to add the player to.',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = { 
        description: 'The player was added to the game successfully.' 
    }
    #swagger.responses[400] = { 
        description: 'The request was invalid, check that id_joueur is present.' 
    }
    #swagger.responses[403] = { 
        description: 'The game is an a pending state.' 
    }
    #swagger.responses[500] = { 
        description: 'An error occurred while processing the request.' 
    }
    */

    const idpartie = req.params.id;
    const user_name = req.login;
    //On retrouve l'id du joueur dont le pseudo est tmp.id_joueur
    const {_id} = await User.findOne({name:user_name}).select({_id:1,name:0,email:0,__v:0,password:0})


    const joueur_partie_role = new Joueur_partie_role({
        id_partie: idpartie,
        //The role of the player will give to him as soon as the game starts
        role: ROLE.noRole, 
        id_joueur:_id,
        statut: PLAYER_STATUS.vivant,
    })

    debug(user_name + " is trying to regster into the game ");
    joueur_partie_role.save()
    .then(() => { res.json({status:true, message:'Player added to the party', data:{game_id: idpartie}} )  })
    .catch((err) => {throw  new CodeError('Player was not added to the database', status.INTERNAL_SERVER_ERROR)})

    }


}