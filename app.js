const express = require("express")
const {getTopics} = require('./controller/topics-controller')
const {getApi} = require('./controller/api-controller')
const { getArticleById, getArticles, getCommentsByArticleId } = require("./controller/article-controller")
const { allPathErrors,handleServiceErrors, handleCustomErrors, handlePsqlErrors} = require('./error-handling/error')
const app = express()


app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.use(handlePsqlErrors)

app.use(handleCustomErrors)

app.use("*", allPathErrors)

app.use(handleServiceErrors)


module.exports = app