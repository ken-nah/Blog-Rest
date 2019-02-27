const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const path = require('path');

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use('/images',express.static(path.join(__dirname,'images')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

app.use((error,res,req,next) => {
    const status = error.statusCode;
    const message = error.message;
    res.status(status).json({
        message
    })
})

const MONGO_URI = 'mongodb://localhost/blog'
mongoose.connect(MONGO_URI, {useNewUrlParser: true})
        .then(connection => {
            console.log('Connected to MongoDB..');
            app.listen(5000);
        })
        .catch(err => {
            console.log(err.msg)
        })