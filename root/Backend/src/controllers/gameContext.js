const FinJeuState = require('./finJeuState');
const EnAttenteState = require('./enAttenteState');
const JourState = require('./JourState');
const NuitState = require('./NuitState');

const Partie = require('../models/partie');
const debug = require('debug')('GameContext');


class StateContext {
  constructor(partieId) {
    this.partieId = partieId
    this.stateEnAttente = new EnAttenteState(this)
    this.stateFinJeu = new  FinJeuState(this)
    this.stateJour = new JourState(this)
    this.stateNuit = new NuitState(this)
    //When the game is create it is place in the wait state
    this.state = this.stateEnAttente;

    //These values are not necessary 
    //but they can make the server much faster since we don't have 
    //to fetch data from the database constantly  
    this.nb_actif_players = 0;
    this.pseudoList = [];
    this.pseudoListDisconnect = [];
    // table used to determine the players that have used their power
    //this table is reset everytime we enter the night state 
    this.usedPower = []; 
    //Game socket
    this.nsp = null;

    /**
     * Increment this value :
     *  each time a new player joins,
     *  Each time a playe leaves a game
     * When a player is killed at the end of votes
     * */ 
    this.nbAlivePlayer = 0;

    //Map that contains the list of alive player of a particular game and the current number of votes against each player 
    //at a particular moment
    //The value of each vote against a player is reset to 0 at each game's state changes. exple : day -> night
    this.currentPlayersVote = new Map();
    //Stores the players that have already voted
    this.votersList = []
    //We declare the values that will added later on : 
    this.dureeJour = null; 
    this.dureeNuit = null;
    this.proportionLoup = null; 
    this.probaPouvoirSpeciaux = null;
    this.nbParticipantSouhaite = null;
    this.tempsDebut = null;
    //room id of the game used for informing all of the players 
    //of an information that should be broadcasted to everybody 
    this.roomId = null; 
    //Used for loup garrou inner communication
    this.roomLoupId = null;
    //Chat rooms
    this.generalChatRoom = null;
    this.loupChatRoom = null;
    this.gameStatus = null;
  }

  /**
   * This method saves saves values in the context of the game directly
   * because it would be pointless to fetch from the database everytime
   * thus gaining a significant amount of time
 */
  async initAttributs(){
    let partie = await this.getPartieData();
    this.dureeJour = partie.duree_jour; 
    this.dureeNuit = partie.duree_nuit;
    this.proportionLoup = partie.proportion_loup; 
    this.probaPouvoirSpeciaux = partie.proba_pouvoir_speciaux;
    this.nbParticipantSouhaite = partie.nb_participant;
    this.tempsDebut = partie.heure_debut;
    this.gameStatus = partie.statut;
    this.roomId = partie.room_id;
    this.roomLoupId = partie.room_loup_id;
    this.nbAlivePlayer = 0;
  }

  async getPartieData(){
    const partie = await  Partie.findById(this.partieId)
    return partie;
  }

  async setState(state) {
    debug("Set state called, current state = " + this.gameStatus);
    let resEndCode = await this.state.endCode();
    if (resEndCode == 0){
      debug("End code failed; Ending game")
      return 0;
    }
    this.state = state;
    await this.state.setupCode();
    return 1;
  }

  requestRejoindreUnJeu(pseudoVoteur, candidantVote, id_partie, socket) {
    return this.state.handleRejoindreJeu(pseudoVoteur, candidantVote, id_partie, socket);
  }

  requestVote(pseudoVoteur, candidantVote, socket_id) {
    return this.state.handleVote(pseudoVoteur, candidantVote, socket_id);
  }
  
  requestSpiritisme(pseudoJoueur, pseudoCible) {
    return this.state.handleSpiritisme(pseudoJoueur, pseudoCible);
  }

  requestDisconnect(nsp, id_joueur, socket_id){ 
    return this.state.handleDisconnect(nsp, id_joueur, socket_id);
  }

  requestMessage(nsp, socket, message, roomId, pseudo) {
    return this.state.handleMessage(nsp, socket, message, roomId, pseudo);
  }

  requestVoyance(pseudoJoueur, pseudoCible){
    return this.state.handleVoyance(pseudoJoueur, pseudoCible);
  }

  requestContamination(pseudoJoueur, pseudoCible){
    return this.state.handleContamination(pseudoJoueur, pseudoCible);
  }

}

/**
 * This hashtable will be used for associating every game id to a context to 
 */
const partieContextHashTable = new Map();


module.exports = {
  StateContext,
  partieContextHashTable
}