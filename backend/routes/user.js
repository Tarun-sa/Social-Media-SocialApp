const express = require('express');
const { register, login, followers, logout, updatePassword, updateProfile, deleteProfile, myProfile, userProfile, allUser, forgetPassword, resetPassword, getMyPosts, getUserPosts } = require('../controllers/user');
const { fetchUser } = require('../middlewares/fetchUser')
const router = express.Router();


// resgister router 
router.route('/register').post(register)
// Login route
router.post('/login', login)
//logout route
router.get('/logout', fetchUser, logout)
//following - >Auth required
router.route('/follow/:id').get(fetchUser, followers)
//updatePassword
// router.route('update/password').get(fetchUser, updatePassword)
router.put('/update/password', fetchUser, updatePassword)
//updateProfile
router.route('/update/profile').put(fetchUser, updateProfile)
// deleting the user
router.route('/delete/profile').delete(fetchUser, deleteProfile)
// opening the logged in user profile myprofile
router.get('/my/profile', fetchUser, myProfile)
// get my posts
router.get('/my/posts', fetchUser, getMyPosts)
//getting a user posts
router.get('/userposts/:id', fetchUser, getUserPosts)
// opening a user profile
router.get('/user/:id', fetchUser, userProfile)
//getting all the user
router.get('/users', fetchUser, allUser)
//forgot password
router.route('/forgot/password').post(forgetPassword)
//reset Password
router.route('/password/reset/:token').put(resetPassword)

module.exports = router;

