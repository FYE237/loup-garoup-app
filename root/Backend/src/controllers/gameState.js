class GameState {
  constructor(context) {
    this.context = context;
  }

  /**
   * Some of these functions will be redefined 
   * by the functions that need them
   * The list of action that will treated : 
   * Login
   * Chat message
   * Pouvoir special
   * Vote
   * Disconnect
   */
  handleRejoindreJeu() {
    return;
  }

  handleMessage() {
    return
  }

  handleVote() {
    return;
  }

  handlePouvoir() {
    return;
  }

  //This function will do some treatement at this level 
  //but it will redifined by the waiting state
  handleDisconnect() {
    return;
  }

  /**
   * Configurations functions 
   * These two functions will be called when the state changes
   * (when it launches and when it leave)
   * for example when we go in the day mode some data will be sent to the players
   * regarding the game status
   */
  setupCode(){

  }

  endCode(){

  }


}

module.exports = GameState;
