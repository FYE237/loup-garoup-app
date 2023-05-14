const request = require('supertest');
const app = require('../app');
const user = require('../controllers/user');

require('mandatoryenv').load([
    'token',
    'adminToken'
]);

const {token,adminToken} = process.env

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

/**
 * Test the POST on the endpoint /api/parties
 */
describe('POST /api/parties', () => {
    /**
     * We create a partie
     */
    test('should Passed : Create a new partie', async () => {
  
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
describe('POST /api/parties', () => {
    /**
     * We test the first middleware
     */
    test('should Passed : 01 players joins the partie', async () => {
  
      const response = await request(app)
      .post(`/api/parties/${id_partie}`)
      .set('x-access-token',token)
      expect(response.status).toBe(200);
      expect(response.body.message).toEqual("Player added to the party");
      expect(response.body.status).toEqual(true);
    });
  })