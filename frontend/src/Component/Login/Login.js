import React, { useState, useEffect } from 'react'
import './Login.css'
import { Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from '../../Actions/User'
import { useAlert } from "react-alert";

const Login = () => {
    const [email, setEmail] = useState(" ")
    const [password, setPassword] = useState(" ")

    const dispatch = useDispatch();
    const alert = useAlert();

    const { error } = useSelector((state) => state.user)

    const loginHandler = (event) => {
        event.preventDefault();
        dispatch(loginUser(email, password))
    }


    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch({ type: "clearErrors" });
        }
    }, [dispatch, error, alert]);


    return (
        <div className='login'>

            <form className='loginForm' onSubmit={loginHandler}>
                <Typography variant='h3' style={{ padding: "2vmax" }}>Social App</Typography>

                <input type="email"
                    placeholder='email'
                    required
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }} />

                <input type="password"
                    placeholder='password'
                    required
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                />
                <Link to='/forgot/password'>Forget Password?</Link>
                <Button type='submit'>Login</Button>
                <Link to='/register'> New User?</Link>

            </form>
        </div>
    )
}

export default Login