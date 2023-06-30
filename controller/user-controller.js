const { sellectAllUsers } = require("../model/user-models")

exports.getUsers = (req, res, next) => {
    sellectAllUsers()
    .then((users) => {
        res.status(200).send({users})
    })
    .catch(next)
}