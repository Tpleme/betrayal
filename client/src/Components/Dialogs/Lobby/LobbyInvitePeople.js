import React, { useState, useEffect } from 'react'
import Button from '../../Buttons/Button'
import DialogPrefab from '../DialogPrefab'
import { AutoComplete } from '../../Inputs/Autocomplete/AutoComplete'
import CustomTooltip from '../../Misc/CustomTooltip'
import { AvatarGroup, Avatar } from '@mui/material'
import { getEntity, invitePlayers } from '../../../API/requests'
import useGlobalSnackbar from '../../../Hooks/useGlobalSnackbar'
import { useUserInfo } from '../../../Hooks/useUser'
import SyncIcon from '@mui/icons-material/Sync';

import portraitPlaceholder from '../../../Assets/placeholders/portrait.jpg'
import './LobbyInvitePeople.css'

function LobbyInvitePeople(props) {
    const [invitedPlayers, setInvitedPlayers] = useState([])
    const [allUsers, setAllUsers] = useState([])
    const [refresh, setRefresh] = useState(false)
    const { showSnackbar } = useGlobalSnackbar()
    const { userInfo } = useUserInfo()

    useEffect(() => {
        if (props.open) {
            getEntity('users').then(res => {
                setAllUsers(res.data.filter(user => user.loggedIn && user.id !== userInfo.id))
            }, err => {
                console.log(err)
            })
        }
    }, [props.open, refresh])

    const onInvite = () => {

        invitePlayers({ players: invitedPlayers, room: { id: props.room.id, socket: props.room.room_id } }).then(res => {
            showSnackbar({ message: res.data, variant: 'success' })
            setInvitedPlayers([])
            props.close()
        }, err => {
            console.log(err)
            showSnackbar({ message: err.response.data ? err.response.data : 'Cannot communicate with the server, please try again later', variant: 'error', persist: true })
        })

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
                <div className='lobby-invite-autocomplete-div'>
                    <AutoComplete
                        name='players'
                        multiple
                        options={allUsers}
                        disableCloseOnSelect
                        optionLabel='name'
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={data => setInvitedPlayers(data)}
                        renderTags={(tagValue) => AutoCompleteRenderTags(tagValue)}
                        placeholder='Type here to search'
                    />
                    <CustomTooltip title='Refresh Users List'>
                        <SyncIcon className='lobby-invite-refresh-btn' onClick={() => setRefresh(!refresh)} />
                    </CustomTooltip>
                </div>
                <Button label='Invite Players' onClick={onInvite} disabled={invitedPlayers.length === 0} />
            </div>
        </DialogPrefab>
    )
}

export default LobbyInvitePeople

const AutoCompleteRenderTags = (value) => {
    return (
        <AvatarGroup variant='rounded' max={6}>
            {value.map(user => {
                return (
                    <CustomTooltip key={user.id} title={user.name}>
                        <Avatar sx={{ width: '30px', height: '30px', marginRight: '10px', border: 'none' }} alt={user.name} src={user.picture ? `${process.env.REACT_APP_SERVER_URL}/resources/images/users/${user.picture}` : portraitPlaceholder} />
                    </CustomTooltip>
                )
            })}
        </AvatarGroup>
    )
}