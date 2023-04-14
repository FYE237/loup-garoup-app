const router = require('express').Router();


// Users routes

//router.use(require('@routes/user'));
router.use(require('./user'));

//Parties routes
router.use(require('./partie'));

//Token routes
router.use(require('./token'))


module.exports = router;