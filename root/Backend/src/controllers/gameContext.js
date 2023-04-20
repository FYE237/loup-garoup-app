const FinJeuState = require('./finJeuState');
const EnAttenteState = require('./enAttenteState');
const JourState = require('./Jourstate');
const NuitState = require('./NuitState');

class StateContext {
  constructor(partieId) {
    this.partieId = partieId
    this.stateEnAttente = new FinJeuState(this)
    this.stateFinJeu = new  EnAttenteState(this)
    this.stateJour = new JourState(this)
    this.stateNuit = new NuitState(this)
    //When the game is create it is place in the wait state
    this.state = this.stateEnAttente;
  }

  setState(state) {
    this.state.endCode();
    this.state = state;
    this.state.SetupCode();
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

module.exports = StateContext