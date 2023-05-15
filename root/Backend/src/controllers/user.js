const status = require('http-status');

const User = require('../models/user');
const bcrypt = require('bcrypt')
const has = require('has-keys');
const jws = require('jws')

const debug = require('debug')('User');

require('mandatoryenv').load([
    'TOKENSECRET'
]);

const { TOKENSECRET } = process.env;
const CodeError = require("../util/CodeError")


/*
*  Il s'agit des fonctions qui sont appélés lorsqu'on sollicite les endpoints
* des users
*/
module.exports = {
    /**
     * On récupère les informations d'un utilisateur particulier
     * @param {*} req 
     * @param {*} res 
     */
    async getUserById(req, res){
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get a User by its pseudo'
    // #swagger.parameters['id'] = { in: 'path', description:'id:pseudo of the user to find'}

        if(!has(req.params, 'id'))
            throw new CodeError('You must specify the name ', status.BAD_REQUEST)
        
        let id = req.params.id;

        //On specifie les champs qu'on ne souhaite pas récupérer par le findOne
        let data =  await User.findOne({name:id}).select({_id:0,__v:0,password:0})
 
        if(!data)
            throw new CodeError('User not found', status.NOT_FOUND)

        res.json({status: true, message: 'Returning user', data});
    },

    /**
     * On vérifie si un username est 
     * @param {*} req 
     * @param {*} res 
     */
    async checkDuplicateUserById(req, res){
        // #swagger.tags = ['Users']
        // #swagger.summary = 'Check if the pseudo that the user wants to create is already used'
        // #swagger.parameters['id'] = { in: 'path', description:'id:pseudo of the user to find'}
    
            if(!has(req.params, 'id'))
                throw new CodeError('You must specify the name ', status.BAD_REQUEST)
            
            let id = req.params.id;
    
            //On specifie les champs qu'on ne souhaite pas récupérer par le findOne
            let data =  await User.findOne({name:id}).select({name:1})
     
            if(data)
                throw new CodeError('Duplicate user', status.NOT_FOUND)
    
            res.json({status: true, message: 'No User found'});
        },


    /**
     * On récupere tous les utilisateurs
     * @param {*} req 
     * @param {*} res 
     */
    async getUsers(req, res){
    // #swagger.users = ['Users']
    // #swagger.summary = 'get all Users'
        let data = await User.find().select({_id:0,__v:0,password:0});
        res.json({status: true, message: 'Returning users', data});
    },
    

    /**Creation d'un nouvel utilisateur */
    async newUser(req, res){
        // #swagger.tags = ['Users']
        // #swagger.summary = 'New User'
        // #swagger.parameters['obj'] = { in: 'body', description:'name,password ', schema: { $name: 'John Doe' , $password:'xxxx'}}
        const tmp = JSON.parse(req.body.data)
        if(!has(tmp, ['name',  'password']))
            throw  new CodeError('You must specify the name ,and password', status.BAD_REQUEST)
        
        debug("Trying a new account with the pseudo ", tmp.name);
        let { name, password } = tmp
        
        let hashPass = await bcrypt.hash(password,2)
        const user = new User({
            name: name,
            password: hashPass 
        })
        
        user.save()
        .then(() => {
            debug("User created with success")
            res.json({status: true, message: 'User Added'})
        })
        ///.catch(() => {throw  new CodeError('Add failed', status.BAD_REQUEST)})
        .catch((err) => {
            debug("Account creation failed" + err);
            res.status(status.INTERNAL_SERVER_ERROR);
            res.json({status: false, message: 'Add failed'})
          })
    },


    /**
     * Methode appélé pour update le pseudo d'un utilisateur
     * @param {*} req 
     * @param {*} res 
     */
    async updateUser(req, res){
        // #swagger.tags = ['Users']
        // #swagger.summary = 'Update the pseudo of a  User'
        // #swagger.parameters['obj'] = { in: 'body', description:'name:new value of the pseudo,prev:previous value ', schema: { $name: 'vador',$prev:'anakin' }}
        const data = JSON.parse(req.body.data)
        if(!has(data ,['name','prev']))
            throw  new CodeError('You must specify the actual name and previous value ', status.BAD_REQUEST)

        let { prev, name} = data;
    
        await User.updateOne({name:prev},{name});

        //On renvoie le nouveau token 
        const token = jws.sign({ header: { alg: 'HS256' }, payload: name, secret: TOKENSECRET })
        res.json({status: true, message: 'User updated', token});
    },

    /**
     * Methode pour la suppréssion d'un utilisateur
     * @param {*} req 
     * @param {*} res 
     */
    async deleteUser(req, res){
        // #swagger.tags = ['Users']
        // #swagger.summary = 'Delete a user'
        // #swagger.parameters['id'] = { in: 'path', description:'id:the pseudo of the player to delete'}
        if(!has(req.params, 'id'))
             throw  new CodeError('You must specify the name of the user', status.BAD_REQUEST)

        let { id } = req.params;

        await User.deleteOne({name:id});

        res.json({status: true, message: 'User deleted'});
    },

    /**
     * Méthode qui permet de login un utilisateur. 
     * Elle renvoie un token à l'utilisateur.
     * @param {*} req 
     * @param {token: Il s'agit tu token utilisateur} res 
     */
    async login(req,res){
        // #swagger.tags = ['Users']
        // #swagger.summary = 'Verify credentials of user using name and password and return token'
        // #swagger.parameters['obj'] = { in: 'body', description: 'name , password' , schema: { $name: 'John Doe', $password: '12345'}}
        
        const data = JSON.parse(req.body.data)
        if (!has(data, ['name', 'password'])) throw new CodeError('You must specify the name and password', status.BAD_REQUEST)
        const { name, password } = data
        debug(name + "is trying to login")
        const user = await User.findOne({ name }).select({_id:0,__v:0,name:0})
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                const token = jws.sign({ header: { alg: 'HS256' }, payload: name, secret: TOKENSECRET })
                res.json({ status: true, message: 'Login/Password ok', token })
                return
            }
        }
        res.status(status.FORBIDDEN).json({ status: false, message: 'Wrong login/password' })
    }
}
