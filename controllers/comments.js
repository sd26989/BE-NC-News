const app = require("../db/app");
const { fetchCommentsByArticleId, checkArticleExists } = require('../models/comments')

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