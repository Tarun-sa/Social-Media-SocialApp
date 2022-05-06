import "./ResetPassword.css";
import React, { useEffect, useState } from "react";
import { Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { resetPassword } from "../../Actions/User";
import { useParams, Link } from "react-router-dom";


const ResetPassword = () => {

    const [newPassword, setNewPassword] = useState("");

    const dispatch = useDispatch();
    const alert = useAlert();
    const { token } = useParams();
    console.log(token);

    const { error, loading, message } = useSelector((state) => state.like);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(resetPassword(token, newPassword))


    };

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
        <div className="resetPassword">
            <form className="resetPasswordForm" onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: "2vmax" }}>
                    Social Aap
                </Typography>

                <input
                    type="password"
                    placeholder="New Password"
                    required
                    className="resetPasswordInputs"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <Link to='/account'>Login</Link>
                <p>Or</p>
                <Link to='/forgot/password'>Request another token</Link>
                <Button disabled={loading} type="submit">
                    Reset Password
                </Button>
            </form>
        </div>
    );
};

export default ResetPassword