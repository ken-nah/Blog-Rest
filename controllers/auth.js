const User = require('../models/users')

const {
    validationResult
} = require('express-validator/check')
const bcrypt = require('bcryptjs')

exports.signup = (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const error = new Error('User validation failed')
        errors.statusCode = 422
        errors.data = errors.array()
        throw error
    }

    const email = req.body.email
    const password = req.body.password
    const name = req.body.name

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email,
                password: hashedPassword,
                name
            })
            return user.save()
        })
        .then(userDoc => {
            res.status(201).json({
                mesage: 'User created Successfully',
                userId: userDoc._id
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}