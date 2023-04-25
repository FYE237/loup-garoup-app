// Load .env Enviroment Variables to process.env
//This table will be used in order to player that has the socket id
const debug = require('debug')('Server');

require('mandatoryenv').load([
    'MONGO_URL',
    'PORT',
    'SECRET'
]);


const {GAME_STATUS, PLAYER_STATUS, CHAT_TYPE, ROLE} = require("./controllers/constants")


const { PORT } = process.env;

const app = require ("./app")

//Cors
const cors = require('cors');
const corsOptions = {
    origin: '*'
  };

// Socket io
const socket = require("socket.io")

// Open Server on selected Port
const server = app.listen(
        PORT, 
        () => console.info('Server listening on port ', PORT)
    );

//We create socket connection
const io = socket(server,{
    cors:{
        corsOptions
    }
})

let client = 0 , n =0

var nsp = io.of("/api/parties/:id")


const Joueur_partie_role = require('./models/joueur_partie_role')
const {partieContextHashTable} = require("./controllers/gameContext")
const User = require('./models/user');
const joueur_partie_role = require('./models/joueur_partie_role');


//Connexion  à la socket
nsp.on('connection', (socket) => {
    //Connexion réussie
    client++;
    console.log('New Socket connection id : ' + socket.id)

    //le joueur emet l'evenement rejoindre la partie
     socket.on('newPlayerConnect',(data) => 
         { 
            //  description: client +  'Hey, welcome!'
            debug( data + "connecté")

            //. On répond au joueur 
            nsp.to(socket.id).emit("RejoindreJeu",{description:"Bienvenue "+data})
            //On peut mettre ici une méthode POST pour ajouter la socket du joueur-partie
            //dans la base de données
         }

     );


     //Ce bloc a été commenté car n'étant pas complet il fait cracher le serveur

    socket.on("rejoindre-jeu", (data, callback) => {
        debug("[server] Joining game" + JSON.stringify(data));
        let pseudo  = data.pseudo;
        let id_partie  = data.id_partie;         
        if (!pseudo ||!id_partie){
            debug("data must have pseudo, and id_partie when joining a game.")
            if (typeof callback === "function") {
                callback({
                    status: "data must have pseudo, and id_partie when joining a game."
                  });    
            }
            return;
        }
        let partie = partieContextHashTable.get(id_partie);
        if (partie){partie.requestRejoindreUnJeu(nsp, socket, pseudo, socket.id);}
        else{
            debug("Game does not exist.", partieContextHashTable)
            if (typeof callback === "function") {
                callback({
                    status: "Game does not exist"
                });
            }
        } 
    })

    socket.on("disconnect", async () => {
        debug("[server] Player Disconnect " +socket.id);
        const res = await Joueur_partie_role.findOne(
            {socket_id : socket.id}).select({id_partie: 1, id_joueur : 1})
        try{
            let partie = partieContextHashTable.get(res.id_partie.toString());
            if (partie){partie.requestDisconnect(nsp, res.id_joueur, socket.id);}
            else{
                throw new Error("Partie was not found");
            }
        }
        catch(err){
            debug("socket has not been saved correctly or the player is not in a game"+ 
                        " error = " + err);
        }
    })

    socket.on("send-message-game", (message, roomId, pseudo, id_partie) => {
        debug("Message request received");
        if (!roomId || !message || !pseudo || !id_partie){
            debug("roomId = "+roomId+"message = "+message+"pseudo = "+pseudo+"id_partie = "+id_partie)
            debug("Please provide the message, roomId, pseudo, id_partie");
            return;
        }
        try{
            let partie = partieContextHashTable.get(id_partie);
            if (partie){partie.requestMessage(nsp, socket, message, roomId, pseudo);}
            else{
                throw new Error("Partie was not found while sending a message");
            }
        }
        catch(err){
            debug("Send message error = " + err);
        }
    })


    //Vote de jour du village
        /**
         * L'id du joueur qui vote
         * L'id du joueur pour qui on vote
         * 
         */
    socket.on("vote-jour",async (pseudoVoteur, candidantVote, id_partie) => {
        debug("Vote Jour pour : " + message)
        if (!pseudoVoteur || !candidantVote || !id_partie ){
            debug("pseudoVoteur = "+pseudoVoteur+"candidantVote = "+candidantVote+"id_partie = "+id_partie)
            debug("Please provide the player who made the vote, the player from whom you wish"+ 
                            "to vote for and the game id ");
            return;
        }
        try{
            let partie = partieContextHashTable.get(id_partie);
            if(partie)
            { 
                partie.requestVote(pseudoVoteur, candidantVote, id_partie, socket) 
            }
        }   
        catch(err){
            debug("Vote jour went wrong = " + err);
        }
    })
    

    //Vote de nuit des loup-garous
    /**
         * L'id du joueur qui vote
         * L'id du joueur pour qui on vote
         * room : id de la room des loup-garous
         */
    socket.on("vote-nuit",async(pseudoVoteur, candidantVote, id_partie)=>{
      debug("Vote Nuit par : " + pseudoVoteur)
      if (!pseudoVoteur || !candidantVote || !id_partie ){
        debug("pseudoVoteur = "+pseudoVoteur+"candidantVote = "+candidantVote+"id_partie = "+id_partie)
        debug("Please provide the player who made the vote, the player from whom you wish"+ 
        "to vote for and the game id ");
        return;
      }
      try{
        let partie = partieContextHashTable.get(id_partie);
        if(partie){ 
            partie.requestVote(pseudoVoteur, candidantVote, id_partie, socket) 
        }
    }   
    catch(err){
        debug("Vote nuit went wrong = " + err);
    }
   })

    //Pouvoir spiritisme: 
    /** 
     * This special power can be done during the day 
     * and it will add new chat that the player can access and can send messages on during the night
     * the new chat will hold only two people and can only be valid for one night 
     * @param pseudoJoueur  L'id de la of player that used the power
     * @param pseudoCible  L'id de la of player that the power was used on 
     * @param id_partie L'id de la partie
     */
    socket.on("Pouvoir-Spiritisme",async(pseudoJoueur, pseudoCible, id_partie)=>{
      debug("Pouvoir-Spiritisme executée par : " + pseudoVoteur)
      if (!pseudoJoueur || !pseudoCible || !id_partie ){
        debug("pseudoJoueur = "+pseudoJoueur+" pseudoCible = "+pseudoCible+" id_partie = "+id_partie)
        debug("Please provide the player who made the vote, the player from whom you wish"+ 
        "to vote for and the game id ");
        return;
      }
      try{
        let partie = partieContextHashTable.get(id_partie);
        if (partie){partie.requestSpiritisme(nsp, socket, pseudoJoueur, pseudoCible);}
      }   
      catch(err){
          debug("Pourvoir spiritisme went wrong = " + err);
      }
    })

    //Pouvoir de voyance
    /**
     * L'id de la voyante
     * L'id de la partie
     * l'id du joueur dont on veut connaître le rôle
     */
    socket.on("RequestVoyance", async(id_joueur,id_partie,id_joueur_cible)=>{
        let partie = partieContextHashTabentrantle.get(id_partie);
        if(partie)
            {
                //On retrouve l'_id du joueur cible
                const value = await User.findOne({name:id_joueur_cible}).select({_id:1,__v:0,password:0})

                //On retoruve l'_id de la voyante
                const value_voyante = await User.findOne({name:id_joueur}).select({_id:1,__v:0,password:0})
                
                if(value && value_voyante){
                    //On retrouve les datats du joueur cible dans la partie
                    const joueur = await joueur_partie_role.findOne({id_joueur:value._id,id_partie:id_partie})

                    //On retrouve le socket.id de la voyante dans la partie
                    const voyante = await joueur_partie_role.findOne({id_joueur:value_voyante._id,id_partie:id_partie}).select({socket_id:1})


                    //On envoie les données de la cible à la voyante
                    socket.to(voyante.socket_id).emit("SendPlayerDataToVoyante",{data:joueur}) 
                }  
            }
    })

    //Pouvoir du loup-alpha
    /**
     * L'id du loup alpha
     * L'id de la partie
     * l'id du joueur qu'on veut contaminer
     */
    socket.on("Request-Loup-alpha",async( id_joueur,id_partie,id_joueur_cible )=>{
        let partie = partieContextHashTabentrantle.get(id_partie);
        if(partie)
            {
                //On retrouve l'_id du joueur cible
                const value = await User.findOne({name:id_joueur_cible}).select({_id:1,__v:0,password:0})

                //On retoruve l'_id de l'alpha
                const value_alpha = await User.findOne({name:id_joueur}).select({_id:1,__v:0,password:0})
                
                if(value && value_alpha){
                    //On retrouve le socket.id du joueur cible dans la partie
                    let joueur = await joueur_partie_role.findOne({id_joueur:value._id,id_partie:id_partie}).select({_id:0,__v:0})

                    //On retrouve le socket.id de l'alpha dans la partie
                    const alpha = await joueur_partie_role.findOne({id_joueur:value_alpha._id,id_partie:id_partie}).select({socket_id:1})

                    //On change le role de la cible en loup-garou 
                    joueur.role = ROLE.loupGarrou                   
                    //On update le joueur en base de données.
                    const lg = await joueur_partie_role.updateOne({id_joueur:value._id,id_partie:id_partie},{role:ROLE.loupGarrou})

                    //On notifie la cible de son rôle a changé
                    socket.to(joueur.socket_id).emit("SendPlayerNewData",{description:"Your role has changed to loup-garou",data:joueur}) 
                    
                    //On signale au loup alpha que le rôle du joueur a changé
                    socket.to(alpha.socket_id).emit("PlayerDataUpdate",{description:id_joueur_cible+" role changed "}) 
                }  
            }
        
    })

})

module.exports = {nsp, server}


