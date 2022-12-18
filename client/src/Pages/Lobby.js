import React, { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { getEntity, getRoomUsers } from '../API/requests';
import { useUserInfo } from '../Hooks/useUser'
import Button from '../Components/Buttons/Button';
import { SocketContext } from '../Context/socket/socket'
import LobbyChat from '../Components/Chat/LobbyChat';
import { useNavigate } from 'react-router-dom';
import Image from '../Components/Misc/Image';
import UserProfile from '../Components/Dialogs/Users/UserProfile/UserProfile';
import CustomTabs from '../Components/Misc/CustomTabs';
import TabPanel from '../Components/Misc/TabPanel'
import ToggleButton from '../Components/Buttons/ToggleButton'
import { Check } from '@mui/icons-material';
import CustomTooltip from '../Components/Misc/CustomTooltip'
import UpperCharacterDisplay from '../Components/Lobby/UpperCharacterDisplay';
import CharacterDisplay from '../Components/Lobby/CharacterDisplay';
import LobbySettings from '../Components/Lobby/LobbySettings';

import './css/Lobby.css'

function Lobby() {
    const { state } = useLocation();
    const { userInfo } = useUserInfo()
    const socket = useContext(SocketContext)
    const navigate = useNavigate()

    const [openUserProfile, setOpenUserProfile] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [allCharacters, setAllCharacters] = useState()
    const [playersConnected, setPlayersConnected] = useState([])
    const [amIHosting, setAmIHosting] = useState(false)
    const [tab, setTab] = useState(0)
    const [myInfo, setMyInfo] = useState(null)

    useEffect(() => {
        sessionStorage.setItem('room', state.roomId)

        socket.on('user_connected_lobby', () => getUsersFromRoom())
        socket.on('user_disconnected_lobby', () => getUsersFromRoom())
        socket.on('character-picked-response', () => getUsersFromRoom())
        socket.on('player-ready-response', () => getUsersFromRoom())

        return () => {
            socket.off('user_connected_lobby', getUsersFromRoom)
            socket.off('user_disconnected_lobby', getUsersFromRoom)
            socket.off('character-picked-response', getUsersFromRoom)
            socket.off('player-ready-response', getUsersFromRoom)
        }
    }, [])

    useEffect(() => {
        if (playersConnected.length > 0) {
            const me = playersConnected.filter(player => player.user.id === userInfo.id)[0]
            setMyInfo(me)
            setAmIHosting(me.user.hosting === state.roomId)
        }
    }, [state, playersConnected, userInfo])

    useEffect(() => {
        getEntity('characters').then(res => {
            setAllCharacters(res.data)
        }, err => {
            console.log(err)
        })

        getUsersFromRoom()
    }, [])

    const getUsersFromRoom = () => {
        getRoomUsers(state.roomId).then(res => {
            setPlayersConnected(res.data)
        }, err => {
            console.log(err)
        })
    }

    const onCharPick = (userId, charId) => {
        socket.emit('character-picked', { userId, charId, roomSocket: state.roomSocket })
    }

    const onLeaveRoom = () => {
        navigate('/', { replace: true })
    }

    const openProfile = user => {
        setSelectedUser(user)
        setOpenUserProfile(true)
    }

    const onPlayerReady = value => {
        socket.emit('player-ready', { userId: userInfo.id, roomSocket: state.roomSocket, ready: value })
    }

    const getTabsOptions = () => {
        if (amIHosting) {
            return ['Room Settings', 'Player Character']
        }
        return ['Player Character']
    }

    const checkIfCanStart = () => {
        const allReady = playersConnected.every(player => player.ready)
        return allReady && playersConnected.length > 1
    }

    return (
        <div className='lobby-main-div'>
            <div className='lobby-background' />
            <div className='lobby-characters-div'>
                {(allCharacters && myInfo) && <UpperCharacterDisplay
                    players={playersConnected}
                    myInfo={myInfo}
                    allCharacters={allCharacters}
                    onCharPick={onCharPick}
                />}
            </div>
            <div className='lobby-bottom-div'>
                <div className='lobby-settings-div'>
                    <CustomTabs value={tab} onClick={(e, value) => setTab(value)} variant='fullWidth' options={getTabsOptions()} />
                    <div className='lobby-settings-tab-div'>
                        <TabPanel value={tab} index={0}>
                            <LobbySettings lobby={state} />
                        </TabPanel>
                        <TabPanel value={tab} index={1}>
                            <CharacterDisplay myInfo={myInfo} />
                        </TabPanel>
                    </div>
                    <div className='looby-ready-start-buttons'>
                        <ToggleButton label='Ready' onToggle={value => onPlayerReady(value)} />
                        <Button label='Start Game' disabled={!checkIfCanStart()} />
                    </div>
                </div>
                <div className='lobby-information'>
                    <div className='lobby-info-div'>
                        <p className='lobby-info-title'>Lobby info</p>
                        <p className='lobby-info-text'>{state.roomSocket}</p>
                    </div>
                    <div className='connected-players-div'>
                        <p className='lobby-info-title'>Connected Players</p>
                        {playersConnected.map(player => {
                            return (
                                <div className='lobby-player-div' key={player.id} onClick={() => openProfile(player.user)}>
                                    {player.ready &&
                                        <CustomTooltip title='Player Ready'>
                                            <Check htmlColor='var(--light-yellow)' sx={{ scale: '1.5' }} />
                                        </CustomTooltip>
                                    }
                                    <Image alt={player.name} src={player.user.picture} entity='users' className='lobby-player-image' />
                                    <p>{player.user.name}</p>
                                    {!player.user.connected_to_room &&
                                        <p style={{ fontSize: '16px' }}>{`(Disconnected)`}</p>
                                    }
                                </div>
                            )
                        })}
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                        <Button label='Leave room' onClick={onLeaveRoom} />
                    </div>
                </div>
                <div className='lobby-chat-div'>
                    <LobbyChat roomId={state.roomSocket} />
                </div>
            </div>
            {selectedUser &&
                <UserProfile open={openUserProfile} close={() => setOpenUserProfile(false)} user={selectedUser} />
            }
        </div>
    )
}

export default Lobby