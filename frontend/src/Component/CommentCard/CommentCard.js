import React from 'react'
import './CommentCard.css'
import { Typography, Button } from '@mui/material'
import { Link } from "react-router-dom"
import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
// import { deleteCommentOnPost } from "../../Actions/Post";
import { getFollowingPost, getMyPosts } from "../../Actions/User";
import { deleteCommentOnPost } from '../../Actions/Post';



const CommentCard = ({
    comment,
    userId,
    name,
    avatar,
    commentId,
    isAccount,
    postId
}) => {

    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const deleteCommentHandle = async () => {

        await dispatch(deleteCommentOnPost(postId, commentId));

        if (isAccount) {
            dispatch(getMyPosts());
        } else {
            dispatch(getFollowingPost());
        }
    };
    return (
        <div className="commentUser">
            {/* linking to the user */}
            <Link to={`/user/${userId}`}>
                <img src={avatar} alt={name} />
                <Typography style={{ minWidth: "6vmax" }}>{name}</Typography>
            </Link>
            <Typography>{comment}</Typography>

            {isAccount ? (
                <Button onClick={deleteCommentHandle}>
                    <Delete />
                </Button>
            ) : userId === user._id ? (
                <Button onClick={deleteCommentHandle}>
                    <Delete />
                </Button>
            ) : null}
        </div>
    )
}

export default CommentCard