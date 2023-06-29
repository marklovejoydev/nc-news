const { selectArticleById, selectAllArticles, selectCommentsByArticleId, checkArticleExists, insertComments,} = require("../model/article-model")

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
            const comments = resolvedPromises[0]
            res.status(200).send(comments)
        })
        .catch(next)
}

exports.postComments = (req, res, next) => {
    const {username, body} = req.body
    const {article_id} = req.params
    checkArticleExists(article_id)
    .then(()=>insertComments(username, body, article_id))
    .then((comment)=>{
        res.status(201).send(comment)
    })
    .catch(next)
}