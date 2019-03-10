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
        methods.signup(req, res, userdata, blogdata)
    })
    app.post('/login', (req, res) => {
        methods.login(req, res, userdata)
    })
    app.get('/user/:user', (req, res, next) => 
        methods.auth(req, res, next, userdata), (req, res) => {
        methods.user(req, res, blogdata)
    })
    app.post('/user/:user/postblog', (req, res, next) => 
        methods.auth(req, res, next, userdata), (req, res) => {
        methods.postblog(req, res, blogdata)
    })

    
    //------THIS CLEARS THE DATABASE--------
    // app.get('/cleardb', (req, res) => {
    //     userdata.deleteMany({}, (err, r) => { 
    //         blogdata.deleteMany({}, (err, r) => {
    //             res.sendStatus(200)
    //         })
    //     })
    // })
    //----- ONLY FOR TESTING PURPOSE-------

    app.use(errorhandler())
    app.listen(3000)
})