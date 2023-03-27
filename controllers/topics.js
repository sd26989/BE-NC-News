const app = require("../db/app");
const { fetchTopics } = require('../models/topics')

exports.getTopics = (req, res) => {
    fetchTopics().then((topics) =>{
        res.status(200).send({'topics': topics})
    })
    .catch((err) => {
        next(err)
    })
};