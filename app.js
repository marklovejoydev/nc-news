const express = require("express")
const {getTopics} = require('./controller/topics-controller')
const {handleNotFoundErrors, handleServiceErrors} = require('./error-handling/error')
const app = express()

app.get('/api/topics', getTopics)

app.use(handleNotFoundErrors)

app.use(handleServiceErrors)


module.exports = app