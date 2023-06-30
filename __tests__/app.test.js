const request = require("supertest");
const app = require("../app");
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const endPoints = require('../endpoints.json')
const jestSorted = require("jest-sorted");

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
                expect(article).toHaveProperty('comment_count', expect.any(Number));
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
describe('GET /api/articles/:article_id/comments',() =>{
    test('200, checks if id exists before returning an array of comments related to the requested id', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            const comments = body
            const regEx = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/g
            expect(comments).toHaveLength(11)
            comments.forEach((comment) => {
                expect(comment).toHaveProperty('comment_id', expect.any(Number))
                expect(comment).toHaveProperty('votes', expect.any(Number))
                expect(comment).toHaveProperty('created_at', expect.stringMatching(regEx))
                expect(comment).toHaveProperty('author', expect.any(String))
                expect(comment).toHaveProperty('body', expect.any(String))
                expect(comment).toHaveProperty('article_id', expect.any(Number))  
            })
        })
    })
    test('status 200, responds with an empty array when the id is valid but there is no comments', () => {
        return request(app)
        .get('/api/articles/7/comments')
        .expect(200)
        .then(({body}) => {
            const comments = body
            expect(comments).toHaveLength(0)
            expect(comments).toEqual([])
            })
        
    })
    test('status 400, Responds with an error msg of "Bad request" when passed an endpoint that is invalid', () => {
        return request(app)
        .get('/api/articles/frog')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request");
        })
    })
    test('status 404, Responds with an error msg of "Not found" when passed an ID that can not be found', () => {
        return request(app)
        .get('/api/articles/20/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not found");
        })
    })
})
describe('POST /api/articles/:article_id/comments', () => {
    test("status:201, should add a comment to the database", () => {
      const newComment = {
        username : "butter_bridge",
        body : "I have no idea what is going on anymore"
      }
        return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
            const postComment = body
            expect(postComment.author).toBe("butter_bridge")
            expect(postComment.body).toBe('I have no idea what is going on anymore')
        })
    })
    test("status:201, should add only the comments allowed to the database and respond with the only allowed objects", () => {
        const newComment = {
          username : "butter_bridge",
          body : "I have no idea what is going on anymore",
          read_value : "Very Good"
        }
          return request(app)
          .post("/api/articles/2/comments")
          .send(newComment)
          .expect(201)
          .then(({ body }) => {
              const postComment = body
              expect(postComment.author).toBe("butter_bridge")
              expect(postComment.body).toBe('I have no idea what is going on anymore')
              expect(postComment.read_value).not.toBe('Very Good')
              expect(postComment).not.toHaveProperty("read_value")
          })
      })
    test("status 404, will return a 404 when trying to comment to an article that does not exist", () => {
        return request(app)
        .post('/api/articles/20/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not found");
        })
    })
    test('status 400, Responds with an error msg of "Bad request" when passed an endpoint that is invalid', () => {
        return request(app)
        .post('/api/articles/frog/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request");
        })
    })
    test('status 400, Responds with an error msg of "Bad request" when passed without a body', () => {
        const newComment = {
            username : "butter_bridge",
        }
        return request(app)
        .post('/api/articles/2/comments')
        .expect(400)
        .send(newComment)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request");
        })
    })
    test('status 400, Responds with an error msg of "Bad request" when passed without a username', () => {
        const newComment = {
            body : "butter_bridge",
        }
        return request(app)
        .post('/api/articles/2/comments')
        .expect(400)
        .send(newComment)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request");
        })
    })
});
describe('PATCH /api/articles/:article_id', () => {
    test('status:200, should update the article votes property with the amount passed', () => {
      const votes = { inc_votes : 10 }
      return request(app)
      .patch('/api/articles/1')
      .send(votes)
      .expect(200)
      .then(({body}) => {
        const article = body
        const regEx = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/g
                expect(article).toHaveProperty('article_id', expect.any(Number))
                expect(article).toHaveProperty('title', expect.any(String))
                expect(article).toHaveProperty('topic', expect.any(String))
                expect(article).toHaveProperty('author', expect.any(String))
                expect(article).toHaveProperty('body', expect.any(String))
                expect(article).toHaveProperty('created_at', expect.stringMatching(regEx))
                expect(article).toHaveProperty('votes', expect.any(Number))
                expect(article).toHaveProperty('article_img_url', expect.any(String))
        })
      })
      test("status 200: if passed more than the required property only includes the correct property and ignores the incorrect one", () => {
        const votes = { inc_votes: 10, moral: "whats that?" };
        return request(app)
            .patch("/api/articles/9")
            .send(votes)
            .expect(200)
            .then(({ body }) => {
                const article = body
        const regEx = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/g
                expect(article).toHaveProperty('article_id', expect.any(Number))
                expect(article).toHaveProperty('title', expect.any(String))
                expect(article).toHaveProperty('topic', expect.any(String))
                expect(article).toHaveProperty('author', expect.any(String))
                expect(article).toHaveProperty('body', expect.any(String))
                expect(article).toHaveProperty('created_at', expect.stringMatching(regEx))
                expect(article).toHaveProperty('votes', expect.any(Number))
                expect(article).toHaveProperty('article_img_url', expect.any(String))
        })
      })
      test("status 404: should respond with 'Not found' when the id does not exist", () => {
        const votes = { inc_votes: 10 };
        return request(app)
            .patch("/api/articles/20")
            .send(votes)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
    });
    test("status 400: should return an error 'Bad request' when passed an invalid data type", () => {
        const votes = { inc_votes: "flamingo" };
        return request(app)
            .patch("/api/articles/3")
            .send(votes)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            })
    })
    test("status 400: should return an error 'Bad request' when passed a bad endpoint", () => {
        const votes = { inc_votes: 10 };
        return request(app)
            .patch("/api/articles/toads")
            .send(votes)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
        })
})
describe('DELETE /api/comments/:comment_id', () => {
    test('status:204, when passed a comment_id should delete that comment and respond with no content', () => {
      return request(app)
      .delete('/api/comments/5')
      .expect(204)
    })
    test('status:404, when passed a comment_id thats does not exist, should should return 404 msg Not found', () => {
      return request(app)
      .delete('/api/comments/20')
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe('Not found')
      })
    })
    test('status:400, when passed a comment_id thats not valid, should should return 400 msg Bad request', () => {
      return request(app)
      .delete('/api/comments/flamingo')
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('Bad request')
      })
    })
  })
  describe('GET /api/users', () => {
    test('status 200, will return an array of objects containing the correct properties ', ()=> {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
            const { users } = body
            expect(users).toHaveLength(4)
            users.forEach((user) => {
                expect(user).toHaveProperty('username', expect.any(String));
                expect(user).toHaveProperty('name', expect.any(String));
                expect(user).toHaveProperty('avatar_url', expect.any(String));
              });
            })
    })
    test('status 404, responds with path not found when passed incorrect path',() =>{
        return request(app)
        .get('/api/nousers')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
    })
})