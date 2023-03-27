const seed = require("../db/seeds/seed");
const { articleData, commentData, topicData, userData } = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../db/app");

beforeAll(() => {
  return seed({ articleData, commentData, topicData, userData });
});

afterAll(() => {
  return db.end();
});


describe('GET: /api/topics', () => {
    it('status: 200, responds with a json object containing a key of `topics` with a value of an array of all the topic objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((res) => {
            expect(res.body).toHaveProperty('topics')
            expect(Array.isArray(res.body.topics)).toBe(true)
            res.body.topics.forEach((topic) => {
                expect(topic).toHaveProperty('description')
                expect(topic).toHaveProperty('slug')
                })
            })
        })
        it('status:404, responds with an error message when passed a path that does not exist', () => {
            return request(app)
              .get('/api/toopics')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('Path not found!');
              });
          })
    })