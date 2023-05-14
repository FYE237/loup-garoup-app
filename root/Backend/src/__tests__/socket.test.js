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
        "heure_debut": "20",
        "nb_participant": "5",
        "hote_name": "admin",
        "duree_jour": "10",
        "duree_nuit": "15",
        "proba_pouvoir_speciaux": "1",
        "proportion_loup": "0.3"
    }
}

let id_partie

let clientSocket;


beforeAll(() => {
  clientSocket = io(`http://localhost:${PORT}/api/parties/:id`)
})


afterAll(()=> {
  clientSocket.disconnect()
})

/**
 * Test the POST on the endpoint /api/parties
 */
describe('POST /api/parties', () => {
    /**
     * We create a partie
     */
    test('should Passed : Create a new game', async () => {
  
      const response = await request(app)
      .post('/api/parties')
      .set('x-access-token',adminToken)
      .send('data=' + encodeURIComponent(JSON.stringify(partie.data)) )
      expect(response.status).toBe(200);
      expect(response.body.message).toEqual("Game was created");
      expect(response.body.status).toEqual(true);
      id_partie = response.body.data.game_id
    });


    test('should passed: This player joins the game-socket', async()=>{
        clientSocket.emit('rejoindre-jeu',
            {
              pseudo : 'admin' ,
              id_partie : id_partie
            }  
        )

        clientSocket.on('status-game', (data)=>{
            expect(data.message).toBeDefined()
            expect(data.partieId).toBeDefined().toEqual(id_partie)
            expect(data.status).toBeDefined()
            expect(data.nb_players_actuel).toBeDefined()
            expect(data.nb_participant_souhaite).toBeDefined().toEqual(5)
            expect(data.temps_restant).toBeDefined()

        })
    })
  })



  
  /**
 * Test the POST on the endpoint /api/parties
 */
describe('POST /api/parties', () => {
    /**
     * We test the first middleware
     */
    test('should Passed : 01 players joins the game', async () => {
  
      const response = await request(app)
      .post(`/api/parties/${id_partie}`)
      .set('x-access-token',token)
      expect(response.status).toBe(200);
      expect(response.body.message).toEqual("Player added to the party");
      expect(response.body.status).toEqual(true);
    });

    test('should passed: This player joins the game-socket', async()=>{
      clientSocket.emit('rejoindre-jeu',
          {
            pseudo : 'emmanuel' ,
            id_partie : id_partie
          }  
      )

      clientSocket.on('status-game', (data)=>{
          expect(data.message).toBeDefined()
          expect(data.partieId).toBeDefined().toEqual(id_partie)
          expect(data.status).toBeDefined()
          expect(data.nb_players_actuel).toBeDefined()
          expect(data.nb_participant_souhaite).toBeDefined().toEqual(5)
          expect(data.temps_restant).toBeDefined()
      })
  })

  })