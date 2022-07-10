import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { loginUser } from '../API/requests'
import useToken from '../Hooks/useToken'
import useGlobalSnackbar from '../Hooks/useGlobalSnackbar'

import { SocketContext } from '../Context/socket/socket'

import './css/Login.css'


export default function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const { setToken } = useToken()
    const navigate = useNavigate()
    const { triggerSnackbar } = useGlobalSnackbar()
    const socket = useContext(SocketContext)

    const handleSubmit = (e) => {
        e.preventDefault()

        setSubmitting(true)

        loginUser(e.target[0].value, e.target[2].value).then((res) => {
            setToken({ token: res.headers.key })
            socket.auth = { uuid: res.headers.id, name: res.headers.username, token: res.headers.key }
            socket.connect()
            setSubmitting(false)
            navigate('/', { replace: true })
        }, err => {
            console.log(err)
            setSubmitting(false)
            triggerSnackbar(err.response ? err.response.data : 'Cannot communicate with the server, please try again later', '', "error", { vertical: 'bottom', horizontal: 'center' }, false )
        })
    }


    useEffect(() => {
        sessionStorage.removeItem('token')
        setToken(null)
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
