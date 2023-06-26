const express = require("express")
const {getTopics} = require('./controller/topics-controller')
const app = express()

app.get('/api/topics', getTopics)


module.exports = app