
const {
    MONGO_URL
} = process.env;


const mongoose = require('mongoose');

mongoose.connect(MONGO_URL,  { useNewUrlParser: true,
                             useUnifiedTopology: true })
                            //  .then(() => console.log('Connexion à MongoDB réussie !'))
                            //  .catch(() => console.log('Connexion à MongoDB échouée !'));


module.exports = mongoose;
