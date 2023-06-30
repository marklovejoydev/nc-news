const db = require('../db/connection')

exports.sellectAllUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then(({rows}) => {
        if(!rows.length){
            return Promise.reject({status: 404, msg:"Not found"})
        }
        return rows
    })
}