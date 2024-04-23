const logger = (req, res, next) => {
    const method = req.method
    const url = req.url
    const time = new Date().getFullYear()
    console.log(method, url, time)
    next() // MUST send it on to the next middleware or send a response
}

module.exports = logger 
