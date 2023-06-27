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
            expect(body.msg).toBe("Not found");
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
describe('GET /api/articles/:article_id',() => {
    test('status 200, Responds with an article object with properties of requested id', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            const article  = body;
            expect(article).toHaveProperty('article_id', expect.any(Number));
            expect(article).toHaveProperty('title', expect.any(String));
            expect(article).toHaveProperty('topic', expect.any(String));
            expect(article).toHaveProperty('author', expect.any(String));
            expect(article).toHaveProperty('body', expect.any(String));
            expect(article).toHaveProperty('votes', expect.any(Number));
            expect(article).toHaveProperty('article_img_url', expect.any(String));
            expect(article.article_id).toBe(1);
        })
    })
    test('status 400, Responds with an error msg of "Bad request" when passed an endpoint that is invalid', () => {
        return request(app)
        .get('/api/articles/frogs')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request");
        })
    })
    test('status 404, Responds with an error msg of "Not found" when passed an ID that can not be found', () => {
        return request(app)
        .get('/api/articles/20')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not found");
        })
    })

})
describe('GET /api/articles', () => {
    test('status 200, will return an array of articles containing the correct properties ', ()=> {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            const { articles } = body
            const regEx = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/g
            expect(articles).toHaveLength(13)
            articles.forEach((article) => {
                expect(article).toHaveProperty('author', expect.any(String));
                expect(article).toHaveProperty('title', expect.any(String));
                expect(article).toHaveProperty('article_id', expect.any(Number));
                expect(article).toHaveProperty('topic', expect.any(String));
                expect(article).toHaveProperty('created_at', expect.stringMatching(regEx));
                expect(article).toHaveProperty('votes', expect.any(Number));
                expect(article).toHaveProperty('article_img_url',expect.any(String));
                expect(article).toHaveProperty('comment_count', expect.any(String));
                expect(article).not.toHaveProperty('body');
              });
            })
    })
    test('200, will return the array sorted by created_at', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            const { articles } = body
            expect(articles).toBeSortedBy('created_at', { descending: true })
        })
    })
})