const jwt = require('jsonwebtoken')
const passwordHash = require('password-hash')

const secretKey = 'secret key'
module.exports = {
    signup : (req, res, userdata, blogdata) => {
        let user = req.body.username
        let password = req.body.password
        let hashedPassword = passwordHash.generate(password)
         
        if (user && password){
            userdata.find({ user }).toArray( (err, docs) => {
                if (err)
                    return res.json({err})

                if (docs.length==0){
                    userdata.insertOne({ user, hashedPassword }, (err, result) => {
                        if (err)
                            return res.json({err})
                        blogdata.insertOne({ user, 'blogs':[] }, (err, result) => {
                            if (err)
                                return res.json({err})
                            res.send('user registered')
                        })
                    })
                }
                else{
                    res.send('user already registered')
                }
              })
        }
        else
            res.sendStatus(400)
    },

    login : (req, res, userdata) => {
        let user = req.body.username
        let password = req.body.password

        if (user && password) {
            userdata.find({ user }).toArray( (err, docs) => {
                if (err)
                    return res.json({err})

                if (docs.length == 1 && passwordHash.verify(password, docs[0].hashedPassword)){
                    jwt.sign( {id:docs[0]._id, user}, secretKey, { expiresIn : '5m' }, (err, token) => {
                        if (err)
                            return res.json({err})
                        res.cookie('token', token, {signed : true}).redirect(`/user/${user}`)
                    })
                }
                else
                    res.status(401).send('incorrect username or password')
              })
        }
        else
            res.sendStatus(400)
    },

    auth : (req, res, next, userdata) => {
        let token = req.signedCookies.token

        jwt.verify(token, secretKey, (err, decoded) => {
            if(err)
                return res.json({err})
            userdata.find({ user: req.params.user }).toArray( (err, docs) => {
                if (err)
                    return res.json({err})
                if (docs.length == 1 && docs[0]._id == decoded.id){
                    next()
                }
                else
                    res.status(401).send('user not logged in')
            })
        })
    },

    user : (req, res, blogdata) => {
        blogdata.find({ user: req.params.user }).toArray( (err, docs) => {
            if (err)
                return res.json({err})
            res.json(docs[0].blogs)
        })
    },

    postblog : (req, res, blogdata) => {
        let title = req.body.title
        let content = req.body.content
        if(content && title){
            blogdata.updateOne({ user: req.params.user }, {$push: {blogs: {title, content}}}, (err, r) => {
                if (err)
                    return res.json({err})
                res.redirect(`/user/${req.params.user}`)
            })
        }
        else
            res.send('empty Blog')
    }
}