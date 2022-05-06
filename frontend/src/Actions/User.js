import axios from "axios";


export const loginUser = (email, password) => async (dispatch) => {

    try {
        dispatch({
            type: "LoginRequest",
        });

        const { data } = await axios.post(
            "/api/v1/login",
            { email, password },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        dispatch({
            type: "LoginSuccess",
            payload: data.user,
        });
    } catch (error) {
        dispatch({
            type: "LoginFailure",
            payload: error.response.data.message,
        });
    }
};
export const loadUser = () => async (dispatch) => {

    try {
        dispatch({
            type: "LoadUserRequest",
        });

        const { data } = await axios.get("/api/v1/my/profile");

        dispatch({
            type: "LoadUserSuccess",
            payload: data.user,
        });
    } catch (error) {
        dispatch({
            type: "LoadUserFailure",
            payload: error.response.data.message,
        });
    }
};


export const registerUser = (email, password, name, avatar) => async (dispatch) => {

    try {
        dispatch({
            type: "RegisterRequest",
        });


        const { data } = await axios.post(
            "/api/v1/register",
            { email, password, name, avatar },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        dispatch({
            type: "RegisterSuccess",
            payload: data.user,
        });

    } catch (error) {
        dispatch({
            type: "RegisterFailure",
            payload: error.response.data.message,
        });

    }
};


export const updateProfile = (name, email, avatar) => async (dispatch) => {

    try {
        dispatch({
            type: "updateProfileRequest",
        });


        const { data } = await axios.put(
            "/api/v1/update/profile",
            { name, email, avatar },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        dispatch({
            type: "updateProfileSuccess",
            payload: data.message,
        });

    } catch (error) {
        dispatch({
            type: "updateProfileFailure",
            payload: error.response.data.message,
        });

    }
};

export const deleteMyProfile = () => async (dispatch) => {


    try {


        dispatch({
            type: 'deleteProfileRequest'
        })

        const { data } = await axios.delete('/api/v1/delete/profile')

        dispatch({
            type: 'deleteProfileSuccess',
            payload: data.message
        })
    }
    catch (error) {
        dispatch({
            type: 'deleteProfileFailure',
            payload: error.response.data.message
        })
    }
}

export const updatePassword = (oldPassword, newPassword) => async (dispatch) => {

    try {
        dispatch({
            type: "updatePaawordRequest",
        });


        const { data } = await axios.put(
            "/api/v1/update/password",
            { oldPassword, newPassword },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        dispatch({
            type: "updatePaawordSuccess",
            payload: data.message,
        });

    } catch (error) {
        dispatch({
            type: "updatePaawordFailure",
            payload: error.response.data.message,
        });

    }
};

export const forgotPassword = (email) => async (dispatch) => {

    try {
        dispatch({
            type: "forgotPasswordRequest",
        });


        const { data } = await axios.post(
            "/api/v1/forgot/password",
            { email },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        dispatch({
            type: "forgotPasswordSuccess",
            payload: data.message,
        });

    } catch (error) {
        dispatch({
            type: "forgotPasswordFailure",
            payload: error.response.data.message,
        });

    }
};


export const resetPassword = (token, password) => async (dispatch) => {

    try {
        dispatch({
            type: "resetPasswordRequest",
        });


        const { data } = await axios.put(
            `/api/v1/password/reset/${token}`,
            { password },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        dispatch({
            type: "resetPasswordSuccess",
            payload: data.message,
        });

    } catch (error) {
        dispatch({
            type: "resetPasswordFailure",
            payload: error.response.data.message,
        });

    }
};

export const logoutUser = () => async (dispatch) => {

    try {
        dispatch({
            type: "LogoutUserRequest",
        });

        axios.get('/api/v1/logout')

        dispatch({
            type: "LogoutUserSuccess",
        });
    } catch (error) {
        dispatch({
            type: "LogoutUserFailure",
            payload: error.response.data.message,
        });
    }
};

export const getFollowingPost = () => async (dispatch) => {

    try {
        dispatch({
            type: "postOfFollowingRequest",
        })

        //api call

        const { data } = await axios.get('/api/v1/posts')

        dispatch({
            type: "postOfFollowingSuccess",
            payload: data.posts
        })

    } catch (error) {
        dispatch({
            type: "postOfFollowingFailure",
            payload: error.response.data.message
        })

    }
}


export const getMyPosts = () => async (dispatch) => {

    try {
        dispatch({
            type: "myPostsRequest",
        })

        //api call

        const { data } = await axios.get('/api/v1/my/posts')

        dispatch({
            type: "myPostsSuccess",
            payload: data.posts
        })

    } catch (error) {
        dispatch({
            type: " myPostsFailure",
            payload: error.response.data.message
        })

    }
}
export const getAllUser = (name = " ") => async (dispatch) => {

    try {
        dispatch({
            type: "allUsersRequest",
        })

        //api call

        const { data } = await axios.get(`/api/v1/users?name=${name}`)

        dispatch({
            type: "allUsersSuccess",
            payload: data.users
        })

    } catch (error) {
        dispatch({
            type: "allUsersFailure",
            payload: error.response.data.message
        })

    }
}

export const getUserProfile = (id) => async (dispatch) => {

    try {
        dispatch({
            type: "userProfileRequest",
        })
        //api call

        const { data } = await axios.get(`/api/v1/user/${id}`)


        dispatch({
            type: "userProfileSuccess",
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: "userProfileFailure",
            payload: error.response.data.message
        })

    }
}

export const getUserPosts = (id) => async (dispatch) => {

    try {
        dispatch({
            type: "userPostsRequest",
        })

        //api call

        const { data } = await axios.get(`/api/v1/userposts/${id}`)


        dispatch({
            type: "userPostsSuccess",
            payload: data.posts
        })

    } catch (error) {
        dispatch({
            type: "userPostsFailure",
            payload: error.response.data.message
        })

    }
}

export const followAndUnfollowUser = (id) => async (dispatch) => {

    try {
        dispatch({
            type: "followUserRequest",
        })

        //api call

        const { data } = await axios.get(`/api/v1//follow/${id}`)


        dispatch({
            type: "followUserSuccess",
            payload: data.message
        })

    } catch (error) {
        dispatch({
            type: "followUserFailure",
            payload: error.response.data.message
        })

    }
}