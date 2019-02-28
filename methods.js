const jwt = require('jsonwebtoken')

const secretKey = 'secret key'
module.exports = {
    signup : (req, res, userdata) => {
        let user = req.body.username
        let password = req.body.password

        if (user && password){
            userdata.find({ user }).toArray( (err, docs) => {
                if (err)
                    return res.json({err})

                if (docs.length==0){
                    userdata.insertOne({ user, password }, (err, result) => {
                        if (err)
                            return res.json({err})
                        if ((1 == result.insertedCount))
                            res.send('user registered')
                        else
                            res.sendStatus(500)
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

                if (docs.length == 1 && docs[0].password == password){
                    jwt.sign( {user, password}, secretKey, { expiresIn : '1m' }, (err, token) => {
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

    auth : (req, res, next) => {
        let token = req.signedCookies.token
        console.log(token);
         
        jwt.verify(token, secretKey, (err, decoded) => {
            if(err)
                return res.json({err})
            next()
        })
    },

    user : (req, res, blogdata) => {
        res.send(`${req.params.user} logged in : user blogs will appear here`)
    }
}