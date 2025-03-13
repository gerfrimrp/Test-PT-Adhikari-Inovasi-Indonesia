const { verifyToken } = require("./helpers/jwt");

const auth = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: 'Unauthorized' })
    };
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next()
    } catch (err) {
        console.log(err)
    }
}

module.exports = auth;