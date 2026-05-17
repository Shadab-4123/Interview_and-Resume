const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blacklist.model')

async function authUser(req, res, next) {
    const token = req.cookies && req.cookies.token
    console.log('Token from cookies:', token) // Debugging log

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token })
    if (isTokenBlacklisted) {
        return res.status(401).json({ message: 'Token is invalid' })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { id: decoded.userId }
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
}

module.exports = { authUser }