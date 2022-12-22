import React, { useState } from 'react'
import Button from '../../Buttons/Button'
import DialogPrefab from '../DialogPrefab'
import { AutoComplete } from '../../Inputs/Autocomplete/AutoComplete'

import './LobbyInvitePeople.css'

function LobbyInvitePeople(props) {
    const [invitedPlayers, setInvitedPlayers] = useState([])

    const onInvite = () => {
        console.log(invitedPlayers)
    }

    return (
        <DialogPrefab
            open={props.open}
            close={props.close}
            maxWidth='sm'
        >
            <div className='lobby-invite-main-div'>
                <p className='lobby-invite-title' >Pick the player you want to invite and then click on "Invite players"</p>
                <p className='lobby-invite-subtitle'>keep in mind that the players need to be online in order to receive the invite, if this is not the case, share the url link shown on the room settings </p>
                <AutoComplete 
                
                />
                <Button label='Invite Players' onClick={onInvite} />
            </div>
        </DialogPrefab>
    )
}

export default LobbyInvitePeople