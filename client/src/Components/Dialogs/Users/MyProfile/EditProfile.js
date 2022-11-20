import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TextField, PasswordTextField } from '../../../Inputs/TextField/TextField'
import useGlobalSnackbar from '../../../../Hooks/useGlobalSnackbar'
import { editEntity } from '../../../../API/requests'
import Button from '../../../Buttons/Button'

import './EditProfile.css'

function EditProfile(props) {
    const { control, handleSubmit, reset, formState: { errors } } = useForm();
    const { showSnackbar } = useGlobalSnackbar()
    const [loading, setLoading] = useState(false)

    const onSubmit = data => {

        setLoading(true)
        const changedData = {}
        for (const key in data) {
            if (data[key] !== props.user[key]) {
                changedData[key] = data[key]
            }
        }

        if (Object.keys(changedData).length === 1) {
            showSnackbar({ message: 'No changes detected', variant: 'default' })
            setLoading(false)
            return;
        }

        editEntity('users', props.user.id, changedData).then(res => {
            props.refresh()
            showSnackbar({ message: res.data })
            setLoading(false)
        }, err => {
            console.log(err)
            showSnackbar({ message: 'Error trying to update info, click view to see more info', description: err.response ? err.response : 'Could not communicate with the server', variant: "error"})
            setLoading(false)
        })

    }


    return (
        <form className='edit-profile-main-div' onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name='name'
                defaultValue={props.user.name}
                rules={{
                    required: 'Mandatory field',
                }}
                render={({ field: { value, onChange } }) => (
                    <TextField
                        label='Name'
                        name='name'
                        onChange={onChange}
                        value={value}
                        error={errors.name}
                        helperText={errors.name && errors.name?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name='email'
                defaultValue={props.user.email}
                rules={{
                    required: 'Mandatory field',
                    pattern: { value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: 'Invalid Email' }
                }}
                render={({ field: { value, onChange } }) => (
                    <TextField
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
                name='authPassword'
                defaultValue=''
                rules={{
                    required: 'Mandatory field',
                }}
                render={({ field: { value, onChange } }) => (
                    <PasswordTextField
                        style={{ marginTop: 'auto' }}
                        name='authPassword'
                        onChange={onChange}
                        value={value}
                        error={errors.authPassword}
                        helperText='Confirm your identity with your password'
                    />
                )}
            />
            <Button loading={loading} label='Submit' type='submit' />
        </form>
    )
}

export default EditProfile