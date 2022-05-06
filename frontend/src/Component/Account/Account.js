import React, { useEffect, useState } from 'react'
import { Avatar, Typography, Button, Dialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { deleteMyProfile, getMyPosts, loadUser, logoutUser } from '../../Actions/User';
import Loader from '../Loader/Loader'
import Post from '../Post/Post'
import './Account.css'
import { useAlert } from 'react-alert'
import { Link } from 'react-router-dom';
import User from '../User/User'

const Account = () => {

    const dispatch = useDispatch();
    const alert = useAlert();

    const { user, loading: userLoading } = useSelector((state) => state.user)
    const { loading, posts, error } = useSelector((state) => state.myPosts)
    const { error: likeError, message, loading: deleteLoading } = useSelector((state) => state.like)


    const [followersToggle, setFollowersToggle] = useState(false)
    const [followingToggle, setFollowingToggle] = useState(false)

    useEffect(() => {
        dispatch(getMyPosts())
        dispatch(loadUser())
    }, [dispatch])

    // for like ans unlike message
    useEffect(() => {
        if (likeError) {
            alert.error(likeError)
            dispatch({ type: 'clearError' })
        }
        if (error) {
            alert.error(error)
            dispatch({ type: 'clearError' })
        }
        if (message) {
            alert.success(message)
            dispatch({ type: 'clearMessage' })
        }
    }, [alert, likeError, error, message, dispatch])

    //logout handler

    const logoutHandler = async () => {
        await dispatch(logoutUser());
        alert.success("Logged out ")
    }


    // delet emy profile handler

    const deleteProfileHandler = async () => {
        await dispatch(deleteMyProfile());
        dispatch(logoutUser());
    }


    return (
        loading === true || userLoading === true ? <Loader /> :
            <div className="account">
                <div className="accountleft">

                    {
                        posts && posts.length > 0 ? posts.map((post) => {
                            return (
                                <Post key={post._id}
                                    postImage={post.image.url}
                                    postId={post._id}
                                    caption={post.caption}
                                    likes={post.likes}
                                    comments={post.comments}
                                    ownerImage={post.ownerId.avatar.url}
                                    ownerId={post.ownerId._id}
                                    ownerName={post.ownerId.name}
                                    isAccount={true}
                                    isDelete={true}
                                />
                            )

                        }) :
                            <Typography variant='h6'>Post something</Typography>
                    }
                </div>

                <div className="accountright">

                    <Avatar src={user.avatar.url} sx={{ height: "8vamx", width: "8vamx" }} />
                    <Typography variant='h6' >{user.name}</Typography>

                    <div>
                        <button onClick={() => { setFollowersToggle(true) }}
                        >
                            <Typography>Followers</Typography>
                        </button>
                        <Typography>{user.followers.length}</Typography>
                    </div>

                    <div>
                        <button onClick={() => { setFollowingToggle(true) }}
                        >
                            <Typography>Followings</Typography>
                        </button>
                        <Typography>{user.followings.length}</Typography>
                    </div>

                    <div>
                        <Typography>Posts</Typography>
                        <Typography>{user.posts.length}</Typography>
                    </div>

                    <Button variant='contained' onClick={logoutHandler}>Logout</Button>
                    <Link to='/update/profile'>Edit Profile</Link>
                    <Link to='/update/password'>Update Password</Link>
                    <Button variant='text'
                        style={{ color: "red", margin: "2vmax" }}
                        disabled={deleteLoading}
                        onClick={deleteProfileHandler}>
                        Delete my profile
                    </Button>

                    {/* dialog box for follower */}

                    <Dialog open={followersToggle} onClose={() => { setFollowersToggle(!followersToggle) }}>
                        <div className="DialogBox">
                            <Typography variant='h6'>Followers</Typography>
                            {
                                user && user.followers.length > 0 ?
                                    user.followers.map((follower) => {

                                        return (
                                            <User
                                                key={follower._id}
                                                avatar={follower.avatar.url}
                                                userId={follower._id}
                                                name={follower.name}
                                            />
                                        )
                                    }) : <Typography variant='h6'>You have no Followers</Typography>
                            }
                        </div>
                    </Dialog>

                    {/* dialog box for followeings */}

                    <Dialog open={followingToggle} onClose={() => { setFollowingToggle(!followingToggle) }}>
                        <div className="DialogBox">
                            <Typography variant='h6'>Followed Users</Typography>

                            {
                                user && user.followings.length > 0 ?
                                    user.followings.map((following) => {

                                        return (
                                            <User
                                                key={following._id}
                                                avatar={following.avatar.url}
                                                userId={following._id}
                                                name={following.name}
                                            />
                                        )
                                    }) : <Typography variant='h6'>You do not follow anyone</Typography>

                            }
                        </div>
                    </Dialog>

                </div>
            </div>
    )

}

export default Account