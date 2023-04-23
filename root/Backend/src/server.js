// Load .env Enviroment Variables to process.env
//This table will be used in order to player that has the socket id

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
             console.log( data + "connecté")

            //. On répond au joueur 
            nsp.to(socket.id).emit("RejoindreJeu",{description:"Bienvenue "+data})

            //On peut mettre ici une méthode POST pour ajouter la socket du joueur-partie
            //dans la base de données
         }

     );


     //Ce bloc a été commenté car n'étant pas complet il fait cracher le serveur

    socket.on("rejoindre-jeu", (data, callback) => {
        console.log("[server] Joining game" + JSON.stringify(data));
        let pseudo  = data.pseudo; 
        let id_partie  = data.id_partie;         
        if (pseudo == null || id_partie == null){
            if (typeof callback === "function") {
                console.log("data must have pseudo, and id_partie when joining a game.")
                callback({
                    status: "data must have pseudo, and id_partie when joining a game."
                  });    
            }
        }
        let partie = partieContextHashTable.get(id_partie);
        if (partie){partie.requestRejoindreUnJeu(nsp, socket, pseudo, socket.id);}
        else{
            if (typeof callback === "function") {
                console.log("Game does not exist.", partieContextHashTable)
                callback({
                    status: "Game does not exist"
                });
            }
        } 
    })

    socket.on("disconnect", async () => {
        console.log("[server] Player Disconnect " +socket.id);
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
            console.log("socket has not been saved correctly or the player is not in a game"+ 
                        " error = " + err);
        }
    })

    // socket.on("send-message-game",pseudo, id_partie, message, chat_id => {
    //     let partie = partieContextHashTable.get(id_partie)
    // })


    socket.on("send-message",message => {
        console.log("send:"+message)
        //On peut ajouter ici une vérification pour checker si le joueur
        //est réellement dans la partie etc...
        socket.broadcast.emit('receive-message',message)
        
        // console.log("message " + client  + message)
    })


    //Vote de jour du village
        /**
         * L'id du joueur qui vote
         * L'id du joueur pour qui on vote
         * 
         */
    let nbVoteJour = 0
    socket.on("vote-jour",async (id_joueur,id_partie) => {
        nbVoteJour ++
        console.log("Vote Jour pour : " + message)
        let partie = partieContextHashTable.get(id_partie);
        if(partie) 
            {
                //Passer en paramètres : le socket du joueur,id_partie, id_joueur,
                partie.requestVote(socket,id_joueur) 
                        
                //On check pour savoir si tous les joueurs vivants ont voté
                if(  nbVoteJour === partie.nb_actif_players)
                    {
                        //On remet le nombre de votes à 0
                        nbVoteJour = 0

                        //variable who check if there is many person with the same number of votes
                        let duplicate;

                        //On recupere l'id du joueur avec le plus de vote contre lui
                        let maxKey = "";
                        let maxValue = 0;
                        for (let [key, value] of partie.currentPlayersVote) {
                            if (value > maxValue) {
                                maxValue = value;
                                maxKey = key;
                                duplicate = false
                            }
                            else if(value === maxValue) duplicate = true
                            
                        }

                        //Les loups ont pu s'entendre
                        if(duplicate != true){
                            //Est ce que je dois supprimer les joueurs morts de la liste des votes des joueurs


                            //On change le statut du joueur avec le plus de vote contre lui
                            //On récupère son id_joueur
                            const value = await User.findOne({name:maxKey}).select({_id:1,__v:0,password:0})
                            //On change son statut
                            await Joueur_partie_role.updateOne({id_joueur:value.id_joueur},{statut:PLAYER_STATUS.mort});
                            socket.emit("JoueurMort",{name:maxKey})
                        }
                        //Les loups n'ont pas pu s'entendre
                        else{
                            socket.emit("NoJoueurMORT")
                        }
                    }

            }
    })
    

    //Vote de nuit des loup-garous
    /**
         * L'id du joueur qui vote
         * L'id du joueur pour qui on vote
         * room : id de la room des loup-garous
         * 
         */
    let nbVoteNuit = 0
    socket.on("vote-nuit",async(id_joueur,id_partie,room)=>{
        nbVoteNuit ++
        console.log("Vote Nuit pour : " + message)
        let partie = partieContextHashTable.get(id_partie);
        if(partie) 
            {
                //Passer en paramètres : le socket du joueur,id_partie, id_joueur,
                partie.requestVote(socket,id_joueur,room) 
                        
                //On check pour savoir si tous les joueurs vivants ont voté
                if(  nbVoteNuit === partie.nb_actif_players)
                    {
                        //On remet le nombre de votes à 0
                        nbVoteNuit = 0

                        //variable who check if there is many person with the same number of votes
                        let duplicate;

                        //On recupere l'id du joueur avec le plus de votes contre lui
                        let maxKey = "";
                        let maxValue = -1;
                        for (let [key, value] of partie.currentPlayersVote) {
                            if (value > maxValue) {
                                maxValue = value;
                                maxKey = key;
                                duplicate = false
                            }
                            else if(value === maxValue) duplicate = true
                        }

                        //Les loups ont pu s'entendre
                        if(duplicate != true){
                            //Est ce que je dois supprimer les joueurs morts de la liste des votes des joueurs


                            //On change le statut du joueur avec le plus de vote contre lui
                            //On récupère son id_joueur
                            const value = await User.findOne({name:maxKey}).select({_id:1,__v:0,password:0})
                            //On change son statut
                            await Joueur_partie_role.updateOne({id_joueur:value.id_joueur,id_partie:id_partie},{statut:PLAYER_STATUS.mort});

                            //On change le state pour indiquer quel joueur a été tué pendant la nuit.
                            partie.state.deadPlayer=maxKey;
                            
                            // On indique aux loups que leur choix a été pris en compte
                            socket.to(room).emit("JoueurMortByLoup",{name:maxKey})
                        }
                        //Les loups n'ont pas pu s'entendre pour tuer quelqu'un
                        else {
                             // On indique aux loups que leur choix a été pris en compte
                             socket.to(room).emit("NoJoueurMortByLoup")
                        }
                    }

            }
    })

    //Pouvoir de la sorcière : 
    /**
     * L'id de la sorciere
     * L'id de la partie
     * l'id du joueur mort avec lequel on veut discuter
     */
    socket.on("DiscussionSorciere",async(id_joueur,id_partie,id_joueur_mort)=>{
        let partie = partieContextHashTabentrantle.get(id_partie);
        if(partie)
            {
                //On retrouve l'_id du joueur mort
                const value = await User.findOne({name:id_joueur_mort}).select({_id:1,__v:0,password:0})

                //On retoruve l'_id de la sorciere
                const value_sorciere = await User.findOne({name:id_joueur}).select({_id:1,__v:0,password:0})
                
                if(value && value_sorciere){
                    //On retrouve le socket.id du joueur mort dans la partie
                    const joueur = await joueur_partie_role.findOne({id_joueur:value._id,id_partie:id_partie}).select({socket_id:1})

                    //On retrouve le socket.id de la sorciere dans la partie
                    const sorciere = await joueur_partie_role.findOne({id_joueur:value_sorciere._id,id_partie:id_partie}).select({socket_id:1})

                    //On informe  le joueur qu'on souhaite lui parler et on lui communique le socket.id de la sorciere
                    socket.to(joueur.socket_id).emit("RequestDiscussionSorciere",{emetteur:id_joueur,socket_id_sorciere:sorciere.socket_id})

                    //On envoie le socket.id de l'autre joueur à la sorciere 
                    socket.to(sorciere.socket_id).emit("SendPlayerSocketIdToSorciere",{socket_id_joueur:joueur.socket_id})

                    //On ecoute les méssages sortant de la sorciere  
                    //room ici c'est le socket.id du joueur mort avec lequel la socket veut communiquer
                    socket.on("send-message-Sorciere",(message,room) => {

                        console.log("send:"+message)

                        //Seule le joueur discutant avec la sorciere recoit les méssages
                        socket.to(room).emit('receive-message-Sorciere',message)
                        
                    })
                }
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
    socket.on("Request-Loup-alpha",async(id_joueur,id_partie,id_joueur_cible)=>{
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


