const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id])
    .then(({rows}) => {
      const comments = rows;
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Path not found',
        });
      }
      return comments;
    })
    }