const app = require("../db/app");
const { fetchCommentsByArticleId, checkArticleExists, postComment } = require('../models/comments')

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    Promise.all([fetchCommentsByArticleId(article_id), checkArticleExists(article_id)])
      .then((comments) => {
        res.status(200).send({ comments: comments[0] });
      })
      .catch((err) => {
        next(err);
      });
  };

  exports.postCommentByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    const comment = req.body;
    postComment(article_id, comment).then(comment => {
      res.status(201).send({comment});
    })
    .catch((err) => {
        next(err)
    })
  }