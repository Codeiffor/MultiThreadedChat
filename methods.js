let userdata
module.exports = {
    passcollection : (userd) => {
        userdata = userd
    },

    signup : (req, res) => {
        let user = req.body.username
        let password = req.body.password
        if(user && password){
            userdata.find({user}).toArray( (err, docs) => {
                if(err) process.exit(1)
                if(docs.length==0){
                    userdata.insertOne({user,password}, (err, result) => {
                        if(err) process.exit(1)
                        if((1 == result.insertedCount))
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

    login : (req, res) => {
        let user = req.body.username
        let password = req.body.password
        if(user && password){
            userdata.find({user}).toArray( (err, docs) => {
                if(err) process.exit(1)
                if(docs.length==1 && docs[0].password==password)
                    res.send('login successful')
                else
                    res.status(401).send('incorrect username or password')
                
              })
        }
        else
            res.sendStatus(400)
    }
}