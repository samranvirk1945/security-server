//Add Packages
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HASH_SALT = '*(USER_SALOON!@#123Anvb';
module.exports = {
    hashing: {
        encrypt: async (text) => new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) reject(err);
                bcrypt.hash(text, salt, (error, hash) => {
                    if (error) reject(err);
                    resolve(hash);
                });
            });
        }),
        decrypt: async (plainText, hash) => new Promise((resolve, reject) => {
            bcrypt.compare(plainText, hash, (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        })
    },
    JWT: {
        generateToken: async (user) => {
            return jwt.sign({
                email: user.email,
                id: user.id,
                type:user.type
            }, HASH_SALT, {
                expiresIn: '24h'
            }).toString()
        },
        verifyToken: async (token) => new Promise((resolve, reject) => {
            jwt.verify(token, HASH_SALT, async (err, decoded) => {
                if (err) reject(err.message);
                resolve(decoded);
            });
        })

    }

};
