const express = require('express')
const MongoClient = require('mongodb').MongoClient
const methods = require('./methods.js')

const logger = require('morgan')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');

const client = new MongoClient('mongodb://localhost:27017')
const app = express()

app.use(cookieParser('secret'));
app.use(logger('dev'))
app.use(bodyParser.json())

client.connect((err) => {
    if (err) process.exit(1)
    const db = client.db('blog')
    const userdata = db.collection('users')
    const blogdata = db.collection('userblogs')

    app.post('/signup', (req, res) => {
        methods.signup(req, res, userdata)
    })
    app.post('/login', (req, res) => {
        methods.login(req, res, userdata)
    })
    app.get('/user/:user', methods.auth, (req, res) => {
        methods.user(req, res, blogdata)
    })

    app.use(errorhandler())
    app.listen(3000)
})