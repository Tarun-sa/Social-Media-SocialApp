import { Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUser, getFollowingPost } from '../../Actions/User'
import Loader from '../Loader/Loader'
import Post from '../Post/Post'
import User from '../User/User'
import './Home.css'
import { useAlert } from 'react-alert'

const Home = () => {

    const dispatch = useDispatch()
    const alert = useAlert();

    const { loading, posts, error } = useSelector((state) => state.postOfFollowing)
    const { users, loading: usersLoading } = useSelector((state) => state.allUser)
    const { error: likeError, message } = useSelector((state) => state.like)



    //for getting users and posts
    useEffect(() => {
        dispatch(getFollowingPost())
        dispatch(getAllUser())
    }, [dispatch])

    // for like ans unlike message
    useEffect(() => {
        if (likeError) {
            alert.error(error)
            dispatch({ type: 'clearError' })
        }
        if (message) {
            alert.success(message)
            dispatch({ type: 'clearMessage' })
        }
    }, [alert, error, message, dispatch])



    return (
        loading === true || usersLoading === true ? <Loader /> :
            <div className='home'>

                <div className="homeleft">
                    {
                        posts && posts.length > 0 ?
                            posts.map((post) => {
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
                            }) : <Typography variant='h6'>No Post to display</Typography>
                    }
                </div>

                <div className="homeright">
                    {
                        users && users.length > 0 ?
                            users.map((user) => {
                                return (
                                    <User key={user._id} avatar={user.avatar.url} userId={user._id} name={user.name} />
                                )
                            }) :
                            <Typography >No Users to Display</Typography>
                    }
                </div>
            </div>

    )

}

export default Home