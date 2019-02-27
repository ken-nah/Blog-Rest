const {
  validationResult
} = require('express-validator/check');

const Post = require('../models/Post');

exports.getPosts = (req, res, next) => {
  Post.find()
      .then(posts => {
        return res.status(200).json({
          message: 'Posts Fetched..',
          posts
        })
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500
        }
        next(err)
      })
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
        if (!err.statusCode) {
          err.statusCode = 500
        }
        next(err)
      })
};

exports.getPost = (req,res) => {
  const postId = req.params.postId;
  Post.findById(postId)
      .then(post => {
        if(!post) {
          const error = new Error('Post not Found..');
          error.statusCode = 404;
          throw error;
        }
        return res.status(200).json({
          post
        })
      })
      .catch(err => {
        if(!err.statusCode) {
          err.statusCode = 500
        }
        next(err)
      })
}