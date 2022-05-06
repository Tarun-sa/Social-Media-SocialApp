import React, { useState, useEffect } from 'react'
import './ForgotPassword.css'
import { Typography, Button } from '@mui/material'
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { forgotPassword } from '../../Actions/User';

const ForgotPassword = () => {
    const [email, setEmail] = useState(" ")


    const dispatch = useDispatch();
    const alert = useAlert();

    const { error, message, loading } = useSelector((state) => state.like)

    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(forgotPassword(email))
    }


    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch({ type: "clearErrors" });
        }
        if (message) {
            alert.success(message);
            dispatch({ type: "clearMessage" });
        }
    }, [dispatch, error, alert, message]);


    return (
        <div className='forgotPassword'>

            <form className='forgotPasswordForm' onSubmit={submitHandler}>
                <Typography variant='h3' style={{ padding: "2vmax" }}>Social App</Typography>

                <input type="email"
                    placeholder='email'
                    required
                    value={email}
                    className="forgotPasswordInputs"
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }} />



                <Button type='submit' disabled={loading}>Generate Token</Button>


            </form>
        </div>
    )
}

export default ForgotPassword 