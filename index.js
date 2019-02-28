const express = require('express')
const logger = require('morgan')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const methods = require('./methods.js')

const client = new MongoClient('mongodb://localhost:27017')
const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())

client.connect((err) => {
    if(err) process.exit(1)
    const db = client.db('blog')
    const userdata = db.collection('users')
    // const blogdata = db.collection('blogdata')
    methods.passcollection(userdata)

    app.post('/signup', methods.signup)
    app.post('/login', methods.login)

    app.use(errorhandler())
    app.listen(3000)
})