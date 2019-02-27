const {
  validationResult
} = require('express-validator/check');

const Post = require('../models/Post');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{
      _id: '1',
      title: 'First Post',
      content: 'This is the first post!',
      imageUrl: '/images/Bugatti Chiron.jpg',
      creator: {
        name: 'Kennah'
      },
      createdAt: new Date()
    }]
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Title and Content should be at least 5 characters long')
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  const post = new Post({
    title,
    content,
    creator: {
      name: 'Kennah'
    },
    imageUrl: 'images/bugatti-chiron.jpg'
  })

  post.save()
      .then(post => {
        res.status(201).json({
          message: 'Post created successfully!',
          post
        });
      })
      .catch(err => {
        next(err)
      })
};