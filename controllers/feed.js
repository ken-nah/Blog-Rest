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
    return res.status(422).json({
      message: 'Title and Content must be at least 5 characters',
      errors: errors.array()
    })
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
      .catch(err => console.log(err))
};