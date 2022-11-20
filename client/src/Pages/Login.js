import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../API/requests'
import useToken from '../Hooks/useToken'
import useGlobalSnackbar from '../Hooks/useGlobalSnackbar'
import { TextField, PasswordTextField } from '../Components/Inputs/TextField/TextField'
import { Controller, useForm } from 'react-hook-form'
import Button from '../Components/Buttons/Button'

import { SocketContext } from '../Context/socket/socket'

import './css/Login.css'


export default function Login() {
    const [submitting, setSubmitting] = useState(false)

    const { setToken } = useToken()
    const navigate = useNavigate()
    const { triggerSnackbar } = useGlobalSnackbar()
    const socket = useContext(SocketContext)
    const { control, handleSubmit, formState: { errors } } = useForm();

    const submit = (data) => {
        setSubmitting(true)

        loginUser(data.email, data.password).then((res) => {
            setToken({ token: res.headers.key })
            sessionStorage.setItem('id', res.headers.id)
            socket.auth = { uuid: res.headers.id, name: res.headers.username, token: res.headers.key }
            socket.connect()
            setSubmitting(false)
            navigate('/', { replace: true })
        }, err => {
            console.log(err)
            setSubmitting(false)
            triggerSnackbar(err.response ? err.response.data : 'Cannot communicate with the server, please try again later', '', "error", { vertical: 'bottom', horizontal: 'center' }, false)
        })
    }

    useEffect(() => {
        sessionStorage.removeItem('token')
        setToken(null)
        if (socket.connected) socket.disconnect()
    }, [])


    const autoLogin = () => { //TODO: Remover antes do deploy
        handleSubmit(
            {
                target: [
                    { value: 'tpleme@hotmail.com' },
                    { value: 'asd' },
                    { value: 'passWORD123' },
                ],
                preventDefault: () => console.log('preventing default')
            }
        )
    }


    return (
        <div className='login-main-container'>
            <form className='login-form' onSubmit={handleSubmit(submit)}>
                <Controller
                    control={control}
                    name='email'
                    defaultValue=''
                    rules={{
                        required: 'Email required',
                        pattern: { value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: 'Invalid Email' }
                    }}
                    render={({ field: { value, onChange } }) => (
                        <TextField
                            autoFocus={true}
                            label='Email'
                            name='email'
                            onChange={onChange}
                            value={value}
                            error={errors.email}
                            helperText={errors.email && errors.email?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name='password'
                    defaultValue=''
                    rules={{
                        required: 'Password required',
                    }}
                    render={({ field: { value, onChange } }) => (
                        <PasswordTextField

                            style={{ marginTop: 'auto' }}
                            name='password'
                            onChange={onChange}
                            value={value}
                            error={errors.password}
                            helperText={errors.password && errors.password?.message}
                        />
                    )}
                />
                <button type='button' onClick={autoLogin}>asdasd</button>
                <div className='login-btn'>
                    <Button label='Login' type='submit' loading={submitting} />
                </div>
            </form>
        </div>
    )
}
