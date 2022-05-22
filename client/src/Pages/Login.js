import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { loginUser } from '../Components/Requests/StandardRequests'
import { removeCookies, setCookies } from '../Components/User/UserLog'
import useToken from '../Components/Hooks/useToken'
import useGlobalSnackbar from '../Components/Hooks/useGlobalSnackbar'

import './css/Login.css'

export default function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const { setToken } = useToken()
    const navigate = useNavigate()
    const { triggerSnackbar } = useGlobalSnackbar()

    const handleSubmit = (e) => {
        e.preventDefault()

        setSubmitting(true)

        loginUser(e.target[0].value, e.target[2].value).then((res) => {
            setToken({ token: res.headers.key })
            setCookies(res.headers.user, res.headers.id, res.headers.email)
            setSubmitting(false)
            navigate('/', { replace: true })
        }, err => {
            console.log(err)
            setSubmitting(false)
            triggerSnackbar(err.response ? err.response.data : 'Cannot communicate with the server, please try again later', '', "error", { vertical: 'bottom', horizontal: 'center' }, false)

        })
    }

    useEffect(() => {
        setToken(null)
        removeCookies()
    }, [])

    return (
        <div className='login-main-container'>
            <form className='login-form' onSubmit={handleSubmit}>
                <TextField
                    sx={{ margin: '10px' }}
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
                    sx={{ margin: '10px' }}
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
                <button disabled={submitting} className='login-button' type='submit'>Login</button>
            </form>
        </div>
    )
}
