const app = require("../db/app");
const { fetchArticleById, fetchArticles } = require('../models/articles')

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id).then((rows) =>{
        const article = rows;
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
    fetchArticles().then((rows) =>{
        const articles = rows;
        res.status(200).send({ articles })
    })
    .catch((err) => {
        next(err)
    })
};