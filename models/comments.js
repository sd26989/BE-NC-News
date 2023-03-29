const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id])
    .then((result) => {
      return result.rows;
    })
    }

    exports.checkArticleExists = (article_id) => {
        return db.query(`SELECT * FROM articles WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: 'Article ID does not exist!'})
        }
      })
    }