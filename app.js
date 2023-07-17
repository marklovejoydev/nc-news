const express = require("express")
const {getTopics} = require('./controller/topics-controller')
const {getApi} = require('./controller/api-controller')
const { getArticleById, getArticles, getCommentsByArticleId, postComments, patchArticle} = require("./controller/article-controller")
const { allPathErrors,handleServiceErrors, handleCustomErrors, handlePsqlErrors} = require('./error-handling/error')
const { deleteComment } = require("./controller/comments-controller")
const { getUsers } = require("./controller/user-controller")
const cors = require('cors');


const app = express()
app.use(cors())

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.get('/api/users',getUsers)

app.post('/api/articles/:article_id/comments', postComments)

app.patch('/api/articles/:article_id', patchArticle)

app.delete('/api/comments/:comment_id', deleteComment)

app.use(handlePsqlErrors)

app.use(handleCustomErrors)

app.use("*", allPathErrors)

app.use(handleServiceErrors)


module.exports = app