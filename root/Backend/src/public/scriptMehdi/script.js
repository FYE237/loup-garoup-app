

const backend = `http://localhost:3000/`


let socket = io("http://localhost:3000/api/parties/:id")
let id = "644328c78277f46926882a6f";
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
    

    // document.querySelector("input[value='Envoyer']").addEventListener("click",EnvoyerMessage,false)
    // document.querySelector("input[id='partie']").addEventListener("click",rejoindrePartie,false)
}




//On écoute les méssages sur la socket
// socket.on("receive-message",message => {
//     let tmp = document.querySelector("h1")
//     console.log(tmp.textContent)
//     tmp.textContent = message
//     console.log("M2 : " + message)
// })


async function rejoindrePartie(){
        
    //Le joueur rejoint la partie    
    // const  tmp = await fetch(`http://localhost:3000/api/parties/${id}`, {
    //     method : 'POST',
    //     headers: {
    //         "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    //         "x-access-token":"eyJhbGciOiJIUzI1NiJ9.c2FtdWVs.WFiakO3axo2D-NWbm-8RYA7ZTQwE0VonYlkR7cLf8lE"
    //     },
    //             body : "data="+JSON.stringify(objet)
                
    // })
    const myInput = document.getElementById('myInput');
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
        });            
    // console.log("Hello") ; 

    //On déclenche l'évenement rejoindre la partie
    // socket.emit('newPlayerConnect',objet.id_joueur);

    //Le serveur nous repond
    // socket.on("RejoindreJeu",function(data){
    //     let tmp = document.querySelector("h1")
    //     tmp.textContent = data.description
    //     console.log("Jeu OK")
    //     console.log(socket.id)
    // })

}

   

function EnvoyerMessage(event){
    event.preventDefault()
    // console.log("Hello")
    const message1 = document.querySelector("input[id='fo']").value
    console.log(message1)
    socket.emit("send-message",message1)
    document.getElementById("fo").value=""
}


window.addEventListener("load",miseEnplace,false)


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function createGame(){ 
   console.log("creating game");
   const data = {
    heure_debut: "15",
    nb_participant: "5",
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
