const { selectArticleById, selectAllArticles} = require("../model/article-model")

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