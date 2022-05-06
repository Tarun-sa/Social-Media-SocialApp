import React, { useEffect, useState } from 'react'
import { Avatar, Typography, Button, Dialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { followAndUnfollowUser, getUserPosts, getUserProfile, } from '../../Actions/User';
import Loader from '../Loader/Loader'
import Post from '../Post/Post'
import '../Account/Account.css'
import { useAlert } from 'react-alert'
import User from '../User/User'
import { useParams } from 'react-router-dom';

const UserProfile = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const params = useParams();


    const { user: me } = useSelector((state) => state.user)

    const {
        user,
        loading: userLoading,
        error: userError,
    } = useSelector((state) => state.userProfile);



    const { loading, posts, error } = useSelector((state) => state.userPosts)

    const { error: followError, message, loading: followLoading } = useSelector((state) => state.like)


    const [followersToggle, setFollowersToggle] = useState(false)
    const [followingToggle, setFollowingToggle] = useState(false)
    const [following, setFollowing] = useState(false)
    const [myProfile, setMyProfile] = useState(false)

    useEffect(() => {
        dispatch(getUserPosts(params.id));
        dispatch(getUserProfile(params.id));

    }, [dispatch, params.id]);

    useEffect(() => {
        if (me._id === params.id) {
            setMyProfile(true);
        }
        // if (user) {
        //     const follower = user.followers.find((item) => {
        //         if (item._id === me._id) {
        //             return item
        //         }
        //     });
        //     if (follower) {
        //         setFollowing(true)
        //     }
        // }
        if (user) {
            user.followers.forEach((item) => {
                if (item._id === me._id) {
                    setFollowing(true);
                } else {
                    setFollowing(false);
                }
            });
        }
    }, [user, me._id, params.id]);

    // for like ans unlike message
    useEffect(() => {
        if (userError) {
            alert.error(userError)
            dispatch({ type: 'clearError' })
        }
        if (followError) {
            alert.error(followError)
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
    }, [alert, error, followError, userError, message, dispatch])


    const followHandler = async () => {
        setFollowing(!following)

        await dispatch(followAndUnfollowUser(params.id))
        dispatch(getUserProfile(params.id))
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

                                />
                            )

                        }) :
                            <Typography variant='h6'>Post something</Typography>
                    }
                </div>

                <div className="accountright">
                    {user && <>
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

                        {
                            myProfile ? null :
                                <Button variant='contained'
                                    disabled={followLoading}
                                    onClick={followHandler}
                                    style={{ background: following ? "Red" : "Green" }}>
                                    {following ? "Unfollow" : "Follow"}
                                </Button>
                        }

                    </>}


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

                    {/* dialog box for followings */}

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
export default UserProfile