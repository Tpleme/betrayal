import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { loginUser } from '../Components/Requests/StandardRequests'
import { removeCookies, setCookies } from '../Components/User/UserLog'
import useToken from '../Components/CustomHooks/useToken'

export default function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const { setToken } = useToken()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(e.target[0].value)
        console.log(e.target[2].value)
        loginUser(e.target[0].value, e.target[2].value).then((res) => {
            console.log(res)
            setToken({ token: res.headers.key })
            setCookies(res.headers.user, res.headers.id, res.headers.email)
            console.log(res.headers.user, res.headers.id, res.headers.email)
            navigate('/', { replace: true })
        }, err => {
            console.log(err)
        })
    }

    useEffect(() => {
        setToken(null)
        removeCookies()
    }, [])

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                required
                autoFocus
                id='email'
                name='email'
                label='Email'
                color='secondary'
                fullWidth
                size='small'
                type='email'
                variant='outlined'
            />
            <TextField
                variant='outlined'
                required
                id='password'
                label='Password'
                name='password'
                fullWidth
                size='small'
                color='secondary'
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                autoComplete='current-password'
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position='end'>
                            <IconButton
                                tabIndex={-1}
                                aria-label='toggle password visibility'
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
            <button type='submit' >Login</button>
        </form>
    )
}
