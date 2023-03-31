const express = require('express')
const app = express()
const {getTopics} = require('../controllers/topics');
const {getArticleById, getArticles, patchVotes} = require('../controllers/articles');
const {getCommentsByArticleId, postCommentByArticleId, deleteCommentById} = require('../controllers/comments');
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('../controllers/error-handling.js');

app.use(express.json());

app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.post('/api/articles/:article_id/comments', postCommentByArticleId);
app.patch("/api/articles/:article_id", patchVotes);
app.delete("/api/comments/:comment_id", deleteCommentById);

app.all('*',(req,res)=>{
    res.status(404).send({msg:'Path not found'})
})

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app