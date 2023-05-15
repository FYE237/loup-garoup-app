const express = require('express');
const router = express.Router();


const partie = require('../controllers/partie');
const token = require('../controllers/token')


//AJouter un joueur à une partie
//Ajouter une vérification pour se rassurer que la partie existe
router.post('/api/parties/:id',token.verifieTokenPresent, 
                              token.checkUser,
                              partie.checkIfUserPresent, 
                              partie.checkNumberOfPlayer, 
                              partie.addPlayer);


//Créer une partie
router.post('/api/parties',token.verifieTokenPresent, 
                           token.checkUser,
                           partie.newPartie);


module.exports = router;