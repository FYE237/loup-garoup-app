// Load .env Enviroment Variables to process.env
//This table will be used in order to player that has the socket id

require('mandatoryenv').load([
    'MONGO_URL',
    'PORT',
    'SECRET'
]);

const { PORT } = process.env;
// const {hostname} = '130.190.21.189'

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


//Connexion  à la socket
nsp.on('connection', (socket) => {
    //Connexion réussie
    client++;
    console.log('New Socket connection id : ' + socket.id)

    //le joueur emet l'evenement rejoindre la partie
     socket.on('newPlayerConnect',(data) => 
         { 
             description: client +  'Hey, welcome!'
             console.log( data + "connecté")

            //. On répond au joueur 
            nsp.emit("RejoindreJeu",{description:"Bienvenue"})

            //On peut mettre ici une méthode POST pour ajouter la socket du joueur-partie
            //dans la base de données
         }

     );


     //Ce bloc a été commenté car n'étant pas complet il fait cracher le serveur

    // socket.on("rejoindre-jeu", pseudo, id_partie => {
    //     let partie = partieContextHashTable.get(id_partie);
    //     if (partie){partie.requestRejoindreUnJeu(socket, pseudo, socket.id);} 
    // })

    // socket.on("disconnect", async () => {
    //     const res = await Joueur_partie_role.findOne(
    //         {socket_id : socket_id}).select({partie_id: 1, id_joueur : 1})
    //     let partie = partieContextHashTable.get(res.partie_id);
    //     if (partie){partie.requestDisconnect(id_joueur, socket.id);} 
    // })

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

    socket.on("vote-jour",(message,id_partie) => {
        console.log("Vote pour : " + message)
        let partie = partieContextHashTable.get(id_partie);
        if(partie) 
            {
                //Passer en paramètres : socket,id_partie,id_joueur,
                partie.requestVote(socket,) 
            }

        socket.broadcast.emit("")
    })


})

module.exports = {nsp, server}


