const express = require('express');
const router = express.Router();


const partie = require('../controllers/partie');
const token = require('../controllers/token')

// //Liste des joueurs de la partie
// router.get('/api/parties/:id', partie.getPartieById);

//AJouter un joueur à une partie
//Ajouter une vérification pour se rassurer que la partie existe
router.post('/api/parties/:id',token.verifieTokenPresent,token.checkUser, partie.checkIfUserPresent,partie.checkNumberOfPlayer ,partie.addPlayer);

// //Récuperer toutes les parties auxquelles un joueur a participé
// router.get('/api/parties', partie.getUsers);

//Créer une partie
router.post('/api/parties',token.verifieTokenPresent,token.checkUser, partie.newPartie);

// //Annulez une partie
// router.delete('/api/parties/:id', partie.deletePartie);

// //Modifiez les paramètres d'une partie
// router.put('/api/parties', partie.updatePartie);





module.exports = router;