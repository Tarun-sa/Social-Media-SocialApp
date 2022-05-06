import { Avatar, Button, Typography, Dialog } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Post.css'
import {
    MoreVert,
    Favorite,
    ChatBubbleOutline,
    DeleteOutline,
    FavoriteBorder,

} from "@mui/icons-material"
import { useDispatch, useSelector } from 'react-redux'
import { addCommentOnPost, likePost, updatePost, deletePost } from '../../Actions/Post'
import { getFollowingPost, getMyPosts, loadUser } from '../../Actions/User'
import User from '../User/User'
import CommentCard from '../CommentCard/CommentCard'


const Post = ({
    postId,
    caption,
    postImage,
    likes = [],
    comments = [],
    ownerImage,
    ownerName,
    ownerId,
    isAccount = false,
    isDelete = false
}) => {

    const [liked, setLiked] = useState(false)
    const [likesUser, setLikesUser] = useState(false)
    const [commentValue, setCommentValue] = useState("")
    const [commentToggle, setCommentToggle] = useState(false)
    const [captionValue, setCaptionValue] = useState(caption)
    const [captionToggle, setCaptionToggle] = useState(false)



    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user)

    // for likes and unlikes
    const handleClick = async () => {
        setLiked((preValue) => {
            return !preValue
        })
        await dispatch(likePost(postId))

        if (isAccount) {
            dispatch(getMyPosts());
        } else {
            dispatch(getFollowingPost());
        }
    }

    // to display filled heart in case the post is liked

    useEffect(() => {
        likes.forEach(item => {
            if (item._id === user._id) {
                setLiked(true)
            }
        });
    }, [likes])

    const commentHandler = async (e) => {
        e.preventDefault();
        await dispatch(addCommentOnPost(postId, commentValue))
        setCommentValue("");

        if (isAccount) {
            dispatch(getMyPosts());
        } else {
            dispatch(getFollowingPost());
        }
    }


    // caption handler

    const captionHandler = async (e) => {

        e.preventDefault();
        await dispatch(updatePost(captionValue, postId))
        setCaptionValue("");
        dispatch(getMyPosts());
    }

    // delete post handler

    const deletePostHandler = async () => {

        await dispatch(deletePost(postId));
        dispatch(loadUser());
        dispatch(getMyPosts());



    }



    return (
        <div className='post'>

            <div className="postHeader">
                {isAccount ? (
                    <Button onClick={() => setCaptionToggle(true)}>
                        <MoreVert />
                    </Button>
                ) : null}
            </div>

            <img src={postImage} alt={postId} />

            <div className="postDetails">
                <Avatar src={ownerImage} alt="user" sx={{
                    height: "3vmax",
                    width: "3vmax"
                }} />
                <Link to={`/user/${ownerId}`}>
                    <Typography
                        fontWeight={700}>
                        {ownerName}
                    </Typography>
                </Link>

                <Typography
                    fontWeight={100}
                    style={{ alignSelf: "center" }}
                    color="rgba(0,0,0,0.582)"
                >{caption}
                </Typography>
            </div>
            {/* user who liked + no of like button */}
            <button style={{
                backgroundColor: "white",
                cursor: "pointer",
                border: "none",
                margin: "0.8vmax 2vmax",
                fontWeight: "700"
            }}
                onClick={() => { setLikesUser(true) }}
                disabled={likes.length === 0 ? true : false}
            >
                <Typography>{likes.length} Likes</Typography>
            </button>


            <div className="postFooter">

                <Button onClick={handleClick}>
                    {
                        liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />
                    }
                </Button>

                <Button onClick={() => { setCommentToggle(true) }}>
                    <ChatBubbleOutline />
                </Button>

                {
                    isDelete ? <Button onClick={deletePostHandler}>
                        <DeleteOutline />
                    </Button> : null
                }
            </div>

            {/* to know who liked the post */}
            <Dialog open={likesUser} onClose={() => { setLikesUser(!likesUser) }}>
                <div className="DialogBox">
                    <Typography variant='h6'>Liked by</Typography>
                    {
                        likes.map((like) => {
                            return (
                                <User key={like._id} avatar={like.avatar.url} userId={like._id} name={like.name} />
                            )
                        })
                    }
                </div>
            </Dialog>

            {/* for comment */}
            <Dialog open={commentToggle} onClose={() => { setCommentToggle(!commentToggle) }}>
                <div className="DialogBox">
                    <Typography variant='h6'>Comments</Typography>
                    <form className="commentForm" onSubmit={commentHandler}>
                        <input type="text"
                            value={commentValue}
                            onChange={(e) => setCommentValue(e.target.value)}
                            placeholder="Add your Comment..."
                            required
                        />
                        <Button type='submit' variant='contained'>Add</Button>
                    </form>

                    {
                        comments.length > 0 ? comments.map((item) => {
                            return <CommentCard
                                key={item._id}
                                comment={item.comment}
                                userId={item.user._id}
                                name={item.user.name}
                                avatar={item.user.avatar.url}
                                commentId={item._id}
                                isAccount={isAccount}
                                postId={postId} />
                        }) :
                            <Typography >No Comments Yet</Typography>
                    }

                </div>
            </Dialog>

            {/* for updating caption */}
            <Dialog open={captionToggle} onClose={() => { setCaptionToggle(!captionToggle) }}>

                <div className="DialogBox">

                    <Typography variant='h6'>Upate your caption</Typography>

                    <form className="commentForm" onSubmit={captionHandler}>
                        <input type="text"
                            value={captionValue}
                            onChange={(e) => setCaptionValue(e.target.value)}
                            placeholder="Add your caption.."
                            required
                        />
                        <Button type='submit' variant='contained'>Update</Button>
                    </form>

                </div>
            </Dialog>
        </div>
    )
}

export default Post