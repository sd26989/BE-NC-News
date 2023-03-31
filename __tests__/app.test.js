const seed = require("../db/seeds/seed");
const { articleData, commentData, topicData, userData } = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../db/app");
require('jest-sorted');

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

afterAll(() => {
  return db.end();
});


describe("GET: /api/topics", () => {
  it("status: 200, responds with a json object containing a key of `topics` with a value of an array of all the topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("topics");
        expect(Array.isArray(res.body.topics)).toBe(true);
        expect(res.body.topics).toHaveLength(3);
        res.body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("description");
          expect(topic).toHaveProperty("slug");
        });
      });
  });
  it("status:404, responds with an error message when passed a path that does not exist", () => {
    return request(app)
      .get("/api/toopics")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

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
  it("status: 404, responds with an error message when passed a path that does not exist", () => {
    return request(app)
      .get("/api/articles/92929292")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  it("status: 400: responds with Bad Request when the article_id is not valid", () => {
    return request(app)
      .get("/api/articles/seven")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid input");
      });
  });
});

describe("GET: /api/articles", () => {
  it("status: 200, responds with a json object containing a key of `articles` with a value of an array of all the article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("articles");
        expect(Array.isArray(res.body.articles)).toBe(true);
        expect(res.body.articles).toHaveLength(12);
        res.body.articles.forEach((article) => {
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(article).toHaveProperty("article_id");
        });
      });
  });
  it("status: 200, articles should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articles = res.body.articles;
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("status:404, responds with an error message when passed a path that does not exist", () => {
    return request(app)
      .get("/api/artiicles")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("200: responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 5,
          });
        });
      });
  });
  it("status: 200, comments should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const comments = res.body.comments;
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("status: 404, responds with a 404 when article_id is valid but non existent", () => {
    return request(app)
      .get("/api/articles/92929292/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID does not exist!");
      });
  });
  it("status: 200, responds with an empty array when article_id exists but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toEqual([]);
      });
  });
  it("status: 400: responds with Bad Request when the article_id is not valid", () => {
    return request(app)
      .get("/api/articles/seven/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid input");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("status 201: Posts comment to corresponding article and responds with comment", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Hello!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: 19,
          votes: 0,
          created_at: expect.any(String),
          author: "butter_bridge",
          body: "Hello!",
          article_id: 1,
        });
      });
  });
  it("status: 400, responds with error message when request is sent with empty object", () => {
    const testComment = {};
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing information");
      });
  });
  it("status: 400, responds with error message when request is sent without body", () => {
    const testComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing information");
      });
  });
  it("status: 404, responds with error message when request is sent with invalid username", () => {
    const testComment = {
      username: "Nigel10",
      body: "Hello!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  it("status: 404, responds with error message if article_id is valid but does not exist", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Hello!",
    };
    return request(app)
      .post("/api/articles/929292/comments")
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  it("status: 201, ignores extra properties", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Hello!",
      timePosted: "10 am",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "Hello!",
          author: "butter_bridge",
          article_id: 1,
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  it("status: 400: responds with error when the article_id is not valid", () => {
    return request(app)
      .post("/api/articles/seven/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid input");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status: 200, increments vote count by article_id", () => {
    const testIncrement = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/1")
      .send(testIncrement)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 110,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        });
      });
  });
  test("status: 200, decrements vote count by article_id", () => {
    const testDecrement = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/1")
      .send(testDecrement)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 90,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        });
      });
  });
  test("status: 400, responds with error if path is invalid", () => {
    return request(app)
      .patch("/api/articlesssss/1")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  test("status: 400, responds with error if article_id is invalid", () => {
    return request(app)
      .patch("/api/articles/seven")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("status: 404, responds with error if article does not exist", () => {
    return request(app)
      .patch("/api/articles/929292")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article does not exist");
      });
  });
  test("status: 400, responds error when request is sent with empty object", () => {
    const testIncrement = {}
    return request(app)
      .patch("/api/articles/1")
      .send(testIncrement)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing information");
      })
  })
});

describe("DELETE /api/comments/:comment_id", () => {
    test("status: 204, responds with nothing when comment is deleted by comment_id", () => {
      return request(app)
      .delete("/api/comments/1")
      .expect(204);
    });
    test("status: 404, responds with error when comment_id does not exist", () => {
      return request(app)
        .delete("/api/comments/929292")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("comment_id not found");
        });
    });
    test("status: 400, responds with error when comment_id is invalid", () => {
      return request(app)
        .delete("/api/comments/seven")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid input");
        });
    });
  });

  describe("GET: /api/users", () => {
    it("status: 200, responds with a json object containing a key of `users` with a value of an array of all the user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty("users");
          expect(Array.isArray(res.body.users)).toBe(true);
          expect(res.body.users).toHaveLength(4);
          res.body.users.forEach((user) => {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
          });
        });
    });
    it("status:404, responds with an error message when passed a path that does not exist", () => {
      return request(app)
        .get("/api/usersssss")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path not found");
        });
    });
  });

  describe("GET: /api/articles (queries)", () => {
    it("status: 200, responds with articles ifiltered by topic value query", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(1);
            expect(articles).toMatchObject([{
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: "cats",
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            }]);
        });
    });
    it("status: 200, responds with articles sorted by given column in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(12);
          expect(articles).toBeSortedBy("title", { descending: true });
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });
    it("status: 200, responds with articles sorted by given column in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(12);
          expect(articles).toBeSortedBy("title", { ascending: true });
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });
    it("status: 200, responds with articles filtered by topic and sorted by column in ascending order", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=title&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(11);
          expect(articles).toBeSortedBy("title", { ascending: true });
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: "mitch",
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });
    it("status: 404, responds with error when topic query does not exist", () => {
      return request(app)
        .get("/api/articles?topic=dogs")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Topic does not exist");
        });
    });
    it("status: 400, responds with error when sort_by query does not exist", () => {
      return request(app)
        .get("/api/articles?sort_by=language")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid sort query");
        });
    });
    it("status: 400, responds with error when order query does not exist", () => {
      return request(app)
        .get("/api/articles?order=aaaaasc")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid order query");
        });
    });
    it("status: 200, responds with empty array when topic exists but there are no articles on the topic", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toEqual([]);
        });
    });
  });