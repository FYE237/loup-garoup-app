

const backend = `http://localhost:3000/`


let socket = io("http://localhost:3000/api/parties/:id")
let id = "644328c78277f46926882a6f";
let chatid = null;
const objet = {
    'id_joueur':"samuel"
}
const createGameBtn = null;

// Get the button element

// Add a click event listener to the button




const params = new URLSearchParams({id})

async function miseEnplace(event){
    event.preventDefault(); // prevent page reload
    const createGameBtn = document.getElementById('create-game-btn');
    createGameBtn.addEventListener('click', async (event) => {
        event.preventDefault(); // prevent page reload
        // Call the createGame() function
        id = await createGame();
      
        // Do something with the returned game ID
        console.log(`Game created with ID: ${id}`);
      });
    const joinGamebtn = document.getElementById('rejoindre-game-btn');
    joinGamebtn.addEventListener('click', async (event) => {
        event.preventDefault(); // prevent page reload
        // Call the createGame() function
        await rejoindrePartie();
    });

    const sendMessageButton = document.getElementById('envoyer-message-button');
    sendMessageButton.addEventListener('click', async (event) => {
        event.preventDefault(); // prevent page reload
        // Call the createGame() function
        await sendMessage();
    });

}



async function sendMessage(){
    
    const myInput = document.getElementById('myInputGame');
    const inputValue = myInput.value;

    const messageBox = document.getElementById('message-text');
    const message = messageBox.value;
    
    const roomBox = document.getElementById('room-text');
    const roomValue = roomBox.value;
    



    socket.emit("send-message",message,roomValue)

    document.getElementById('room-text').value=""
    document.getElementById('message-text').value=""
    

}


async function rejoindrePartie(){
        
    const myInput = document.getElementById('myInputGame');
    const inputValue = myInput.value;

    const myInputName = document.getElementById('myInputUsername');
    const inputValueName = myInputName.value;
    console.log(myInputName.value, objet.id_joueur)
    socket.emit('rejoindre-jeu', 
                {pseudo :  getValueTickBox(),
                id_partie : inputValue
                    });

    
    const statusfunc = (data) => {
        console.log(data)
    }
    socket.on('status-game', (data, statusfunc) => {
        // Handle the data received from the server
        console.log('Received game status update:', data);
//        socket.emit('send-message-game', "enakzjelazk,", data.room, getValueTickBox(), inputValue);

        });            
    socket.on('new-message', function(data) {
        console.log('Received new message:', data);
        // do something with the data
        });
    socket.on("player-info", function(data) {
        console.log('Received player info:', data);
        // do something with the data
    });
    socket.on('VoteNuitEnregistré', function(data) {
        console.log("Vote Enregistré" , data)
    });
    socket.on('notif-vote-nuit',function(data) {
        console.log("Notif - new Vote" , data)
    });
    socket.on("send-Player-Data-Voyante" , function(data) {
        console.log("Player data : " , data)
    });
        
    socket.on("send-Player-Data-Contamination" , function(data) {
        console.log("Contamination : " , data)
    });
    socket.on("new-custom-chat" , function(data) {
        console.log("Spiritisme : " , data)
    });
    socket.on("new-message", (data) => {
        // Handle the data received from the server
        console.log('Received a message:', data);
    });


}

   




window.addEventListener("load",miseEnplace,false)


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function createGame(){ 
   console.log("creating game");
   const data = {
    heure_debut: "15",
    nb_participant: "2",
    hote_name: "mehdi",
    duree_jour: "10",
    duree_nuit: "15",
    proba_pouvoir_speciaux: "0.3",
    proportion_loup: "0.3"
  };
  
  const url = 'http://localhost:3000/api/parties';
  
  //Mehdi token
  const token = 'eyJhbGciOiJIUzI1NiJ9.bWVoZGk.rOBx0jXHH9zQU9RIPHK_nuEjqilZsO5W2CKaNPfKSjw';
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-access-token': token
    },
    body: new URLSearchParams({data: JSON.stringify(data)}).toString()
  };
  
    const returnData = await fetch(url, options)
        .then(response => response.text())
        .then(data => {
            console.log(data);
            return 1;            
        })
        .catch(error => {
            console.error('Error:', error);
        });
    console.log("-----")
    return returnData;
}


function getValueTickBox() {
    // Get all checkbox inputs
    const checkboxes = document.querySelectorAll('input[name="person"]');

    // Loop through checkboxes to find the checked one
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            // Get the value of the checked checkbox
            const selectedValue = checkboxes[i].value;
            return selectedValue;
        }
    }
}
