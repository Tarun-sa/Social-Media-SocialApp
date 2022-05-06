const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.fetchUser = async (req, res, next) => {

    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ messages: "Please login first" })
        }
        // fetching the data from the token
        const data = await jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(data.id);
        next();
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            msg: "cant get token"
        })
    }

}