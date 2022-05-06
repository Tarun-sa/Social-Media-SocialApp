const User = require('../models/User')
const Post = require('../models/Post')
const bcrypt = require('bcrypt');
const { sendEmail } = require('../middlewares/sendEmail')
const crypto = require('crypto');
const cloudinary = require('cloudinary')


// Route 1:Registering the new User
exports.register = async (req, res) => {

    //destructing the data received from the frontend in the body
    const { name, avatar, email, password } = req.body;

    try {
        // finding if the user exists
        let user = await User.findOne({ email });
        // if user already exists
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatar"
        })

        // creating the newUser the password is hashed before tsaving in the Model USER
        user = await User.create({ name, email, password, avatar: { public_id: myCloud.public_id, url: myCloud.secure_url } })

        const token = await user.generateToken()
        // for cookie
        const option = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }
        res.status(201).cookie("token", token, option).json({
            success: true,
            message: "User Created Successfully",
            token,
            user
        })
    }

    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// Route 2: Login in the user // does not require login

exports.login = async (req, res) => {

    try {
        // getting the email and password from the frontend
        const { email, password } = req.body;

        // finding id the user exists with the help of email
        const user = await User.findOne({ email }).select('+password').populate("posts followers followings");

        //if user does not exist
        if (!user) {
            return res.status(400).json({
                success: false, message: "User does not exists"
            })
        }
        // now if user exist then comparing if the password is correct
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                success: false, message: "Please enter valid credentials"
            })
        }
        // now the password ans the email matches with the record first we generate token then send the message

        const token = await user.generateToken()
        const option = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.status(200).cookie("token", token, option).json({
            success: true,
            token,
            user,
            message: "Logged In"
        })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

//Route 3:Logout 
exports.logout = async (req, res) => {

    try {
        res.status(200).cookie("token", null, { expires: new Date(Date.now()), httpOnly: false, })
            .json({
                success: true,
                message: "Logged Out"
            })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// ROUTE 4 : AUTH REQUIRED -For  FOLLOWING A USER 

exports.followers = async (req, res) => {

    try {
        const userToFollow = await User.findById(req.params.id)
        const loggedUser = await User.findById(req.user._id)

        if (!userToFollow) {
            return res.status(404).json({ success: false, message: "User does not exists" })
        }

        // if already followed unfollowing the user-> Unfollowing the user
        if (loggedUser.followings.includes(userToFollow._id)) {

            // unfollowing the followed user -> removing from followings
            const indexofFollowedUser = loggedUser.followings.indexOf(userToFollow._id)
            loggedUser.followings.splice(indexofFollowedUser, 1)

            //removing the user from the follower list
            const indexOfFollowingUser = userToFollow.followers.indexOf(loggedUser._id)
            userToFollow.followers.splice(indexOfFollowingUser, 1)

            await loggedUser.save()
            await userToFollow.save()
            return res.status(200).json({ success: true, message: "Unfollowed" })
        }

        //Following the user
        else {

            // logged user started follwoing
            userToFollow.followers.push(loggedUser._id)
            //logged user became followers
            loggedUser.followings.push(userToFollow._id)

            await userToFollow.save()
            await loggedUser.save()

            return res.status(200).json({ success: true, message: "Followed" })
        }


    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

//Route 5: Update the password auth required

exports.updatePassword = async (req, res) => {

    try {
        const user = await User.findById(req.user._id).select("+password")
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "please provide both old & new password" })
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect Old Password" })
        }
        //if old password match then saving the new password
        //before saving the user we have applied the pre method in User schema which will check whether the 
        //password is modified if modified then hasinging it and thern saving it
        user.password = newPassword
        await user.save();
        res.status(200).json({ success: true, message: "password updated successfully" })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
//Route 6 : Updating the profile

exports.updateProfile = async (req, res) => {

    try {
        const { name, email, avatar } = req.body;
        const user = await User.findById(req.user._id)

        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }

        if (avatar) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id)
            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                folder: "avatar"
            })
            user.avatar.public_id = myCloud.public_id;
            user.avatar.url = myCloud.secure_url;
        }
        await user.save();
        res.status(200).json({ success: true, message: "Profile updated successfully" })
    }


    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

//Route 7 : Delete the profile

exports.deleteProfile = async (req, res) => {

    try {
        const user = await User.findById(req.user._id)
        const userId = user._id;
        const followers = user.followers;
        const followings = user.followings;
        //gtting the post of the user in order to remove them after the user deleted his profile
        const posts = user.posts;


        // removing avatar from the coudinary

        await cloudinary.v2.uploader.destroy(user.avatar.public_id)

        await user.remove();

        //logout the user after account deleted
        res.cookie("token", null, { expires: new Date(Date.now), httpOnly: true })

        //removing the post
        for (let index = 0; index < posts.length; index++) {
            const post = await Post.findById(posts[index])
            // removing post from the clodinary
            await cloudinary.v2.uploader.destroy(post.image.public_id)
            await post.remove();
        }

        //removing the user profile who is deleting his profile from the user's followers' following lists

        for (let i = 0; i < followers.length; i++) {
            const follower = await User.findById(followers[i])

            const userIndex = follower.followings.indexOf(userId)
            follower.followings.splice(userIndex, 1)

            await follower.save()
        }

        //removing the user's profile who is deleting his profile from followers list of user whom he may have followed
        for (let i = 0; i < followings.length; i++) {
            const following = await User.findById(followings[i])

            const userIndex = following.followers.indexOf(userId)
            following.followers.splice(userIndex, 1)

            await following.save()
        }

        //removing all the comments of the user from all posts

        const allPosts = await Post.find();

        for (let i = 0; i < allPosts.length; i++) {
            const post = await Post.findById(allPosts[i]._id)

            for (let j = 0; j < post.comments.length; j++) {
                if (post.comments[j].user === userId)
                    post.comments.splice(j, 1)
            }
            await post.save()
        }


        //removing all the likes of the user from all posts

        for (let i = 0; i < allPosts.length; i++) {
            const post = await Post.findById(allPosts[i]._id)

            for (let j = 0; j < post.likes.length; j++) {
                if (post.likes[j] === userId)
                    post.likes.splice(j, 1)
            }
            await post.save()
        }


        res.status(200).json({ success: true, message: "User has been deleted successfully" })
    }



    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

//Route 7 : Getting my profile

exports.myProfile = async (req, res) => {

    try {
        const user = await User.findById(req.user._id).populate("posts followers followings")

        res.status(200).json({ user })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
//Route 8 Getting a user profile

exports.userProfile = async (req, res) => {

    try {
        const user = await User.findById(req.params.id).populate("posts followers followings")

        if (!user) {
            return res.status(404).json({ success: false, message: "user does not exist" })
        }
        res.status(200).json({ user })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
// Route 9; Getting all he user

exports.allUser = async (req, res) => {

    try {
        const users = await User.find({ name: { $regex: req.query.name, $options: "i" }, })

        res.status(200).json({ users })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }

}

//Route 10: Forget the password

exports.forgetPassword = async (req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const resetToken = await user.getResetPasswordToken();

        await user.save();

        const resetUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
        const message = `Reset your password by clicking on the link below:\n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Reset Password",
                message
            });
            res.status(200).json({ success: true, message: `email sent to ${user.email}` })
        }
        catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            res.status(500).json({ success: false, message: error.message })
        }
    }

    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

//Route 11: RESET PASSWORD

exports.resetPassword = async (req, res) => {

    try {

        const resetToken = req.params.token
        //now hasing the token in order to match it with the hased token stored in database
        const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        //now finding the user
        const user = await User.findOne(
            {
                resetPasswordToken,
                resetPasswordExpire: { $gt: Date.now() },
            }
        )
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Token is invalid or has expired"
            })
        }

        user.password = req.body.password;
        //destroying these two value in our database
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;

        await user.save();

        res.status(200).json({ success: true, message: "Password reset successfully" })

    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }

}

// Route:12 Getting all the post of the logged in user

exports.getMyPosts = async (req, res) => {

    try {
        const user = await User.findById(req.user._id)

        const posts = [];

        for (let i = 0; i < user.posts.length; i++) {
            const post = await Post.findById(user.posts[i]).populate("likes comments.user ownerId");

            posts.push(post)
        }
        res.status(200).json({ success: true, posts })

    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// Route:13 Getting all the post of a particular user

exports.getUserPosts = async (req, res) => {

    try {
        const user = await User.findById(req.params.id)

        const posts = [];

        for (let i = 0; i < user.posts.length; i++) {
            const post = await Post.findById(user.posts[i]).populate("likes comments.user ownerId");

            posts.push(post)
        }
        res.status(200).json({ success: true, posts })

    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}