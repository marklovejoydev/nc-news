const db = require('../db/connection')

exports.deleteSelectedComment = (id) => {
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING*;`, [id]
    ).then(({rows}) => {
        if(!rows.length){
            return Promise.reject({status: 404, msg: "Not found"})
        }
    })
}
