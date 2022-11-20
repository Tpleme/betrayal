import React, { useState } from 'react'
import DialogPrefab from '../DialogPrefab'
import { PasswordTextField } from '../../Inputs/TextField/TextField'
import BigButton from '../../Buttons/Button'

import './CreateRoomDialog.css'

function CreateRoomDialog(props) {
    const [password, setPassword] = useState('')

    const onSubmit = () => {
        if (password.length > 0) {
            props.submit(password)
            return;
        }
        props.submit(null)
    }


    return (
        <DialogPrefab
            open={props.open}
            close={props.close}
            maxWidth='xs'
        >
            <div className='create-room-dialog'>
                <p className='create-room-title'>Protect your game room with a password. If you don't want to, just leave it blank</p>
                <PasswordTextField autoFocus value={password} onChange={(e) => setPassword(e.target.value)} onEnter={() => onSubmit()} />
                <BigButton label='Create room' onClick={onSubmit} />
            </div>
        </DialogPrefab>
    )
}

export default CreateRoomDialog