class State {
  constructor(context) {
    this.context = context;
  }

  /**
   * The list aof action that will treated : 
   * Login
   * Chat message
   * Pouvoir special
   * Vote
   * Disconnect
   */
  handleMessage() {
  }

  handleVote() {
  }

  handlePouvoir() {
  }

  //Changes the current game state to jour
  //and sends game state information  to the players 
  setupCode(){

  }

}

module.exports = JourState;
