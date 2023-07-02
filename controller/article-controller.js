const { selectArticleById, selectAllArticles, selectCommentsByArticleId, checkArticleExists, insertComments, updateArticle} = require("../model/article-model")
const { selectArticlesByTopic } = require("../model/topics-model")

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    selectArticleById(article_id)
    .then((article) =>{
        res.status(200).send(article)
    })
    .catch(next)
    
}

exports.getArticles = (req, res, next) => {
    const {topic, sort_by, order} = req.query
    if(topic){
        selectArticlesByTopic(topic, sort_by, order)
        .then((articles)=>{
            res.status(200).send({articles})
        })
        .catch(next)
    }else{
    selectAllArticles(sort_by, order)
        .then((articles) => {
            res.status(200).send({articles})
        })
        .catch(next)
}
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
    .then(() => insertComments(username, body, article_id))
    .then((comment)=>{
        res.status(201).send(comment)
    })
    .catch(next)
}

exports.patchArticle = (req, res , next) => {
    const { inc_votes: votes } = req.body
    const { article_id: id } = req.params
    updateArticle(votes, id)
    .then((updatedVotes)=>{
        res.status(200).send(updatedVotes)
    })
    .catch(next)
}