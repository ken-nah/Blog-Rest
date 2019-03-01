const User = require('../models/users')

const { validationResult } = require('express-validator/check')

exports.signup = (req,res) => {
    const errors = validationResult(req.body)

    if(!errors.isEmpty()) {
        const error = new Error('User validation failed')
        errors.statusCode = 422
        errors.data = errors.array()
        throw error
    }

    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
}