import React, { useEffect, useState } from 'react'
import CustomTooltip from '../Misc/CustomTooltip'
import NumberRange from '../Inputs/NumberRange/NumberRange'
import { copyTextToClipboard } from '../../utils'
import { editEntity, getEntity } from '../../API/requests'
import ChangeLobbyPassword from '../Dialogs/Lobby/ChangeLobbyPassword'
import Button from '../Buttons/Button'
import LobbyInvitePeople from '../Dialogs/Lobby/LobbyInvitePeople'
import ChangeHost from '../Dialogs/Lobby/ChangeHost'

import './LobbySettings.css'

function LobbySettings(props) {
    const [maxPlayers, setMaxPlayers] = useState(6)
    const [roomInfo, setRoomInfo] = useState(null)
    const [openChangePassword, setOpenChangePassword] = useState(false)
    const [openInvite, setOpenInvite] = useState(false)
    const [openChangeHost, setOpenChangeHost] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [min, setMin] = useState(2)

    useEffect(() => {
        getEntity({ entity: 'gameRoom', id: props.lobby.roomId }).then(res => {
            setRoomInfo(res.data)
            setMaxPlayers(res.data.max_players)
        }, err => {
            console.log(err)
        })
    }, [props.lobby, refresh])

    const maxPlayerOnChange = value => {
        const minValue = props.players.length > 2 ? props.players.length : 2
        setMin(minValue)

        if (value >= minValue && value <= 6) {
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
            <NumberRange label='Max Players' min={min} max={6} onChange={(e) => maxPlayerOnChange(e)} value={maxPlayers} />
            <div className='lobby-settings-buttons'>
                <Button label={roomInfo.password ? 'Change Password' : 'Set Password'} onClick={() => setOpenChangePassword(true)} />
                <Button label='Invite people' onClick={() => setOpenInvite(true)} />
                <Button label='Change Host' onClick={() => setOpenChangeHost(true)} />
            </div>
            {roomInfo &&
                <>
                    <ChangeLobbyPassword open={openChangePassword} close={() => setOpenChangePassword(false)} room={roomInfo} refresh={() => setRefresh(!refresh)} />
                    <LobbyInvitePeople open={openInvite} close={() => setOpenInvite(false)} room={roomInfo} />
                    <ChangeHost open={openChangeHost} close={() => setOpenChangeHost(false)} players={props.players} room={roomInfo} socket={props.socket} />
                </>
            }
        </div>
    )
}

export default LobbySettings