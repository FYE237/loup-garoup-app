const status = require('http-status')
const User = require('../models/user.js')
const has = require('has-keys')
const CodeError = require('../util/CodeError.js')
const bcrypt = require('bcrypt')
const jws = require('jws')
require('mandatoryenv').load(['TOKENSECRET'])
const { TOKENSECRET } = process.env
const debug = require("debug")("TokenController");

function validPassword (password) {
  return /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password)
}

const { SECRET } = process.env

module.exports = {

  async getToken (req, res) {
    // TODO : verify if the user that wants to get All users is an admin (using token...)
    // #swagger.tags = ['Token']
    // #swagger.summary = 'Get User Token'
    // #swagger.parameters['id'] = { in: 'path', description:'id:pseudo of the user to find'}
    
    const data = {token : jws.sign({
      header: { alg: 'HS256' },
      payload: req.params.id,
      secret: TOKENSECRET,
    })}
    res.json({ status: true, message: 'Returning Token', data })
  },


  async verifieTokenPresent(req,res,next) {
    debug("Checking is user token present and its validity");
    // Code vérifiant qu'il y a bien un token dans l'entête
    if (!req.headers || !req.headers.hasOwnProperty('x-access-token')){
      debug("Cannot find x-access-token in the header");
      throw {code: 403, message: 'Token missing'}
    }
    // Code vérifiant la validité du token 
    if (!jws.verify(req.headers['x-access-token'],'HS256',TOKENSECRET)){
      debug("Token is not valid");
      throw {code: 403, message: 'Token invalid'}
    }
    // Le payload du token contient le login de l'utilisateur
    // On modifie l'objet requête pour mettre le login à disposition pour les middleware suivants
    req.login=jws.decode(req.headers['x-access-token']).payload
    // On appelle la fonction middleware suivante :
    next()
  },
   
    //Appélée lorsque le endpoint a un paramètre dans l'url
  async verifieUser(req,res,next){
    // Code vérifiant que le login est celui du bon utilisateur (présent si une fonction middleware
    // a au préalable ajouté le login dans req)
    const {  name } = {name : req.login}
    const data = await User.findOne({name: name}).select({_id:0,__v:0,password:0,email:0})
    if(!data){ throw new CodeError('User not found', status.NOT_FOUND)}
    if (data.name!=req.login ){
      // Provoque une réponse en erreur avec un code de retour 403 
      throw {code: 403, message: 'Forbidden'}
    }
    // On appelle la fonction middleware suivante que si la condition est vérifiée
    next()
  },


  //Appélée lorsque le endpoint n'a pas de paramètres dans l'url ou si /:id est l'id de la partie
  async checkUser(req,res,next){
     // Code vérifiant que le login est celui du bon utilisateur (présent si une fonction middleware
    // a au préalable ajouté le login dans req)
    debug("Checking if the user is present in the database");
    debug("user name = " + req.login);
    const { name } = {name : req.login}
    const data = await User.findOne({name: name}).select({_id:1,__v:0,password:0,email:0})
    
    if(!data){
      debug("User was not found in the database");
      throw new CodeError('User not found', status.NOT_FOUND)
    }

    let tmp = {};
    try{
      if (req.body) {tmp = JSON.parse(req.body.data)};
    }
    catch(err){
      debug("Caught an error while extracting body, err = " + err)
    }
    /*On vérifie que le token correspond à l'utilisateur qu'on veut modifier 
      ou à l'utilisateur qui veur créer la partie ou l'utilisateur qui veut rejoindre la partie.
    */
    if ((tmp.prev && data.name != tmp.prev)) {  
     // Provoque une réponse en erreur avec un code de retour 403 
      throw {code: 403, message: 'User name and user token do not match'}
    }
        
    // On appelle la fonction middleware suivante que si la condition est vérifiée
    debug("User is in the database");
    next()
  },

  async verifieAdmin(req,res,next){
    // Code vérifiant que le login est admin (présent si une fonction middleware
    // a au préalable ajouté le login dans req)

    const {  name } = {name : req.login}
    const data = await User.findOne({name:name}).select({_id:0,__v:0,password:0,email:0})

    if(!data) throw new CodeError('User not found', status.NOT_FOUND)

    if (data.name!='admin')
      // Provoque une réponse en erreur avec un code de retour 403 
      throw {code: 403, message: 'Forbidden'}
    // On appelle la fonction middleware suivante que si la condition est vérifiée
    next()
  },


  async whoami(req,res){
    // #swagger.tags = ['Who am I']
    // #swagger.summary = 'Get User login'
    // #swagger.parameters['id'] = { in: 'path', description:'id:pseudo of the user to find'}
    const  data  =  req.login
    res.json({  data })
  }


}
