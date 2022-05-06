import React, { useEffect, useState } from 'react'
import './NewPost.css'
import { Typography, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { createNewPost } from '../../Actions/Post'
import { useAlert } from 'react-alert'
import { loadUser } from '../../Actions/User'
const NewPost = () => {

    const dispatch = useDispatch();
    const alert = useAlert();

    const [caption, setCaption] = useState(" ")
    const [image, setImage] = useState();

    const { loading, error, message } = useSelector((state) => state.like)

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        const Reader = new FileReader();
        Reader.readAsDataURL(file);

        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setImage(Reader.result)
            }
        }
    }


    const submitHandler = async (e) => {
        e.preventDefault();
        await dispatch(createNewPost(caption, image));
        dispatch(loadUser());


    };

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch({ type: 'clearError' })
        }
        if (message) {
            alert.success(message)
            dispatch({ type: 'clearMessage' })
        }
    }, [alert, error, message, dispatch])

    return (
        <div className='newPost'>
            <form action="" className="newPostForm" onSubmit={submitHandler}>
                <Typography variant='h6'>New Post</Typography>
                {image && <img src={image} alt="post" />}
                <input type="file" accept='image/*' onChange={handleImageChange} />
                <input type="text" placeholder='caption...' value={caption} onChange={(e) => setCaption(e.target.value)} autoComplete="on" />
                <Button type="submit" disabled={loading}>Add Post</Button>
            </form>
        </div>
    )
}

export default NewPost