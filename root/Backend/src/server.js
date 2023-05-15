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


//Connexion  à la socket
nsp.on('connection', (socket) => {
    //Connexion réussie
    client++;
    //console.log('New Socket connection id : ' + socket.id)

    

     //SOcket event  : Un  joueur rejoint une partie
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

    async function disonnectHandler(socket){
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
    }
                
    socket.on("disconnect", async () => {
        debug("[server] Player Disconnect " +socket.id);
        await disonnectHandler(socket);
    })

    socket.on("leave-game", async () => {
        debug("[server] Player left the game " +socket.id);
        await disonnectHandler(socket);
    })

    /**
     * message à envoyer
     * roomId : room dans laquelle envoyer le méssage
     * pseudo : pseudo du joueur qui envoie le méssage
     * id_partie : Id de la partie courante
     */
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
                partie.requestVote(pseudoVoteur, candidantVote, socket.id) 
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
      if (!pseudoVoteur || !candidantVote || !id_partie ){
          debug("pseudoVoteur = "+pseudoVoteur+"candidantVote = "+candidantVote+"id_partie = "+id_partie)
          debug("Please provide the player who made the vote, the player from whom you wish"+ 
          "to vote for and the game id ");
          return;
      }
      debug("Vote Nuit par : " + pseudoVoteur)
      try{
        let partie = partieContextHashTable.get(id_partie);
        if(partie){ 
            partie.requestVote(pseudoVoteur, candidantVote, socket.id) 
        }
    }   
    catch(err){
        debug("Vote nuit went wrong = " + err);
    }
   })

    //Pouvoir spiritisme: 
    /** 
     * This special power can be done during the night
     * and it will create a new chat that the targeted players can access and can send messages 
     * on during the night. The new chat will hold only two people and will only
     * be valid for one night but the user can recreate the chat with same user later on 
     * @param pseudoJoueur  id of player that used the power
     * @param pseudoCible  id of player that the power was used on 
     * @param id_partie id of the game
     */
    socket.on("Pouvoir-Spiritisme", async(pseudoJoueur, pseudoCible, id_partie)=>{
      if (!pseudoJoueur || !pseudoCible || !id_partie ){
          debug("pseudoJoueur = "+pseudoJoueur+" pseudoCible = "+pseudoCible+" id_partie = "+id_partie)
          debug("Please provide the player that used the power and the player on which the power was used on" 
          +"and the id the game   ");
          return;
      }
      debug("Pouvoir-Spiritisme ran by : " + pseudoJoueur)
      try{
        let partie = partieContextHashTable.get(id_partie);
        if (partie){partie.requestSpiritisme(pseudoJoueur, pseudoCible);}
      }   
      catch(err){
          debug("Pourvoir spiritisme went wrong = " + err);
      }
    })

    //Pouvoir voyance
    /** 
     * This special power can also be done during the night and it will allow the person 
     * using it to see the special powers of the targeted player
     * @param pseudoJoueur id of player that used the power
     * @param pseudoCible id of player that the power was used on 
     * @param id_partie id of the game
     */
    socket.on("request-Voyance", async(pseudoJoueur, pseudoCible, id_partie)=>{
        if (!pseudoJoueur || !pseudoCible || !id_partie ){
            debug("pseudoJoueur = "+pseudoJoueur+" pseudoCible = "+pseudoCible+" id_partie = "+id_partie)
            debug("Please provide the player that used the power and the player on which the power was used on" 
            +"and the id the game   ");
            return;
        }
        debug("Pouvoir-Voyance ran par : " + pseudoJoueur)
        try{
            let partie = partieContextHashTable.get(id_partie);
            if (partie){partie.requestVoyance(pseudoJoueur, pseudoCible);}
        }   
        catch(err){
              debug("Pouvoir voyance went wrong = " + err);
        }
    })

    //Pouvoir de Contamination(loup alpha)
    /** 
     * This special power can only be used during the night and it allow a loup 
     * garrou to transform a humain into a loup garrou 
     * @param pseudoJoueur id of player that used the power
     * @param pseudoCible id of player that the power was used on 
     * @param id_partie id of the game
     */
    socket.on("request-Loup-alpha",async(pseudoJoueur, pseudoCible, id_partie)=>{
        if (!pseudoJoueur || !pseudoCible || !id_partie ){
            debug("pseudoJoueur = "+pseudoJoueur+" pseudoCible = "+pseudoCible+" id_partie = "+id_partie)
            debug("Please provide the player that used the power and the player on which the power was used on" 
            +"and the id the game   ");
            return;
        }
        debug("Pouvoir-loup alpha ran par : " + pseudoJoueur)
        try{
            let partie = partieContextHashTable.get(id_partie);
            if (partie){partie.requestContamination(pseudoJoueur, pseudoCible);}
        }   
        catch(err){
              debug("Pouvoir Contamination went wrong = " + err);
        }
    })

})

module.exports = {nsp, server}


