const FinJeuState = require('./finJeuState');
const EnAttenteState = require('./enAttenteState');
const JourState = require('./JourState');
const NuitState = require('./NuitState');

class StateContext {
  constructor(partieId) {
    this.partieId = partieId
    this.stateEnAttente = new EnAttenteState(this)
    this.stateFinJeu = new  FinJeuState(this)
    this.stateJour = new JourState(this)
    this.stateNuit = new NuitState(this)
    //When the game is create it is place in the wait state
    this.state = this.stateEnAttente;
  }

  setState(state) {
    this.state.endCode();
    this.state = state;
    this.state.setupCode();
  }

  requestLogin() {
    return this.state.handleLogin();
  }

  requestVote() {
    return this.state.handleVote();
  }

  requestPouvoir() {
    return this.state.handlePouvoir();
  }

  requestDisconnect() {
    return this.state.handleDisconnect();
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