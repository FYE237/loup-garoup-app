const request = require('supertest');
const app = require('../app');
const user = require('../controllers/user');

require('mandatoryenv').load([
    'adminToken',
    'vadortoken',
    'johntoken',
    'token'
]);

const {adminToken,johntoken,vadortoken,token} = process.env



const  payload={
  data: {
    name: 'john' ,
    password:'ssfkdfjkkldslf'
  }
}

const updates={
  data:{
    prev: "john"  ,
    name: "vador"
  }
}

const login={
  data:{
    name:"emmanuel" ,
    password:"123456" 
  }
}

/**
 * Tests the GET on the endpoint /api/users
 */
describe('GET /api/users', () => {
  /**
   * We test the first middleware
   */
  test('should Failed : TOKEN MISSING', async () => {

    const response = await request(app).get('/api/users');

    expect(response.status).toBe(403);
    expect(response.body.message).toEqual("Token missing");
    expect(response.body.status).toEqual(false);
  });

  /**
   * We check the second middleware
   */
  test('should Failed : NOT ADMIN', async () => {

    const response = await request(app).get('/api/users')
        .set('x-access-token',token);

    expect(response.status).toBe(403);
    expect(response.body.message).toEqual("Forbidden");
    expect(response.body.status).toEqual(false);
  });

  /**
   * Finally we check the getUsers 
   */
  test('should Passed : ADMIN gets the list of users', async () => {

    const response = await request(app)
    .get('/api/users')
    .set("x-access-token", adminToken)

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Returning users");
    expect(response.body.status).toEqual(true);
  });

});

/**
 * Test the POST on the endpoint /api/users
 */
describe('POST /api/users', () => {
  /**
   * We test the first middleware
   */
  test('should Passed : Add a new User to the database', async () => {

    const response = await request(app)
    .post('/api/users')
    .send('data=' + encodeURIComponent(JSON.stringify(payload.data)) )
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("User Added");
    expect(response.body.status).toEqual(true);
  });
})


/**
 * Test the GET on the endpoint /api/users/:id
 */
describe('GET /api/users/:id', () => {
  /**
   * We test the first middleware
   */
  test('should Passed : Get  User\'s infos in the database', async () => {

    const response = await request(app)
    .get('/api/users/john')
    .set('x-access-token',johntoken)
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Returning user");
    expect(response.body.status).toEqual(true);
  });
})

/**
 * Test the PUT on the endpoint /api/users
 */
describe('PUT /api/users', () => {
  /**
   * We test if updateUser works
   */
  test('should Passed : Update a  User in the database', async () => {

    const response = await request(app)
    .put('/api/users')
    .set('x-access-token',johntoken)
    .send('data=' + encodeURIComponent(JSON.stringify(updates.data)) )
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("User updated");
    expect(response.body.status).toEqual(true);
  });
})

/**
 * Test the DELETE on the endpoint /api/users
 */
describe('PUT /api/users/:id', () => {
  /**
   * We test if updateUser works
   */
  test('should Passed : Update a  User in the database', async () => {

    const response = await request(app)
    .delete('/api/users/vador')
    .set('x-access-token',vadortoken)
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("User deleted");
    expect(response.body.status).toEqual(true);
  });
})

/**
 * Test the POSTon the endpoint /api/login
 */
describe('POST /api/login', () => {
  /**
   * We test if updateUser works
   */
  test('should Passed : Login a User in the app', async () => {

    const response = await request(app)
    .post('/api/login')
    .set('x-access-token',token)
    .send('data=' + encodeURIComponent(JSON.stringify(login.data)) )
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Login/Password ok");
    expect(response.body.status).toEqual(true);
  });
})












