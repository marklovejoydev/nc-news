const {deleteSelectedComment} = require('../model/comments-model')

exports.deleteComment = (req, res, next) => {
    const {comment_id: id} = req.params
    deleteSelectedComment(id)
    .then(() => {
        res.status(204).send()
    })
    .catch(next)
}