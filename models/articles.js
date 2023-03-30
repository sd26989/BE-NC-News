const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: 'Path not found',
        });
      }
      return article;
    })
}

exports.fetchArticles = () => {
  return db.query(`SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC`)
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