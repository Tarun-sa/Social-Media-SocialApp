import React, { useState } from "react";

import { Typography, Button, } from '@mui/material'
import './Search.css'
import { useDispatch, useSelector } from "react-redux";
import { getAllUser } from "../../Actions/User";
import User from "../User/User";

const Search = () => {

    const [name, setName] = useState();
    const { users, loading: UserLoading } = useSelector((state) => state.allUser)
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(getAllUser(name))
    }
    return (
        <div className="search">
            <form className="searchForm" onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: "2vmax" }}>
                    Social Aap
                </Typography>




                <input
                    type="text"
                    value={name}
                    placeholder="Name"
                    className="searchInputs"
                    required
                    onChange={(e) => setName(e.target.value)}

                />


                <Button type="submit" disabled={UserLoading}>
                    Search
                </Button>
            </form>

            <div className="searchResults">
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

export default Search