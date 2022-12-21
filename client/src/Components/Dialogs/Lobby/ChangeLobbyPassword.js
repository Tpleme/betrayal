import React, { useState } from 'react'
import DialogPrefab from '../DialogPrefab'
import Button from '../../Buttons/Button'
import { PasswordTextField } from '../../Inputs/TextField/TextField'
import { changeRoomPassword } from '../../../API/requests'
import CustomSwitch from '../../Inputs/Switch/CustomSwitch'

import './ChangeLobbyPassword.css'

function ChangeLobbyPassword(props) {
    const [password, setPassword] = useState('')
    const [authPass, setAuthPass] = useState('')
    const [hasPassword, setHasPassword] = useState(props.room.password)

    const handleSwitch = (e) => {
        const value = e.target.checked

        setHasPassword(value)
        if (!value) {
            setPassword('')
            setAuthPass('')
        }
    }

    const checkSubmitBtn = () => {
        if (!hasPassword && props.room.password) {
            return authPass.length >= 6
        }
        if (hasPassword && props.room.password) {
            return password.length >= 6 && authPass.length >= 6
        }
        if (!hasPassword && !props.room.password) {
            return false
        }
        if (hasPassword && !props.room.password) {
            return password.length >= 6
        }
    }

    const onsubmit = () => {
        console.log(password)
        console.log(authPass)

        changeRoomPassword(props.room.id, { password, authPass }).then(res => {
            console.log(res)
            props.refresh()
        }, err => {
            console.log(err)
        })
    }

    const getFields = () => {
        if (hasPassword && !props.room.password) {
            return (
                <>
                    <PasswordTextField value={password} onChange={(e) => setPassword(e.target.value)} helperText='Type new password here, minimum 6 characters' />
                    <Button disabled={!checkSubmitBtn()} label='Add Password' onClick={onsubmit} />
                </>
            )

        }
        if (hasPassword && props.room.password) {
            return (
                <>
                    <PasswordTextField value={password} onChange={(e) => setPassword(e.target.value)} helperText='Type new password here, minimum 6 characters' />
                    <PasswordTextField label='Current Password' value={authPass} onChange={(e) => setAuthPass(e.target.value)} helperText='Confirm the current room password' />
                    <Button disabled={!checkSubmitBtn()} label='Change Password' onClick={onsubmit} />
                </>
            )
        }
        if (!hasPassword && props.room.password) {
            return (
                <>
                    <PasswordTextField label='Current Password' value={authPass} onChange={(e) => setAuthPass(e.target.value)} helperText='Confirm the current room password' />
                    <Button disabled={!checkSubmitBtn()} label='Remove password' onClick={onsubmit} />
                </>
            )
        }
        if (!hasPassword && !props.room.password) {
            return <></>
        }
    }

    return (
        <DialogPrefab
            open={props.open}
            close={props.close}
            maxWidth='xs'
        >
            <div className='change-lobby-pass-main-div'>
                {props.room.password ?
                    <p className='change-lobby-pass-title'>This room is protected by a password, you can change it or remove the password</p>
                    :
                    <p className='change-lobby-pass-title'>This room has no password, you can add one here</p>
                }
                <div className='change-lobby-pass-switch'>
                    <p>Password?</p>
                    <CustomSwitch checked={hasPassword} onChange={handleSwitch} />
                </div>
                <div className='change-lobby-pass-content'>
                    {getFields()}
                </div>
            </div>
        </DialogPrefab>
    )
}

export default ChangeLobbyPassword