const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.author, articles.body, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id) AS comment_count 
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id 
        WHERE articles.article_id = $1 GROUP BY articles.article_id `,
      [article_id]
    )
    .then((data) => {
      if (data.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Path not found",
        });
      } else {
        return data.rows[0];
      }
    });
};

exports.fetchArticles = (sort_by, order, topic) => {
  const queryValues = [];
  let queryStr = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const validSorts = ["author", "title", "article_id", "topic", "created_at", "votes", "comment_count"];

if (topic) {
  queryValues.push(topic);
  queryStr += ` WHERE topic = $1`;
}
queryStr += " GROUP BY articles.article_id";

if (validSorts.includes(sort_by)) {
  queryStr += ` ORDER BY ${sort_by}`;
} else {
  return Promise.reject({ status: 400, msg: `Invalid sort query`});
}

if (order === "asc") {
  queryStr += ` ASC`;
} else if (order === "desc") {
  queryStr += ` DESC`
} else {
  return Promise.reject({ status: 400, msg: `Invalid order query`});
}

  return db.query(queryStr, queryValues)
    .then(({ rows }) => {
      return rows;
    })
}

exports.updateVotes = (article_id, inc_votes) => {
  return db.query(
    `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*`, [inc_votes, article_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      } 
      return result.rows[0]
    });
};

exports.checkTopicExists = (topic) => {
  return db.query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
    .then((result) => {
      if (result.rowCount === 0) {
        return false;
      } else {
        return true;
      }
    });
};