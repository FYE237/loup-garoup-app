// const Joueur_partie_role = require('../models/joueur_partie_role')

const GameState = require("./gameState");

import { ROLE } from "./constants";

class EnAttenteState extends GameState {
  constructor(context) {
    super(context);
  }

  /**
   * The list aof action that will treated in the wait state :
   * Login
   * Disconnect
   */
  async handleRejoindreJeu(socket, pseudo, socket_id) {
    const player_id = this.getPlayerId(pseudo);
    const res = await Joueur_partie_role.updateOne(
      { id_joueur: player_id, id_partie: this.context.partieId },
      { socket_id: socket_id }
    );
    addPlayerIntoContext(pseudo);
    if (nb_actif_players == this.context.nbParticipantSouhaite) {
      this.launchGame();
    }
  }

  addPlayerIntoContext(pseudo) {
    //Players can only be added if the game is in the wait state
    this.context.nb_actif_players++;
    if (this.context.pseudoList.includes(pseudo)) {
      this.context.pseudoList.push(pseudo);
    }
  }

  removePlayerFromContext(pseudo) {
    this.context.nb_actif_players--;
    this.context.pseudoList = this.context.pseudoList.filter(
      (value) => value !== pseudo
    );
  }

  async handleDisconnect(id_joueur, socket_id) {
    //The pseudo of the player will be extract from the sockeid
    const pseudo = await getPlayerPseudo(id_joueur);
    removePlayerFromContext(pseudo);
    await Joueur_partie_role.deleteOne({ socket_id: socket_id });
  }

  //Will be called when we start the game, it will be used
  //Roles will attributed at this level
  endCode() {
    if (this.context != this.context.EnAttenteState) {
      return;
    }

    // computing of the number of wolves in the game
    const wolvesNumber = Math.ceil(
      this.context.nb_actif_players * this.context.proportion_loup
    );

    // checking if we should have special powers depending on the probability entered by the user
    const shouldSpecialPowerExist =
      this.context.probaPouvoirSpeciaux > 0 ? true : false;

    // function to generate numbers between min and max
    const generateNumber = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const shouldHaveSpecialPower = (specialPowerProbability) => {
      // Perform a Bernoulli test with the specified probability
      const willHaveSpecialPower = Math.random() < specialPowerProbability;

      // return true or false depending on if the user should have special power or not
      return willHaveSpecialPower ? true : false;
    };

    let wolvesList = [];
    // getting randomly the wolves of the game
    for (let i = 0; i < wolvesNumber; i++) {
      wolvesList.push(generateNumber(0, this.context.nb_actif_players - 1));
    }

    let powerInd = -1;

    // assigning special powers if they should to some wolves
    const assignedWolvesRoles = wolvesList.map((playerIndice) => {
      if (shouldHaveSpecialPower(this.context.probaPouvoirSpeciaux)) {
        powerInd += 1;
        return {
          indice: playerIndice,
          role: ROLE.speciauxLoup[powerInd % ROLE.speciauxLoup.length],
        };
      } else {
        return { indice: playerIndice, role: ROLE.loupGarou };
      }
    });

    // create an array containing all the indices
    const indices = Array.from(
      { length: this.context.nb_actif_players - 1 },
      (_, i) => 0 + i
    );

    // filter the ones that are wolves
    const humanList = indices.filter((ind) => !wolvesList.includes(ind));

    // assigning special powers if they should to some humans
    const assignedHumansRoles = humanList.map((playerIndice) => {
      if (shouldHaveSpecialPower(this.context.probaPouvoirSpeciaux)) {
        powerInd += 1;
        return {
          indice: playerIndice,
          role: ROLE.speciauxHumain[powerInd % ROLE.speciauxHumain.length],
        };
      } else {
        return { indice: playerIndice, role: ROLE.villageois };
      }
    });

    // Adding now the roles to the database
  }

  startGameTimer() {
    //Il faut vérifier que le nombre de jour connecté
    //est supérieur ou égal à une valeur sépcifique
    console.log("hello from timer");
    //We check if the game started
    if (this.context != this.context.EnAttenteState) {
      return;
    }
    this.launchGame();
  }

  launchGame() {
    if (this.context != this.context.EnAttenteState) {
      return;
    }
    this.context.setState(this.context.stateJour);
  }

  /**
   * This function is used to initialize the variable of the
   * context and it start a timer that will the check if it start the game
   */
  async setupCode() {
    await this.context.initAttributs();
    console.log("heure " + this.context.heureDebut);
    setTimeout(this.startGameTimer.bind(this), this.context.heureDebut);
  }
}

module.exports = EnAttenteState;
