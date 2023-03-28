const express = require('express')
const app = express()
const {getTopics} = require('../controllers/topics');
const {getArticleById} = require('../controllers/articles');
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('../controllers/error-handling.js');


app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticleById)


app.all('*',(req,res)=>{
    res.status(404).send({msg:'Path not found'})
})

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app