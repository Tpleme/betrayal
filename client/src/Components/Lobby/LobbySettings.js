import React, { useEffect, useState } from 'react'
import CustomTooltip from '../Misc/CustomTooltip'
import NumberRange from '../Inputs/NumberRange/NumberRange'
import { copyTextToClipboard } from '../../utils'
import { editEntity, getEntity } from '../../API/requests'
import ChangeLobbyPassword from '../Dialogs/Lobby/ChangeLobbyPassword'
import Button from '../Buttons/Button'

import './LobbySettings.css'

function LobbySettings(props) {
    const [maxPlayers, setMaxPlayers] = useState(6)
    const [roomInfo, setRoomInfo] = useState(null)
    const [openChangePassword, setOpenChangePassword] = useState(false)
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        getEntity('gameRoom', props.lobby.roomId).then(res => {
            console.log(res)
            setRoomInfo(res.data)
            setMaxPlayers(res.data.max_players)
        }, err => {
            console.log(err)
        })
    }, [props.lobby, refresh])

    const maxPlayerOnChange = value => {
        if (value >= 2 && value <= 6) {
            editEntity('gameRoom', props.lobby.roomId, { max_players: value }).then(() => {
                setMaxPlayers(value)
            }, err => {
                console.log(err)
            })
        }
    }

    return (
        roomInfo &&
        <div className='lobby-settings-main-div'>
            <CustomTooltip title='Click to copy to clipboard'>
                <div className='lobby-settings-join-url' onClick={() => copyTextToClipboard(`${process.env.REACT_APP_CLIENT_URL}/join-room?id=${props.lobby.roomSocket}`)}>
                    <p>URL to join</p>
                    <p>{`${process.env.REACT_APP_CLIENT_URL}/join-room?id=${props.lobby.roomSocket}`}</p>
                </div>
            </CustomTooltip>
            <NumberRange label='Max Players' min={2} max={6} onChange={(e) => maxPlayerOnChange(e)} value={maxPlayers} />
            <Button label={roomInfo.password ? 'Change Password' : 'Set Password'} onClick={() => setOpenChangePassword(true)} />
            {roomInfo &&
                <ChangeLobbyPassword open={openChangePassword} close={() => setOpenChangePassword(false)} room={roomInfo} refresh={() => setRefresh(!refresh)} />
            }
        </div>
    )
}

export default LobbySettings