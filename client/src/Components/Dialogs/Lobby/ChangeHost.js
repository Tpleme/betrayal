import React, { useEffect, useState } from 'react'
import Button from '../../Buttons/Button'
import DialogPrefab from '../DialogPrefab'

import './ChangeHost.css'

function ChangeHost(props) {
    const [selectedPlayer, setSelectedPlayer] = useState(null)
    const [host, setHost] = useState(null)

    const checkButton = () => {
        return selectedPlayer.user.id === host.user.id
    }

    useEffect(() => {
        const host = props.players.find(player => player.user.hosting === props.room.id)
        setHost(host)
        setSelectedPlayer(host)
    }, [props.players])

    const setNewHost = () => {
        props.socket.emit('change-host')
    }

    return (
        <DialogPrefab
            open={props.open}
            close={props.close}
            maxWidth='xs'
        >
            {host &&
                <div className='change-host-main-div'>
                    <p className='change-host-title'>Select the player that you want to become the new game host</p>
                    <div className='change-host-players-div'>
                        {props.players.map(player => {
                            return (
                                <div
                                    key={player.user.id}
                                    className={`change-host-player${player.user.id === selectedPlayer.user.id ? ' selected' : ''}`}
                                    onClick={() => setSelectedPlayer(player)}
                                >
                                    <p>{player.user.name}</p>
                                    {host.user.id === player.user.id ? <p className='change-host-host-info'>Current Host</p> : ''}
                                </div>
                            )
                        })}
                    </div>
                    <Button disabled={checkButton()} style={{ maxWidth: '100%', padding: '0 10px' }} label={`Set ${selectedPlayer.user.name} as new host`} />
                </div>
            }
        </DialogPrefab>
    )
}

export default ChangeHost