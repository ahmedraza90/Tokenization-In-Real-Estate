var jwt = require('jsonwebtoken')
const JWT_SECRET = "Mynameismuzammil"

const fetchuser = (req, res, next) => {
    
    const token = req.rawHeaders[11]
    if (!token) {
        
        return res.status(401).send({ error: "Please authenticate using a valid tokenssssssssss" })

    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user

    } catch (error) {
        return res.status(401).send({ error: "Please authenticate using a valid tokenwwwwwwwwwwwwwww" })
    }
    next();
}

module.exports = fetchuser