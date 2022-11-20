import React, { useState } from 'react'
import DialogPrefab from '../DialogPrefab'
import { PasswordTextField } from '../../Inputs/TextField/TextField'
import MainMenuButton from '../../Buttons/Button'

function PasswordDialog(props) {
    const [password, setPassword] = useState('')

    const onSubmit = () => {
        if (password.length > 0) {
            props.submit(props.savedRoomId, password)
            return;
        }
    }

    return (
        <DialogPrefab
            open={props.open}
            close={props.close}
            maxWidth='xs'
        >
            <div className='create-room-dialog'>
                <PasswordTextField autoFocus value={password} onChange={(e) => setPassword(e.target.value)} onEnter={() => onSubmit()} />
                <MainMenuButton disabled={password.length === 0} label='Join room' onClick={onSubmit} />
            </div>
        </DialogPrefab>
    )
}

export default PasswordDialog