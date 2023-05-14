const express = require('express');
const router = express.Router();


const user = require('../controllers/user.js');
const token = require('../controllers/token.js');


//Récupérer le pseudo d'un utilisateur et son email
router.get('/api/users/:id',token.verifieTokenPresent,token.verifieUser, user.getUserById);

//Liste des tous les utilisateurs
router.get('/api/users', token.verifieTokenPresent,token.verifieAdmin,user.getUsers);

//Créer un compte
router.post('/api/users', user.newUser);

//Supprimer son compte
router.delete('/api/users/:id',token.verifieTokenPresent,token.verifieUser, user.deleteUser);

//Modifiez son pseudo
router.put('/api/users',token.verifieTokenPresent,token.checkUser, user.updateUser);

//Endpoint pour se login
router.post('/api/login', user.login);


//Endpoint pour vérifier si le pseudo que l'utilisateur veut créer est déjà utilisé
router.post('/api/login/:id',user.checkDuplicateUserById)



module.exports = router;
