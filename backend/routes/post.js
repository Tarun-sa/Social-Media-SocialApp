const express = require('express');
const { createPost, likesAndUnlikes, deletePost, getPostOfFollowings, updateCaption, commentOnPost, deleteComment } = require('../controllers/post');
const router = express.Router();
const { fetchUser } = require('../middlewares/fetchUser')


// two ways of writing the routes
// router.route('/post/upload').post(createPost)
router.post('/post/upload', fetchUser, createPost)
// for likes and unlikes
router.route('/post/:id').get(fetchUser, likesAndUnlikes)
//for deleting the post
router.delete('/post/:id', fetchUser, deletePost)
// for getting the post of followed user -
router.get('/posts', fetchUser, getPostOfFollowings)
//for updating the caption of the post
router.route('/post/:id').put(fetchUser, updateCaption)
//adding a comment on the post
router.put('/post/comment/:id', fetchUser, commentOnPost)
//deleting the comment
router.delete("/post/comment/:id", fetchUser, deleteComment)

module.exports = router;

