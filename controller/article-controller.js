const { selectArticleById, selectAllArticles, selectCommentsByArticleId, checkArticleExists} = require("../model/article-model")

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    selectArticleById(article_id)
    .then((article) =>{
        res.status(200).send(article)
    })
    .catch(next)
    
}

exports.getArticles = (req, res, next) => {
    selectAllArticles()
        .then((articles) => {
            res.status(200).send({articles})
        })
        .catch(next)
}

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const promises = [selectCommentsByArticleId(article_id)]
    if (article_id){
        promises.push(checkArticleExists(article_id))
    }
    Promise.all(promises)
        .then((resolvedPromises) => {
            const comment = resolvedPromises[0]
            res.status(200).send(comment)
        })
        .catch(next)
}