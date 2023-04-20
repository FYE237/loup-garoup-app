// Load .env Enviroment Variables to process.env

require('mandatoryenv').load([
    'MONGO_URL',
    'PORT',
    'SECRET'
]);

const { PORT } = process.env;
// const {hostname} = '130.190.21.189'

const app = require ("./app")

//Cors
const cors = require('cors');
const corsOptions = {
    origin: '*'
  };

// Socket io
const socket = require("socket.io")

// Open Server on selected Port
const server = app.listen(
        PORT, 
        () => console.info('Server listening on port ', PORT)
    );

//We create socket connection
const io = socket(server,{
    cors:{
        corsOptions
    }
})

let client = 0 , n =0

//Change this to set to the correct endpoint of the game
var nsp = io.of("/api/login")

// io.use(cors(corsOptions))

nsp.on('connection', (socket) => {
    client++;
    console.log('New Socket connection id : ' + socket.id)
    socket.emit('newPlayerConnect',{ description: client +  'Hey, welcome!'});

    socket.on("send-message",message => {
        console.log("send:"+message)
        socket.broadcast.emit('receive-message',message)
        
        // console.log("message " + client  + message)
    })


})

// module.exports = {io,server}


