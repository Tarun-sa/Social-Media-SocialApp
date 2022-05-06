import { Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import '../Home/Home.css'

const User = ({ avatar, userId, name }) => {
    return (
        <Link to={`/user/${userId}`} className='homeUser'>
            <img src={avatar} alt={name} />
            <Typography>{name}</Typography>
        </Link>
    )
}

export default User