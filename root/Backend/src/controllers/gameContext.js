const FinJeuState = require('./finJeuState');
const EnAttenteState = require('./enAttenteState');
const JourState = require('./JourState');
const NuitState = require('./NuitState');

const Partie = require('../models/partie');

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
    //but they can make the server much faster 
    this.nb_actif_players = 0;
    this.peudoList = [];

    //Map that contains the list of alive player of a particular game and the current number of votes against each player 
    //at a particular moment
    //The value of each vote against a player is reset to 0 at each game's state changes. exple : day -> night
    this.currentPlayersVote = new Map()

  }

  /**
   * This method saves saves values in the context of the game directly
   * because it would be pointless to fetch from the database everytime
   * thus gaining a significant amount of time
 */
  async initAttributs(){
    let partie = await this.getPartieData();
    this.durepartieeJour = partie.duree_jour; 
    this.dureeNuit = partie.duree_nuit;
    this.proportionLoup = partie.proportionLoup; 
    this.probaPouvoirSpeciaux = partie.proba_pouvoir_speciaux;
    this.nbParticipantSouhaite = partie.nb_participant;
    this.heureDebut = partie.heure_debut;
    console.log(this.heureDebut);
  }

  async getPartieData(){
    const partie = await  Partie.findById(this.partieId)
    return partie;
  }

  setState(state) {
    this.state.endCode();
    this.state = state;
    this.state.setupCode();
  }

  requestRejoindreUnJeu(socket, pseudo, socket_id) {
    return this.state.handleRejoindreJeu(socket, pseudo, socket_id);
  }

  requestVote(socket,id_joueur) {
    return this.state.handleVote(socket,id_joueur,this.currentPlayersVote);
  }

  requestVote(socket,id_joueur,room) {
    return this.state.handleVote(socket,id_joueur,room,this.currentPlayersVote);
  }

  

  requestPouvoir() {
    return this.state.handlePouvoir();
  }

  requestDisconnect(id_joueur, socket_id){ 
    return this.state.handleDisconnect(id_joueur, socket_id);
  }

  requestMessage(pseudo, chatid, messsage) {
    return this.state.handleVote();
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