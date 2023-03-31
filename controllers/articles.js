const app = require("../db/app");
const { fetchArticleById, fetchArticles, updateVotes, checkTopicExists} = require('../models/articles')

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
    const { sort_by = "created_at", order = "desc", topic } = req.query;

    fetchArticles(sort_by, order, topic)
        .then((articles) => {
            if (articles.length === 0) {
                return checkTopicExists(topic)
                .then((topicExists) => {
                    if (topicExists) {
                        res.status(200).send({ articles: [] });
                    } else {
                        throw { status: 404, msg: "Topic does not exist" };
                    }
                });
            } else {
                res.status(200).send({ articles });
            }
        })
        .catch((err) => {
            next(err);
        });
};

exports.patchVotes = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    updateVotes(article_id, inc_votes).then((article) => {
      res.status(200).send({article});
    })
    .catch((err) => {
      next(err);
    })
  };