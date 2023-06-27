const { selectArticleById } = require("../model/article-model")

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
   if (isNaN(article_id)) {
    const error = new Error(msg = "Bad Request")
    error.status = 400
    return next(error)
  }
    selectArticleById(article_id)
    .then((article) =>{
        res.status(200).send(article)
    })
    .catch(next)
    
}