/**
 * This class will be as the abstract 
 */
class stateGame{
  //The game 
  constructor(partieId) {
    this.partie = partieId;
  }

  handle(req){
    //Using the action type we will call the apprioate method
    return;
  }
  /**
   * The methods will be redined by the methods that use them
   * The action that will be handeled are several:
   * Login
   * Vote
   * PourvoirSpecial
   * Message chat 
   * dissonnect
   */
  handleLogin(){
    //handle a login request 
    return;
  }

  handleVote(){
    //handle a vote request 
  }

  handlePouvoirSpecial(){
    //Handle a pouvoir special
    return;
  }

  handleMessage(){
    //Handle a message sent
    return;
  }

  handleDisconnect(){
    //Handle the disconnect action
    return;
  }


}