import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { PasswordTextField } from '../../../Inputs/TextField/TextField'
import useGlobalSnackbar from '../../../../Hooks/useGlobalSnackbar'
import { updatePassword } from '../../../../API/requests'
import Button from '../../../Buttons/Button'

import './EditProfile.css'

function ChangePassword(props) {
    const { control, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const { showSnackbar } = useGlobalSnackbar()
    const [loading, setLoading] = useState(false)

    const onSubmit = data => {

        setLoading(true)

        updatePassword(props.user.id, data).then(res => {
            reset()
            showSnackbar({ message: res.data })
            setLoading(false)
        }, err => {
            console.log(err)
            showSnackbar({ message: 'Error changing your password, click view to see more info', description: err.response ? err.response : 'Could not communicate with the server', variant: "error" })
            setLoading(false)
        })
    }


    return (
        <form className='edit-profile-main-div' onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name='newPassword'
                defaultValue=''
                rules={{
                    required: 'Mandatory field',
                    pattern: { value: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20})/, message: 'Password must have at least 8 characters with uppercase, lowercase and numbers' }
                }}
                render={({ field: { value, onChange } }) => (
                    <PasswordTextField
                        label='New password'
                        value={value}
                        onChange={onChange}
                        error={errors.newPassword}
                        helperText={errors.newPassword && errors.newPassword?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name='confirmPassword'
                defaultValue=''
                rules={{
                    required: 'Mandatory field',
                    validate: pass => {
                        if (watch('newPassword') !== pass) {
                            return "Passwords do not match"
                        }
                    }
                }}
                render={({ field: { value, onChange } }) => (
                    <PasswordTextField
                        label='Confirm your new password'
                        value={value}
                        onChange={onChange}
                        error={errors.confirmPassword}
                        helperText={errors.confirmPassword && errors.confirmPassword?.message}
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
                        label='Current password'
                        style={{ marginTop: 'auto' }}
                        value={value}
                        onChange={onChange}
                        error={errors.authPassword}
                        helperText='Confirm your identity with your password'
                    />
                )}
            />
            <Button loading={loading} label='Submit' type='submit' />
        </form>
    )
}

export default ChangePassword