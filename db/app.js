const express = require('express')
const app = express()
const {getTopics} = require('../controllers/topics');


app.get('/api/topics', getTopics)

app.all('*',(req,res)=>{
    res.status(404).send({msg:'Path not found!'})
})


module.exports = app