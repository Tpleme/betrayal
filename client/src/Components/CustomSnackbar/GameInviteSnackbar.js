import React from 'react'
import { useSnackbar } from 'notistack'
import { Close } from '@mui/icons-material'

import './GameInviteSnackbar.css'
import Button from '../Buttons/Button'

export default function GameInviteSnackbar(props) {
    const { closeSnackbar } = useSnackbar();

    const data = JSON.parse(props.message)

    const joinRoom = () => {
        props.socket.emit('join-room', { roomId: data.room.socket, userId: data.userId, invited: true })
        closeSnackbar(props.id)
    }

    return (
        <div className='game-invite-snackbar-div'>
            <Close htmlColor='var(--light-yellow)' className='game-invite-snackbar-close-btn' onClick={() => closeSnackbar(props.id)} />
            <p className='game-invite-snackbar-text'>{`${data.hostingUser} has invited you to join a game`}</p>
            <div>
                <Button size='small' label='Join' onClick={joinRoom} />
                <Button size='small' label='Refuse' onClick={() => closeSnackbar(props.id)} />
            </div>
        </div>
    )
}