class StateContext {
  constructor(partieId) {
    this.partieId = partieId
    this.stateEnAttente = new 
    this.stateFinJeu = new  
    this.stateJour = new 
    this.stateNuit = new     
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