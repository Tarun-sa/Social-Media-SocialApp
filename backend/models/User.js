const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new Schema({

    name: {
        type: String,
        required: [true, "Please enter a name"]
    },
    avatar: {
        public_id: String,
        url: String

    },
    email: {
        type: String,
        required: [true, "Please enter a email"],
        unique: [true, "Email alrady exists"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        select: false

    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    followings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    resetPasswordToken: String,
    resetPasswordExprire: Date,

})
// beforing saving if the password is modified or added then encrypting it 
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next();
})
// // now when the user try to login comparing the entered password with the hased one
//NOT USED THIS METHOD
// userSchema.methods.matchPassword = async function (password) {
//     return await bcrypt.compare(password, this.password)
// };

// generating the token and resending it

userSchema.methods.generateToken = function () {
    const data = {
        id: this._id
    }
    return jwt.sign(data, process.env.JWT_SECRET)
}

//reset password token generating
userSchema.methods.getResetPasswordToken = function () {

    const resetToken = crypto.randomBytes(20).toString('hex');
    console.log(resetToken);

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExprire = new Date(Date.now() + 10 * 60 * 1000)
    return resetToken;
}

const User = mongoose.model('User', userSchema)
module.exports = User