const app = require("../db/app");
const { fetchUsers } = require('../models/users')

exports.getUsers = (req, res) => {
    fetchUsers().then((users) =>{
        res.status(200).send({users})
    })
    .catch((err) => {
        next(err)
    })
};