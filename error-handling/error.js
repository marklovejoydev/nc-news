exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status === 400){
    res.status(400).send({msg: "Bad request"})
    } else next()
}

exports.handleServiceErrors = (err, req, res, next) => {
    
    res.status(500).send({msg: "I am broken..."})
}
exports.handleNotFoundErrors = (req, res, next) => {
    res.status(404).send({msg: "Not found"})
    } 
