
const {
    MONGO_URL
} = process.env;


const mongoose = require('mongoose');
console.log(MONGO_URL);
mongoose.connect(MONGO_URL,  { useNewUrlParser: true,
                             useUnifiedTopology: true })
                            //  .then(() => console.log('Connexion à MongoDB réussie !'))
                            //  .catch(() => console.log('Connexion à MongoDB échouée !'));


module.exports = mongoose;
