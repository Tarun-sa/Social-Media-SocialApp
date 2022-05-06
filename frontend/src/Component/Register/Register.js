import React, { useEffect, useState } from 'react'
import { Typography, Button, Avatar } from '@mui/material'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { registerUser } from '../../Actions/User'
import './Register.css'


const Register = () => {

    const [name, setName] = useState(" ")
    const [avatar, setAvatar] = useState(" ")
    const [email, setEmail] = useState(" ")
    const [password, setPassword] = useState(" ")

    const alert = useAlert();

    const dispatch = useDispatch();
    const { loading, error, message } = useSelector((state) => state.user)

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        const Reader = new FileReader();
        Reader.readAsDataURL(file);

        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setAvatar(Reader.result)
            }
        }
    }

    const registerHandler = (e) => {
        e.preventDefault()
        dispatch(registerUser(email, password, name, avatar))
    }


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
        <div className='register'>

            <form className='registerForm' onSubmit={registerHandler}>
                <Typography variant='h3' style={{ padding: "2vmax" }}>Social App</Typography>

                <Avatar
                    src={avatar}
                    alt="user"
                    sx={{ height: "10vmax", width: "10vmax" }}
                />

                <input type="file" accept='image/*' onChange={handleImageChange} />

                <input
                    type="text"
                    value={name}
                    placeholder="Name"
                    className="registerInputs"
                    required
                    onChange={(e) => setName(e.target.value)}
                />

                <input type="email"
                    className='registerInputs'
                    placeholder='email'
                    required
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }} />

                <input
                    type="password"
                    className="registerInputs"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Link to='/'><Typography>Already SignedUp? Login Now</Typography></Link>
                <Button disabled={loading} type='submit'>Sign Up</Button>


            </form>
        </div>
    )
}

export default Register