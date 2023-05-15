
require('mandatoryenv').load([
    'MONGO_URL',
    'TEST_DB'
]);

const {
    MONGO_URL,
    TEST_DB
} = process.env;




const mongoose = require('mongoose');

//Database url depends if we are in test environnement or prod-environnement
url =   process.env.NODE_ENV === 'test' ? TEST_DB : MONGO_URL;
mongoose.connect(url,  { useNewUrlParser: true,
                             useUnifiedTopology: true })
                            .then(() => console.log('Connexion à MongoDB réussie !'))
                            .catch(() => console.log('Connexion à MongoDB échouée !'));


module.exports = mongoose;
