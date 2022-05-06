const Post = require('../models/Post')
const User = require('../models/User')
const cloudinary = require('cloudinary')

exports.createPost = async (req, res) => {


    try {
        const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
            folder: "mernSocialPosts"
        })
        //creating a new post data as per post Schema
        const newPostData = {
            caption: req.body.caption,
            image: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            },
            ownerId: req.user._id
        }

        // now finally storing the created new post in database using mongose
        const newPost = await Post.create(newPostData)

        //fetching the user who created this post
        const user = await User.findById(req.user._id)

        //pushing the post created by this user in the posts field of its schema with the help of post id
        user.posts.unshift(newPost._id);
        //saving it the database
        await user.save();
        // sending the response
        res.status(200).json({
            success: true,
            message: "post created"
        })
    }

    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
// ROUTE 2 AUTH REQUIRED FOR LIKES AND UNLIKES


exports.likesAndUnlikes = async (req, res) => {

    try {

        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ message: "post does not exists" })
        }

        //if user already liked the post unliking it
        if (post.likes.includes(req.user._id)) {

            const index = post.likes.indexOf(req.user._id)
            post.likes.splice(index, 1)
            await post.save();

            return res.status(200).json({
                success: true,
                message: "POST UNLIKED"
            })
        }
        // if user has not yet liked the post
        else {
            post.likes.push(req.user._id)
            await post.save()
            return res.status(200).json({
                success: true,
                message: "POST LIKED",
                userLiked: req.user._id
            })

        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })

    }
}
// ROUTE 3 AUTH REQUIRED FOR deleting the post
exports.deletePost = async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.user._id)

        if (!post) {
            return res.status(404).json({ message: "Post does not exists" })
        }


        //only the user who posted the post can delete it 
        if (post.ownerId.toString() === user._id.toString()) {


            //deleting the post from cloudinary
            await cloudinary.v2.uploader.destroy(post.image.public_id)

            //removing the post
            await post.remove();
            // we also have to remove the post id which is stored in the user.posts
            //getting the index od the post in the user posts list and rewmoving it
            const index = user.posts.indexOf(req.params.id)
            user.posts.splice(index, 1)
            await user.save();

            return res.status(200).json({ message: "Post has been successfully deleted " })

        }
        else {
            return res.status(401).json({ message: "Unauthorized to delete the post" })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })

    }
}
//Route 4: for getting the post of the followed user

exports.getPostOfFollowings = async (req, res) => {

    try {
        //finding the logged user
        const user = await User.findById(req.user._id)

        //finding all the post of the all the user whom the logged in user followed
        //user.following is an array of all the user the logged in user followed
        //posts will be an array of all the post found
        const posts = await Post.find({ ownerId: { $in: user.followings, } }).populate("ownerId likes comments.user")

        res.status(200).json({ success: true, posts: posts.reverse() })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// Route 5: Updating caption

exports.updateCaption = async (req, res) => {

    try {
        const { caption } = req.body;
        const post = await Post.findById(req.params.id);
        //we need to check if the user whoc= created the post can only update it
        const user = await User.findById(req.user._id)
        //checking if the post exists
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" })
        }
        //only the user who posted the post can delete it 
        if (post.ownerId.toString() === user._id.toString()) {
            post.caption = caption;
            await post.save();
            res.status(200).json({ success: true, message: "Caption Updated" })
        }
        else {
            res.status(401).json({ success: false, message: "Unauthorized to update the post" })
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//Route 6: Adding Comment

exports.commentOnPost = async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.user._id)
        const { comment } = req.body;

        let commentExists = false;
        let i = "";

        if (!post) {
            return res.status(404).json({ success: false, message: "post not found" })
        }
        //finding whether the user had already commented then we have to update his comment

        post.comments.forEach((item, index) => {
            if (item.user.toString() === req.user._id.toString()) {
                commentExists = true
                i = index;
            }
        })
        //updating the comment
        if (commentExists) {
            post.comments[i].comment = req.body.comment;
            await post.save();
            return res.status(200).json({
                success: true,
                message: "comment updated"
            })
        }

        //posting comment for the first time
        else {
            post.comments.push({
                user: req.user._id,
                comment: comment
            })
            await post.save();
            return res.status(200).json({
                success: true,
                message: "comment added"
            })
        }

    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//Route 7: Deleting a comment
exports.deleteComment = async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ success: false, message: "post not found" })
        }


        //owner of the post can delete anyone comment on his post
        if (post.ownerId.toString() === req.user._id.toString()) {

            //required to send the commentId
            if (req.body.commentId === undefined) {
                return res.status(400).json({ message: "commentId is required" })
            }

            post.comments.forEach((item, index) => {
                if (item._id.toString() === req.body.commentId.toString()) {
                    return post.comments.splice(index, 1)
                }
            })

            await post.save();
            return res.status(200).json({ success: true, message: "selected comment deleted" })
        }

        //if not owner anyone else can delete there comments only 
        else {
            post.comments.forEach((item, index) => {
                if (item.user.toString() === req.user._id.toString()) {
                    return post.comments.splice(index, 1)
                }
            })
            await post.save();
            return res.status(200).json({ success: true, message: "Your Comment has been deleted " })
        }
    }

    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}