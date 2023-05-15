const request = require('supertest');
const app = require('../app');
const server = require('../server')
const io = require('socket.io-client');



require('mandatoryenv').load([
    'token',
    'adminToken',
    'PORT'
]);

const {token,adminToken,PORT} = process.env

const partie = {
    data:{
      "heure_debut": 20,
      "nb_participant": 3,
      "hote_name": "admin",
      "duree_jour": 10,
      "duree_nuit": 14,
      "proba_pouvoir_speciaux": 1,
      "proportion_loup": 0.3
    }
}

let id_partie

let clientSocket;


beforeAll(() => {
  /* Socket player 1 */
  clientSocket = io(`http://localhost:${PORT}/api/parties/:id`)
  
    /* Socket player 2 */
  clientSocket2 = io(`http://localhost:${PORT}/api/parties/:id`)

})


afterAll(()=> {
  clientSocket.disconnect()
  clientSocket2.disconnect()
})

/**
 * Test the POST on the endpoint /api/parties
 */
describe('POST /api/parties', () => {
    /**
     * We create a partie
     */
    test('should Passed : Create a new game && POST 02 players', async () => {
  
      const response = await request(app)
      .post('/api/parties')
      .set('x-access-token',adminToken)
      .send('data=' + encodeURIComponent(JSON.stringify(partie.data)) )
      expect(response.status).toBe(200);
      expect(response.body.message).toEqual("Game was created");
      expect(response.body.status).toEqual(true);
      id_partie = response.body.data.game_id


      //Player 2 is added to the game
      const response2 = await request(app)
      .post(`/api/parties/${id_partie}`)
      .set('x-access-token',token)
      expect(response2.status).toBe(200);
      expect(response2.body.message).toEqual("Player added to the party");
      expect(response2.body.status).toEqual(true);

    });


    test('should passed: connect players to game socket', async()=>{
        
     
      //We connect the user sockets to the game socket
      clientSocket.emit('rejoindre-jeu',
            {
              pseudo : 'admin' ,
              id_partie : id_partie
            }  
        )

      clientSocket2.emit('rejoindre-jeu',
            {
              pseudo : 'emmanuel' ,
              id_partie : id_partie
            }  
        )
            
      //We wait for the handshake from sockets  

      const promise1 = new Promise((resolve) => {
        clientSocket.on('status-game', (data) => {
          expect(data.message).toBeDefined();
          expect(data.partieId).toEqual(id_partie);
          expect(data.status).toBeDefined();
          expect(data.nb_players_actuel).toBeDefined();
          expect(data.nb_participant_souhaite).toEqual(3);
          expect(data.temps_restant).toBeDefined();
          resolve();
        });
      });


      const promise2 = new Promise((resolve) => {
        clientSocket2.on('status-game', (data2) => {
          expect(data2.message).toBeDefined();
          expect(data2.partieId).toEqual(id_partie);
          expect(data2.status).toBeDefined();
          expect(data2.nb_players_actuel).toBeDefined();
          expect(data2.nb_participant_souhaite).toEqual(3);
          expect(data2.temps_restant).toBeDefined();
          resolve();
        });
      });
      
      
      await Promise.all([promise1, promise2]);

    })
  })



  
