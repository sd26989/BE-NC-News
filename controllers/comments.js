const app = require("../db/app");
const { fetchCommentsByArticleId } = require('../models/comments')

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    fetchCommentsByArticleId(article_id).then((rows) =>{
        const comments = rows;
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err)
    })
}