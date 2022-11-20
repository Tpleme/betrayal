import React, { useState } from 'react'
import DialogPrefab from '../DialogPrefab'
import { TextField } from '../../Inputs/TextField/TextField'
import BigButton from '../../Buttons/Button'

import './JoinRoomDialog.css'

function JoinRoomDialog(props) {
    const [roomId, setRoomId] = useState('')

    return (
        <DialogPrefab
            open={props.open}
            close={props.close}
            maxWidth='xs'
        >
            <div className='join-room-dialog'>
                <p className='join-room-title'>Type or paste the room id to be able to join</p>
                <TextField label='Room ID' autoFocus value={roomId} onChange={(e) => setRoomId(e.target.value)} onEnter={() => props.submit(roomId)} />
                <BigButton disabled={roomId.length === 0} label='Join room' onClick={() => props.submit(roomId)} />
            </div>
        </DialogPrefab>
    )
}

export default JoinRoomDialog