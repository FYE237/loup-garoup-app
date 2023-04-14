const express = require('express')
const router = express.Router()
const token = require('../controllers/token.js')

//Récuperer le token d'un utilisateur
router.get('/getjwtDeleg/:id',token.getToken)

//Vérifier l'identité d'un utilisateur par son token
router.get('/whoami',token.verifieTokenPresent,token.verifieUser,token.whoami)

//Permet de vérifier si le user est l'administrateur par son token
router.get('/checkadmin',token.verifieTokenPresent,token.verifieAdmin,token.whoami)


module.exports = router
