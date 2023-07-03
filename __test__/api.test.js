const request= require('supertest');
const app= require('../app');

test('GET /posts should return a list of posts', async () => {
    const response = await request(app).get('/posts');
    // Check the response status code
    expect(response.status).toBe(200);
    // Check the response body or other properties
    expect(response.body).toBeDefined();
    expect(response.body.length).toBeGreaterThan(0);
  });

test('GET /users should return a list of users', async () => {
    const response = await request(app).get('/users');
    // Check the response status code
    expect(response.status).toBe(200);
    // Check the response body or other properties
    expect(response.body).toBeDefined();
    expect(response.body.length).toBeGreaterThan(0);
  });

test('GET /userChat/all should return a list of userChat', async () => {
    const response = await request(app).get('/userChat/all');
    // Check the response status code
    expect(response.status).toBe(200);
    // Check the response body or other properties
    expect(response.body).toBeDefined();
    expect(response.body.length).toBeGreaterThan(0);
  });

test('GET /chatRoom/all should return a list of chatRoom', async () => {
    const response = await request(app).get('/chatRoom/all');
    // Check the response status code
    expect(response.status).toBe(200);
    // Check the response body or other properties
    expect(response.body).toBeDefined();
    expect(response.body.length).toBeGreaterThan(0);
  });

test('GET /message/all should return a list of userChat', async () => {
    const response = await request(app).get('/message/all');
    // Check the response status code
    expect(response.status).toBe(200);
    // Check the response body or other properties
    expect(response.body).toBeDefined();
    expect(response.body.length).toBeGreaterThan(0);
  });


test('POST /users/login should return user info and bearer token', async () => {
    const userData = {
      email: 'guest@gmail.com',
      password: 'password'
    };
    const response = await request(app)
      .post('/users/login')
      .send(userData);
  
    // Check the response status code
    expect(response.status).toBe(200);
  
    // Check the response body or other properties
    expect(response.body).toBeDefined();
    expect(response.body.info).toBeDefined();
    expect(response.body.token).toBeDefined();
  });