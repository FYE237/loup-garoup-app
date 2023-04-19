class gameContext {
  constructor(state, partieId) {
    this.state = state;
    this.partieId = partieId;
  }

  setState(state) {
    this.state = state;
  }

  //We can multiple handle
  //methods in this case 
  request() {
    return this.state.handle();
  }
}