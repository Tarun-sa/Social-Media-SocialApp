const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({

    caption: String,

    image: {
        public_id: String,
        url: String
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            comment: {
                type: String,
                required: true
            }
        }
    ]


})


const Post = mongoose.model('Post', postSchema)

module.exports = Post;