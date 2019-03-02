const User = require('../models/users')

const {
    validationResult
} = require('express-validator/check')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.signup = (req, res, next) => {
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

exports.login = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    let fetchedUser;


    User.findOne({
            email
        })
        .then(userDoc => {
            if (!userDoc) {
                const error = new Error('User not Found..')
                error.statusCode = 401
                throw error
            }
            fetchedUser = userDoc
            return bcrypt.compare(password, userDoc.password)
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Invalid Username or password..')
                error.statusCode = 401
                throw error
            }
            const token = jwt.sign({
                email: fetchedUser.email,
                userId: fetchedUser._id
            }, 
            'ilovethissecretcozucanhardlydecodeitmahboy',
             {
                expiresIn: '1h'
            })

            res.status(200).json({
                token,
                userId: fetchedUser._id.toString()
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}