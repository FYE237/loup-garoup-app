// Load .env Enviroment Variables to process.env

require('mandatoryenv').load([
    'MONGO_URL',
    'PORT',
    'SECRET'
]);

const { PORT } = process.env;

const app = require ("./app")


// Open Server on selected Port
app.listen(
    PORT,
    () => console.info('Server listening on port ', PORT)
);



