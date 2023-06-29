

exports.allPathErrors = (req, res) => {
    res.status(404).send({msg: "Not found"})
}


exports.handlePsqlErrors = (err, req, res, next) => {
    if(err.code === '22P02'){
        res.status(400).send({msg: "Bad request"})
    } else next()
}

exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status === 400){
        res.status(400).send({msg: "Bad request"})
    }if(err.status === 404){
        res.status(404).send({msg: "Not found"})
    } 
    else next()
}

exports.handleServiceErrors = (err, req, res, next) => {
    res.status(500).send({msg: "I am broken..."})
}

