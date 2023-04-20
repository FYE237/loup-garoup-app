const GameState = require("./gameState");

class NuitState extends GameState {
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

  handleMessage() {
  }

  handleVote() {
  }

  handlePouvoir() {
  }

  handleDisconnect() {
  }
}

module.exports = NuitState;

