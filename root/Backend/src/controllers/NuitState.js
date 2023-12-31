const GameState = require("./gameState");

const debug = require('debug')('NuitState');
const {GAME_STATUS, CHAT_TYPE, ROLE, PLAYER_STATUS,
      GAME_VALUES, SPECIAL_POWERS} = require("./constants");
const Partie = require('../models/partie');
const User = require('../models/user');
const Joueur_partie_role = require('../models/joueur_partie_role');
const joueur_partie_role = require("../models/joueur_partie_role");
const { v4: uuidv4 } = require('uuid');
const {Chat,Message} = require('../models/chat')


class NuitState extends GameState {
  constructor(context) {
    super(context)
    //Cette valeur est à reinitialiser à chaque changement de gamestate
    this.deadPlayer = ""
    this.nbVoteNuit = 0
    this.lockVotes = false;
    this.nbAliveLoup = -1;
  }

  /**
   * The list of action that will treated in this state are 
   * all of the special powers
   * Vote night
   */

  async setupCode(){    
    debug("Setting up night state")
    await this.updateGameStatusDataBase(GAME_STATUS.soir);
    await this.sendGameStatus();
    await this.sendPlayersInformation();
    //We unlock votes
    this.lockVotes = false;
    this.configureTimer();
    //We update the values of the alive loup
    this.nbAliveLoup = await this.getCountRole(ROLE.loupGarou, PLAYER_STATUS.vivant);
    //Reset power used table
    this.context.usedPower = [];
    // await this.testMethod()
  }

  async testMethod(){
    /**
     * Jackson est mort
     * Mouahe est un humain qui a un pouvoir de spiritisme pour discuter avec  Jackson
     * Emmanuel a un pouvoir de voyante
     * Samuel est un loup qui a un pouvoir de contamination
     * Mehdi a été contaminé par Samuel
     */
    const idsamuel =  await this.getPlayerId("samuel");
    const idmehdi =  await this.getPlayerId("mehdi");
    const idemmanuel =  await this.getPlayerId("emmanuel");
    const idmouahe =  await this.getPlayerId("mouahe");
    const idjackson =  await this.getPlayerId("jackson");

    //Samuel est un loup alpha
    const updateSamuel = await Joueur_partie_role.updateOne(
      {id_joueur:idsamuel ,
         id_partie:this.context.partieId},
      {role:ROLE.loupGarou,pouvoir_speciaux:SPECIAL_POWERS.contamination})

      //Mehdi est un humain
      const updateMehdi = await Joueur_partie_role.updateOne(
        {id_joueur: idmehdi ,
           id_partie: this.context.partieId},
        {role: ROLE.humain, pouvoir_speciaux: ROLE.humain})

      
      //Emmanuel est un loup alpha
    const updateEmmanuel = await Joueur_partie_role.updateOne(
      {id_joueur: idemmanuel ,
         id_partie: this.context.partieId},
      {role: ROLE.humain, pouvoir_speciaux: SPECIAL_POWERS.voyanteHumain})

      //Jackson est mort
    const updateJackson = await Joueur_partie_role.updateOne(
      {id_joueur: idjackson ,
         id_partie: this.context.partieId},
      {role: ROLE.humain, pouvoir_speciaux: ROLE.humain, statut: PLAYER_STATUS.mort})

      //Mouahe fait du spiritisme
    const updateMouahe = await Joueur_partie_role.updateOne(
      {id_joueur: idmouahe ,
         id_partie: this.context.partieId},
      {role: ROLE.humain, pouvoir_speciaux: SPECIAL_POWERS.spiritismeHumain})

      //await this.handleVote("samuel", "mehdi",playerJoueurLink.socket_id);
    
    //Contamination :  Samuel contamine Mehdi
     await  this.handleContamination("samuel","mehdi")

    //Voyance : Emmanuel voit les attributs de Mehdi
    await this.handleVoyance("emmanuel","mehdi")

    //Spiritisme : Mouahe veut discuter avec Jackson
    await this.handleSpiritisme("mouahe","jackson")

  }
    
  async handleVote(pseudoVoteur, candidantVote, socket_id) {
    debug("Handle vote for the night state was called");
    if (!(await this.verifyThatVoteIsPossible(pseudoVoteur, candidantVote))){  
      debug("Vote is not possible");
      return;
    }
    debug(pseudoVoteur+" can vote and is voting for " + candidantVote);
    let voteCounter = this.context.currentPlayersVote.get(candidantVote)

    if(!voteCounter) {
        debug("Premier vote contre : " + candidantVote)
        voteCounter = 0
    }

    this.context.currentPlayersVote.set(candidantVote, voteCounter+1)
    this.context.votersList.push(pseudoVoteur);

    this.nbVoteNuit++;

    //On répond au joueur que son vote a été pris en compte
    this.context.nsp.to(socket_id).emit("VoteNuitEnregistré",{description:"Vote-Okay"})

    //On informe les autres loup-garous du joueur voté : 
    this.context.nsp.to(this.context.roomLoupId).emit("notif-vote", {
                message : pseudoVoteur + "has voted for : " + candidantVote,
                voteur : pseudoVoteur, 
                candidat : candidantVote
    });
    
    //On check pour savoir si tous les joueurs vivants ont voté
    if(this.nbVoteNuit === this.nbAliveLoup)
    {
      clearTimeout(this.timeout);
      await this.timerCooldown();
    }
  }

  async finaliseVotingProcess(){
    //On remet le nombre de votes à 0
    this.lockVotes = true;
    this.nbVoteNuit = 0
    this.context.votersList = [];
    debug("Finalise Voting Process")
    //variable who check if there is many person with the same number of votes
    let duplicate;

    //On recupere l'id du joueur avec le plus de votes contre lui
    let maxKey = "";
    let maxValue = -1;
    for (let [key, value] of this.context.currentPlayersVote) {
      debug("Player vote : " + key + " -> " + value)
        if (value > maxValue) {
            maxValue = value;
            maxKey = key;
            duplicate = false
        }
        else if(value === maxValue) duplicate = true
    }
    debug("currentPlayersVote :  " + this.context.currentPlayersVote)
    debug("Player with the most votes : " + maxKey + " -> " + maxValue)

    this.context.currentPlayersVote = new Map();
    if (maxValue <= 0){
      debug("No majority was reached");
      return;
    }
    //Les loups ont pu s'entendre
    if(duplicate != true){
        debug("Update of player statut after votes")
        //On décremente le nombre de joueurs vivants :
        this.context.nbAlivePlayer--;

        //On change le statut du joueur avec le plus de vote contre lui
        //On récupère son id_joueur
        const playerId = await this.getPlayerId(maxKey); 
        //On change son statut
        await Joueur_partie_role.updateOne({id_joueur:playerId,id_partie:this.context.partieId},{statut:PLAYER_STATUS.mort});
        //On change le state pour indiquer quel joueur a été tué pendant la nuit.
        this.deadPlayer=maxKey;
        // On indique aux reste des jours la decision des loups;
        this.context.nsp.to(this.context.roomId).emit("notif-vote-final",{
          message : "Un joueur a été tué : " + maxKey,
        })

        debug("Making dead player join wolf chat room socket after day vote");
        const joueurPowerLink = await Joueur_partie_role
        .findOne({id_joueur:playerId, id_partie:this.context.partieId})
        if (joueurPowerLink){
          let playerSocket = this.context.nsp.sockets.get(joueurPowerLink.socket_id);
          playerSocket.join(this.context.loupChatRoom);
          debug("Dead player joined socket");
        }
    }
    //Les loups n'ont pas pu s'entendre pour tuer quelqu'un
    else {
        // On indique aux reste des jours la decision des loups;
        this.context.nsp.to(this.context.roomId).emit("notif-vote-final", {
          message : "Aucun joueur n'a été tué"
        })
    }
  }

  endCode(){
    debug("Currently in the end of code of the night state");
    return 1;
  }

  /**
   * This class creates a custom chat room and add the users 
   * that we specified as function arguements to it 
   * @param  {...any} usersIds a array table contating all of the ids
   *  of the players that the chat will be composed of 
   */
  async createCustomchat(...usersIds){
    debug("Creating a custom chat room for the game : "+ this.context.partieId);
    debug("The users that will added to the room are :", usersIds);
    if (usersIds.length < 0 ){
      debug("users table in empty when creating users");
      return null;
    }
    const customChatroom = uuidv4();
    const chatCustom = new Chat({
      chat_type: CHAT_TYPE.custom_chat,
      id_partie: this.context.partieId, 
      chat_room_id : customChatroom,
      players_id : usersIds
    })
    
    await chatCustom.save()
    .catch((err) => {debug("custom chat couldn't get created wasn't created  error"+err);})
    
    const playerJoueurLink = await Joueur_partie_role.find({id_partie: this.context.partieId});
    if (!playerJoueurLink){
      debug("Players were not found in the database");
      return null;
    }
    //Horrible complexity .....
    playerJoueurLink.map((player) =>{

     //If the player isn't amongst the two players (the spiritist,the target)
      if (!(usersIds.some(item => (item._id).toString() === (player.id_joueur).toString()))){       
        return;
      }
      debug("Player game link was found add his to the custom chat, player id = ",player.id_joueur);
      let playerSocket = this.context.nsp.sockets.get(player.socket_id);
      if (!playerSocket){
        debug("Player socket was not found, id of the player = " + player.id_joueur);
        return;
      }
      debug("++++++++ player  joins the room  ++++++")
      playerSocket.join(customChatroom);
    })

    debug("Custom chat room was created for the game  : "+ this.context.partieId);
    debug("custom chat room id  = " + customChatroom)
    //customChatroom or createCustomChatroom as seen previously
    return customChatroom;
  }
  
  /**
   * Checks if the pseudo correspond to actual players in the database
   * and it is the case it returns the ids of the player
   * @return an array containing both players id 
   */
  async checkThatPlayersExist(pseudoJoueur, pseudoCible){
    //We return the id the of the player taht used the power 
    const joueurPowerId = await this.getPlayerId(pseudoJoueur);
    //We return the if of the victim
    const cibleId = await this.getPlayerId(pseudoCible);
    if (!joueurPowerId || !cibleId){
      debug("One or all of the specified players do not exist, please provide correct user information");
      return null;
    }

    return [joueurPowerId, cibleId];
  }

  /**
   * Gathers user data from the data base and
   * returs it 
   * @param {*} joueurPowerId 
   * @param {*} cibleId 
   * @returns 
   */
  async checkThatDataExists(joueurPowerId, cibleId){
    //We gather data about this two players
    const joueurPowerLink = await Joueur_partie_role
      .findOne({id_joueur:joueurPowerId, id_partie:this.context.partieId})
    const victimLink = await Joueur_partie_role
      .findOne({id_joueur:cibleId, id_partie:this.context.partieId})
    if (!joueurPowerLink || !victimLink){
      debug("I could not find players datat in this game")
      return null;
    }
    return [joueurPowerLink, victimLink];
  }

/**
   * This function checks if the we can apply the special power spiritisme
   * it will first check that all entries are valid
   * then it will check that the user has not used his special powers
   * then it will verify that the player can use this power
   * and status of the players  
   * @param {*} pseudoJoueur 
   * @param {*} victimPseudo 
   * @param {*} joueur 
   * @param {*} victim 
   */
  checkIfFitSpiritisme(pseudoJoueur, victimPseudo, joueurData, victimData){
    debug("Checking if "+ pseudoJoueur+" can use spiritisme on "+victimPseudo)
    if (!pseudoJoueur || !victimPseudo || !joueurData || !victimData){
      debug("Entry is not correct for checkIfFitSpiritisme!!")
      return false;
    }
    if (this.context.usedPower.includes(pseudoJoueur)){
      debug(pseudoJoueur + " has already used his power");
      return false;
    }
    if (joueurData.pouvoir_speciaux !== SPECIAL_POWERS.spiritismeHumain &&
        joueurData.pouvoir_speciaux !== SPECIAL_POWERS.spiritismeLoup){
      debug(pseudoJoueur + " does not possess this power");
      return false;
    }
    if (joueurData.statut !== PLAYER_STATUS.vivant ||
      victimData.statut !== PLAYER_STATUS.mort){
      debug(" The players do not have the correct status for this power to be ran");
      return false;
    }
    debug("All is valid spiritisme can be used in this case by "
          +pseudoJoueur+" on "+victimPseudo);
    return true;
  }

  /**
   * This functions is used for handling spiritisme special power
   * this action can only get applied during the night: 
   * It first verifies that both players are fit for this power
   * create a chat room and add both players in it
   * that hey
   * if that is the case it will launch  have joined the game
   * @param {*} pseudoJoueur the player that used the power 
   * @param {*} pseudoCible the player that we applied the power on
   * @returns 
   */
  async handleSpiritisme(pseudoJoueur, pseudoCible){
    debug("Handle pouvoir spiritisme called, we are at the night time");
    //On récupere les information qui concerne le joueur qui utiliser le pouvoir dans la partie
    const usersIdTable = await this.checkThatPlayersExist(pseudoJoueur, pseudoCible);
    if (usersIdTable==null){
      debug("Leaving special power users were not found");
      return;
    }
    const [joueurPowerId, cibleId] = usersIdTable; 
    const usersData = await this.checkThatDataExists(joueurPowerId, cibleId);
    if (usersData == null){
      debug("Leaving special power users were not found");
      return;
    }
    const [joueurPowerLink, victimLink] = usersData;

    if (!this.checkIfFitSpiritisme(pseudoJoueur, pseudoCible, joueurPowerLink, victimLink)){
      debug("Cannot apply spiritisme")
      return;
    }
    const chatRoom = await this.createCustomchat(joueurPowerId, cibleId);
    if (chatRoom == null){
      debug("Custom chat room was not created leaving power");
    }
    let data = {
      message : "new custom chat was created by " + pseudoJoueur,
      chats : {
        chatcustom : {
          chatname : "chat pouvoir spiritisme",
          chatroom : chatRoom  
        }
      }
    }
    this.context.usedPower.push(pseudoJoueur);
    this.context.nsp.to(chatRoom).emit("new-custom-chat", data);

    debug("Chat room created with success");
  }
  
  /**
   * This function checks if the we can apply the special power voyance
   * it will first check that all entries are valid
   * then it will check that the user has not used his special powers
   * then it will verify that the player can use this power
   * and status of the of the player that we have used the power on
   * @param {*} pseudoJoueur 
   * @param {*} victimPseudo 
   * @param {*} joueur 
   * @param {*} victim 
   */
  checkIfFitVoyance(pseudoJoueur, victimPseudo, joueurData, victimData){
    debug("Checking if "+ pseudoJoueur+" can use Voyance on "+victimPseudo)
    if (!pseudoJoueur || !victimPseudo || !joueurData || !victimData){
      debug("Entry is not correct for checkIfFitVoyance!!")
      return false;
    }
    if (this.context.usedPower.includes(pseudoJoueur)){
      debug(pseudoJoueur + " has already used his power");
      return false;
    }
    if (joueurData.pouvoir_speciaux !== SPECIAL_POWERS.voyanteLoup &&
        joueurData.pouvoir_speciaux !== SPECIAL_POWERS.voyanteHumain){
      debug(pseudoJoueur + " does not possess this power");
      debug(joueurData.pouvoir_speciaux , SPECIAL_POWERS.voyanteHumain , SPECIAL_POWERS.voyanteLoup)
      return false;
    }
    if (joueurData.statut !== PLAYER_STATUS.vivant){
      debug("The player that used the power is dead");
      return false;
    }
    if (victimData.status === PLAYER_STATUS.mort){
      debug(victimPseudo + " player is dead and this power cannot be used on him");
      return false;  
    }
    debug("All is valid voyance can be used in this case by "
          +pseudoJoueur+" on "+ victimPseudo);
          this.context.usedPower.push(pseudoJoueur);
    return true;
  }

  /**
   * This functions is used for handling the voayance special power
   * this action can onlyky get applied during the night: 
   * It first verifies that both players are fit for this power
   * if that is the case it will launch 
   * @param {*} pseudoJoueur the player that used the power 
   * @param {*} pseudoCible the player that we applied the power on
   * @returns 
   */
  async handleVoyance(pseudoJoueur, pseudoCible){
    debug("Handle pouvoir voyance, we are at the night time");
    const usersIdTable = await this.checkThatPlayersExist(pseudoJoueur, pseudoCible);
    if (usersIdTable==null){
      debug("Leaving special power users were not found");
      return;
    }
    const [joueurPowerId, cibleId] = usersIdTable; 
    const usersData = await this.checkThatDataExists(joueurPowerId, cibleId);
    if (usersData == null){
      debug("Leaving special power users were not found");
      return;
    }
    const [joueurPowerLink, victimLink] = usersData;
    if (!(this.checkIfFitVoyance(pseudoJoueur, pseudoCible, joueurPowerLink, victimLink))){
      debug("Cannot apply Voyance")
      return;
    }
    let data = {
      message : "Voyance has been ran by " +
                pseudoJoueur + " on " + pseudoCible,
      partieId : this.context.partieId,
      pseudoJoueur : pseudoJoueur,
      ciblePseudo : pseudoCible,
      cibleRole : victimLink.role,
      ciblePowers : victimLink.pouvoir_speciaux,
    }
    
    debug("Emit player data to voyante : "+ joueurPowerLink.socket_id )
    this.context.nsp.to(joueurPowerLink.socket_id).emit("send-Player-Data-Voyante",data); 
  }

    /**
   * This function checks if the we can apply the special power Contamination
   * it will first check that all entries are valid
   * then it will check that the user has not used his special powers
   * then it will verify that the player can use this power
   * and status of the of the player that we have used the power on
   * @param {*} pseudoJoueur 
   * @param {*} victimPseudo 
   * @param {*} joueur 
   * @param {*} victim 
   */
  checkIfFitContamination(pseudoJoueur, victimPseudo, joueurData, victimData){
    debug("Checking if "+ pseudoJoueur+" can use Contamination on "+victimPseudo)
    if (!pseudoJoueur || !victimPseudo || !joueurData || !victimData){
      debug("Entry is not correct for checkIfFitContamination!!")
      return false;
    }
    if (this.context.usedPower.includes(pseudoJoueur)){
      debug(pseudoJoueur + " has already used his power");
      return false;
    }
    if (joueurData.role !== ROLE.loupGarou){
      debug(pseudoJoueur + " is not a loup and can not use this power");
      return false;  
    }
    if (victimData.role !== ROLE.humain){
      debug(victimPseudo + " is not a human and this power cannot be used on him");
      return false;  
    }
    if (victimData.status === PLAYER_STATUS.mort){
      debug(victimPseudo + " player is dead and this power cannot be used on him");
      return false;  
    }
    if (joueurData.statut !== PLAYER_STATUS.vivant){
      debug("The player that used the power is dead");
      return false;
    }
    if (joueurData.pouvoir_speciaux !== SPECIAL_POWERS.contamination){
      debug(joueurData.pouvoir_speciaux)
      debug(pseudoJoueur + " does not possess this power");
      return false;
    }
    debug("All is valid contamination can be used in this case by "
          +pseudoJoueur+" on "+ victimPseudo);
    return true;
  }
  /**
   * This functions is used for handling the contamination special power
   * this action can onlyky get applied during the night: 
   * It first verifies that both players are fit for this power
   * if that is the case it will launch 
   * @param {*} pseudoJoueur the player that used the power 
   * @param {*} pseudoCible the player that we applied the power on
   * @returns 
   */
  async handleContamination(pseudoJoueur, pseudoCible){
    debug("Handle pouvoir loup alpha, we are at the night time");
    const usersIdTable = await this.checkThatPlayersExist(pseudoJoueur, pseudoCible);
    if (usersIdTable==null){
      debug("Leaving special power users were not found");
      return;
    }
    const [joueurPowerId, cibleId] = usersIdTable; 
    const usersData = await this.checkThatDataExists(joueurPowerId, cibleId);
    if (usersData == null){
      debug("Leaving special power users were not found");
      return;
    }
    const [joueurPowerLink, victimLink] = usersData;
      if (!this.checkIfFitContamination(pseudoJoueur, pseudoCible, joueurPowerLink, victimLink)){
        debug("Cannot apply alpha loup super power")
        return;
      }
    let playerSocket = this.context.nsp.sockets.get(victimLink.socket_id);
    if (!playerSocket){
      debug("socket was not found, something went terribly wrong !!!, canceling action");
      return;
    }
    // We need to update in the database directly. There we just change the object but not the database values
    debug("Update player : " + pseudoCible + " status to loupgarou && special powers")
    const updates = await joueur_partie_role.updateOne({id_joueur: cibleId, id_partie: this.context.partieId}, {role:ROLE.loupGarou})

    victimLink.role = ROLE.loupGarou;
    //We completly remove special powers because some powers 
    if (victimLink.pouvoir_speciaux === SPECIAL_POWERS.insomnie){
      //This speacial power can only be used by humans so we need to reset it 
      const updates2 = await joueur_partie_role.updateOne({id_joueur: cibleId, id_partie: this.context.partieId}, 
                                  {pouvoir_speciaux: SPECIAL_POWERS.pasDePouvoir})
      debug("Update player : " + pseudoCible + " special powers")
      //In this case the player is already in the loup chat because of this power 
      //we don't need to add him
    }
    else{
      //We add player in the loup chat 
      playerSocket.join(this.context.loupChatRoom);
    }
    playerSocket.join(this.context.roomLoupId);
    
    let data = {
      message : "Contamination has been ran by " +
                pseudoJoueur + " on " + pseudoCible,
      partieId : this.context.partieId,
      pseudoJoueur : pseudoJoueur,
      ciblePseudo : pseudoCible,
    }
    this.context.usedPower.push(pseudoJoueur);
    this.context.nsp.to(joueurPowerLink.socket_id).emit("send-Player-Data-Contamination",data);
    this.context.nsp.to(victimLink.socket_id).emit("send-Player-Data-Contamination",data);
  }


  async timerCooldown(){
    debug("Timer cooldown changing state, current state = "+this.context.gameStatus);
    await this.finaliseVotingProcess();
    if (! (await this.checkGameStatus())){
      debug("Game ended, trying to go to the end state");
      await this.context.setState(this.context.stateFinJeu);
      return;
    }
    debug("All is valid, trying to go to the day state");
    setTimeout(this.goToDay.bind(this), 
                    3000);  
  }

  async goToDay(){
    await this.context.setState(this.context.stateJour);
  }

  configureTimer(){
    this.startTime = Date.now();
    if (!this.context.dureeNuit){
      throw Error("Timer was not configured correctly; night length not present")
    }
    this.timeout = setTimeout(this.timerCooldown.bind(this), 
                    (this.context.dureeNuit*GAME_VALUES.hour_time_s)*1000);
  }

}

module.exports = NuitState;
