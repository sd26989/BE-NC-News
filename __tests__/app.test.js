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
            expect(res.body.topics).toHaveLength(3)
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
                expect(body.msg).toBe('Path not found');
              });
          })
    })

    describe("GET /api/articles/:article_id", () => {
        it("200: responds with an article object corresponding to article_id in request", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              const { article } = body;
              expect(article).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                author: "butter_bridge",
                body: "I find this existence challenging",
                topic: "mitch",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              });
            });
        });
        it('status: 404, responds with an error message when passed a path that does not exist', () => {
          return request(app)
            .get('/api/articles/92929292')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('Path not found');
            });
        })
        it('status: 400: responds with Bad Request when the article_id is not valid', () => {
          return request(app)
            .get("/api/articles/seven")
            .expect(400)
            .then(({ body }) => {
              const { msg } = body;
              expect(msg).toBe("Invalid input");
            });
        });
      });