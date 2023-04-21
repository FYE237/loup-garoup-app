
// let socket = io("https://loup-garoup-app.onrender.com/api/login")


const backend = `http://localhost:3000/`

let socket = io("http://localhost:3000/api/parties/:id")

const id = "64426685fe56ce96a99977e0"

const objet = {
    'id_joueur':"samuel"
}


// socket.on("connect",message => {
//     // console.log("Connecté")
//     const tmp = document.createElement("h2")
//     document.body.appendChild(tmp)
//     tmp.textContent="CONNECTE"

// })

const params = new URLSearchParams({id})

function miseEnplace(){

    document.querySelector("input[value='Envoyer']").addEventListener("click",EnvoyerMessage,false)
    document.querySelector("input[id='partie']").addEventListener("click",rejoindrePartie,false)
    
}


//On écoute les méssages sur la socket
socket.on("receive-message",message => {
    let tmp = document.querySelector("h1")
    console.log(tmp.textContent)
    tmp.textContent = message
    console.log("M2 : " + message)
})


async function rejoindrePartie(){
        
    //Le joueur rejoint la partie    
    const  tmp = await fetch(`http://localhost:3000/api/parties/${id}`, {
        method : 'POST',
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-access-token":"eyJhbGciOiJIUzI1NiJ9.c2FtdWVs.WFiakO3axo2D-NWbm-8RYA7ZTQwE0VonYlkR7cLf8lE"
        },
                body : "data="+JSON.stringify(objet)
                
    })

        console.log(tmp)
        if(tmp.status === 200 )
        {
            console.log("Hello") ; 

            //On déclenche l'évenement rejoindre la partie
            socket.emit('newPlayerConnect',objet.id_joueur);

            //Le serveur nous repond
            socket.on("RejoindreJeu",function(data){
                let tmp = document.querySelector("h1")
                tmp.textContent = data.description
                console.log("Jeu OK")
                console.log(socket.id)
            })
        }

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

