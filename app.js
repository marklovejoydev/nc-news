const express = require("express")
const {getTopics} = require('./controller/topics-controller')
const {getApi} = require('./controller/api-controller')
const { getArticleById } = require("./controller/article-controller")
const {handleNotFoundErrors, handleServiceErrors} = require('./error-handling/error')
const app = express()


app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.get('/api/articles/:article_id', getArticleById)


app.use(handleNotFoundErrors)

app.use(handleServiceErrors)


module.exports = app