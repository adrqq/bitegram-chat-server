const request = require('supertest');
const app = require('./app');

describe('Test the root path', () => {
  test('It should response the GET method', async () => {
    return request(app)
      .get('/')
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });
});

describe('Test the /user/search path', () => {
  test('It should response the GET method with empty body', async () => {
    return request(app)
      .get('/user/search')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
      });
  });

  test('It should return empty arrray if searchQuery is less than 3 characters', async () => {
    return request(app)
      .get('/user/search?searchQuery=ab')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
      });
  });

  test('It should return user if match is 100%', async () => {
    return request(app)
      .get('/user/search?searchQuery=adrqq')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([
          {
            nickname: 'adrqq',
            id: '6f704b19-d499-4da5-959a-192e8b5a648b',
          },
        ]);
      });
  });
});
