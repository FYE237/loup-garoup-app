const GameState = require('./gameState');

class FinJeuState extends GameState {
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
  handleMessage() {
  }

  handleDisconnect() {
  }
}

module.exports = FinJeuState;