import React, { useEffect, useState } from 'react'
import CustomTooltip from '../Misc/CustomTooltip'
import NumberRange from '../Inputs/NumberRange/NumberRange'
import { copyTextToClipboard } from '../../utils'

import './LobbySettings.css'
import { getEntity } from '../../API/requests'

function LobbySettings(props) {
    const [maxPlayers, setMaxPlayers] = useState(6)

    useEffect(() => {
        getEntity('gameRoom', props.lobby.roomId).then(res => {
            console.log(res)
            setMaxPlayers(res.data.max_players)
        }, err => {
            console.log(err)
        })
    }, [props.lobby])

    const maxPlayerOnChange = value => {
        if (value >= 2 && value <= 6) {
            setMaxPlayers(value)
        }
    }

    return (
        <div className='lobby-settings-main-div'>
            <NumberRange label='Max Players' min={2} max={6} onChange={(e) => maxPlayerOnChange(e)} value={maxPlayers} />
            <CustomTooltip title='Click to copy to clipboard'>
                <div className='lobby-settings-join-url' onClick={() => copyTextToClipboard(`${process.env.REACT_APP_CLIENT_URL}/join-room?id=${props.lobby.roomSocket}`)}>
                    <p>URL to join</p>
                    <p>{`${process.env.REACT_APP_CLIENT_URL}/join-room?id=${props.lobby.roomSocket}`}</p>
                </div>
            </CustomTooltip>
        </div>
    )
}

export default LobbySettings