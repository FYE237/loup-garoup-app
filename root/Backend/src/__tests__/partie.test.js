const request = require('supertest');
const app = require('../app');
const user = require('../controllers/user');

require('mandatoryenv').load([
    'token',
    'adminToken'
]);

const {token,adminToken} = process.env

const partie = {
   uncorrectData1:{
    "heure_debut": 20,
    "nb_participant": 5,
    "hote_name": "admin",
    "duree_jour": 10,
    "duree_nuit": 15,
    "proba_pouvoir_speciaux": 1,
    "proportion_loup": 0.3
   },

   uncorrectData2:{
    "heure_debut": 20,
    "nb_participant": 30,
    "hote_name": "admin",
    "duree_jour": 10,
    "duree_nuit": 14,
    "proba_pouvoir_speciaux": 1,
    "proportion_loup": 0.3
   },

   uncorrectData3:{
    "heure_debut": -2,
    "nb_participant": 30,
    "hote_name": "admin",
    "duree_jour": 10,
    "duree_nuit": 14,
    "proba_pouvoir_speciaux": 1,
    "proportion_loup": 0.3
   },

    data:{
        "heure_debut": 20,
        "nb_participant": 5,
        "hote_name": "admin",
        "duree_jour": 10,
        "duree_nuit": 14,
        "proba_pouvoir_speciaux": 1,
        "proportion_loup": 0.3
    }
}

let id_partie

/**
 * Test the POST on the endpoint /api/parties
 */
describe('POST /api/parties  - failed', () => {

   /**
     * We didn't respect the constrait day-time + night-time <=24
     */
   test('should Failed : bad value day time / night time', async () => {
  
    const response = await request(app)
    .post('/api/parties')
    .set('x-access-token',adminToken)
    .send('data=' + encodeURIComponent(JSON.stringify(partie.uncorrectData1)) )
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("La somme des heures doit être égal à 24 et duree jour et nuit doit être entre 1 et 23");
    expect(response.body.status).toEqual(false);
  });

  /**
     * We didn't respect the constrait 1 <= nb_participant <= 20
     */
  test('should Failed : bad value nb_participants', async () => {
  
    const response = await request(app)
    .post('/api/parties')
    .set('x-access-token',adminToken)
    .send('data=' + encodeURIComponent(JSON.stringify(partie.uncorrectData2)) )
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Le nombre de participant doit être entre 1 et 20");
    expect(response.body.status).toEqual(false);
  });

  /**
     * We didn't respect the constrait  heure debut >0
     */
  test('should Failed : bad value heure debut', async () => {
  
    const response = await request(app)
    .post('/api/parties')
    .set('x-access-token',adminToken)
    .send('data=' + encodeURIComponent(JSON.stringify(partie.uncorrectData3)) )
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Heure de debut doit être positif");
    expect(response.body.status).toEqual(false);
  });

})

    /**
     * We create a game
     */
    describe('POST /api/parties  - Good', () => {
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
      })
    

  /**
 * Test the POST on the endpoint /api/parties
 */
describe('POST /api/parties/:id', () => {
    /**
     * We add a player to the game
     */
    test('should Passed : 01 players joins the game', async () => {
  
      const response = await request(app)
      .post(`/api/parties/${id_partie}`)
      .set('x-access-token',token)
      expect(response.status).toBe(200);
      expect(response.body.message).toEqual("Player added to the party");
      expect(response.body.status).toEqual(true);
    });
  })