const GameState = require('./gameState');


class EnAttenteState extends GameState {
  constructor(context) {
    super(context)
  }


  /**
   * The list aof action that will treated : 
   * Login
   * Chat message
   * Pouvoir special
   * Vote
   * Disconnect
   */
  handleLogin() {
  
  }

  handleDisconnect() {
  
  }
  
  //Will be called when we start the game, it will be used 
  endCode(){

  }


}

module.exports = EnAttenteState;

