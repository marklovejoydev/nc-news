const request = require("supertest");
const app = require("../app");
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const endPoints = require('../endpoints.json')

beforeEach(() => seed(testData));

afterAll(() => {
  return db.end();
});



describe('404 will test for path not found',() =>{
    test('status 404, responds with path not found when passed incorrect path',() =>{
        return request(app)
        .get('/api/notopics')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Sorry this does not exist");
          });
    })
})
describe('GET /api/topics', () => {
    test('status 200, responds with an array of objects with properties',() =>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body})=>{
            const { topics } =body
            expect(topics).toHaveLength(3)
            topics.forEach(topic => {
                expect(topic).toHaveProperty('description', expect.any(String))
                expect(topic).toHaveProperty('slug', expect.any(String))
            });
        })
    })
})
describe('GET /api',() => {
    test('status 200, will return object describing all the available endpoints in the API', () =>{
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body})=>{
            expect(body).toEqual(endPoints)
        })
    })
})