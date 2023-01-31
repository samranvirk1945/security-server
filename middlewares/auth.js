//Add Packages
const httpStatus = require('http-status-codes');
const { JWT } = require('../utils/index.js');
const constant = require('../constants')

//Add Files
const models = require('../models');

const authenticate = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) return res.status(httpStatus.UNAUTHORIZED).json({ message: constant.strings.response.middleware.token_missing });
    if (token.startsWith('Bearer')) token = token.slice(7, token.length);
    try {
        let decodedUser

        decodedUser = await JWT.verifyToken(token);
        if (!decodedUser) return res.status(httpStatus.UNAUTHORIZED).json({ message: constant.strings.response.middleware.token_invalid });
        let user = await models.User.findOne({
            where: {
                email: decodedUser.email,
                type: decodedUser.type
            }
        });
        req.user = user;

        if (!user) return res.status(httpStatus.UNAUTHORIZED).json({ message: constant.strings.response.middleware.token_invalid });
        return next();
    } catch (err) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: constant.strings.response.middleware.token_invalid, err });
    }
};


module.exports = { authenticate };
