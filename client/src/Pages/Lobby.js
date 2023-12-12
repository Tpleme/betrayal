import React, { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { getEntity, getRoomUsers } from '../API/requests';
import { useUserInfo } from '../Hooks/useUser'
import Button from '../Components/Buttons/Button';
import { SocketContext } from '../Context/socket/socket'
import LobbyChat from '../Components/Chat/LobbyChat';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../Components/Dialogs/Users/UserProfile/UserProfile';
import CustomTabs from '../Components/Misc/CustomTabs';
import TabPanel from '../Components/Misc/TabPanel'
import ToggleButton from '../Components/Buttons/ToggleButton'
import UpperCharacterDisplay from '../Components/Lobby/UpperCharacterDisplay';
import CharacterDisplay from '../Components/Lobby/CharacterDisplay';
import LobbySettings from '../Components/Lobby/LobbySettings';
import useGlobalSnackbar from '../Hooks/useGlobalSnackbar';
import { copyTextToClipboard } from '../utils';
import CustomTooltip from '../Components/Misc/CustomTooltip';
import PlayerDisplay from '../Components/Lobby/PlayerDisplay';
import LoadingDialog from '../Components/Dialogs/LoadingDialog'

import './css/Lobby.css'

function Lobby() {
    const { state } = useLocation();
    const { userInfo } = useUserInfo()
    const socket = useContext(SocketContext)
    const navigate = useNavigate()
    const { showSnackbar } = useGlobalSnackbar()

    const [showLoadingDialog, setShowLoadingDialog] = useState(false)
    const [openUserProfile, setOpenUserProfile] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [allCharacters, setAllCharacters] = useState()
    const [playersConnected, setPlayersConnected] = useState([])
    const [amIHosting, setAmIHosting] = useState(false)
    const [tab, setTab] = useState(0)
    const [myInfo, setMyInfo] = useState(null)

    useEffect(() => {
        if (state) {
            sessionStorage.setItem('room', state.roomId)

            socket.on('user_connected_lobby', () => getUsersFromRoom())
            socket.on('user_disconnected_lobby', () => getUsersFromRoom())
            socket.on('character-picked-response', () => getUsersFromRoom())
            socket.on('player-ready-response', () => getUsersFromRoom())
            socket.on('hosting-now', () => getUsersFromRoom())
            socket.on('kicked', () => onKicked())
            socket.on('start-game-response', startGameResponse)

            return () => {
                socket.off('user_connected_lobby', getUsersFromRoom)
                socket.off('user_disconnected_lobby', getUsersFromRoom)
                socket.off('character-picked-response', getUsersFromRoom)
                socket.off('player-ready-response', getUsersFromRoom)
                socket.off('kicked', onKicked)
                socket.off('hosting-now', getUsersFromRoom)
                socket.off('start-game-response', startGameResponse)
            }
        }
    }, [])

    useEffect(() => {
        if (!state) {
            navigate('/', { replace: true })
            return;
        }

        if (playersConnected.length > 0) {
            const me = playersConnected.filter(player => player.user.id === userInfo.id)[0]
            setMyInfo(me)
            setAmIHosting(me.user.hosting === state.roomId)
        }
    }, [state, playersConnected, userInfo])

    useEffect(() => {
        if (state) {

            getEntity('characters').then(res => {
                setAllCharacters(res.data)
            }, err => {
                console.log(err)
            })

            getUsersFromRoom()
        }
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

    const handleKickPlayer = (player) => {
        socket.emit('kick-player', { userId: player.id, myId: userInfo.id, room: state })
    }

    const onKicked = () => {
        showSnackbar({ message: 'You have been kicked out from the game', variant: 'default', persist: true })
        navigate('/', { replace: true, state: { wasKicked: true } })
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

    const getTabsPanels = () => {
        if (amIHosting) {
            return (
                myInfo &&
                <>
                    <TabPanel value={tab} index={0}>
                        <LobbySettings lobby={state} players={playersConnected} socket={socket} />
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        <CharacterDisplay myInfo={myInfo} />
                    </TabPanel>
                </>
            )
        }
        return (
            <TabPanel value={tab} index={0}>
                {myInfo &&
                    <CharacterDisplay myInfo={myInfo} />
                }
            </TabPanel>
        )
    }

    const checkIfCanStart = () => {
        const allReady = playersConnected.every(player => player.ready)
        return allReady && playersConnected.length > 1
    }

    const startGame = () => {
        console.log(state)
        socket.emit('start-game', { players: playersConnected, roomSocket: state.roomSocket })
    }

    const startGameResponse = data => {
        setShowLoadingDialog(true)

        //fake loading
        setTimeout(() => {
            setShowLoadingDialog(false)
            navigate('/room', { replace: true, state })
        }, 2500)
    }

    return (
        state &&
        <div className='lobby-main-div'>
            <div className='lobby-background' />
            <div className='lobby-characters-div'>
                {(allCharacters && myInfo) &&
                    <UpperCharacterDisplay
                        players={playersConnected}
                        myInfo={myInfo}
                        allCharacters={allCharacters}
                        onCharPick={onCharPick}
                    />
                }
            </div>
            <div className='lobby-bottom-div'>
                <div className='lobby-settings-div'>
                    <CustomTabs value={tab} onClick={(e, value) => setTab(value)} variant='fullWidth' options={getTabsOptions()} />
                    <div className='lobby-settings-tab-div'>
                        {getTabsPanels()}
                    </div>
                    <div className='looby-ready-start-buttons'>
                        <ToggleButton disabled={!myInfo?.character} label='Ready' onToggle={value => onPlayerReady(value)} />
                        {amIHosting && <Button label='Start Game' disabled={!checkIfCanStart()} onClick={startGame} />}
                    </div>
                </div>
                <div className='lobby-information'>
                    <div className='lobby-info-div'>
                        <p className='lobby-info-title'>Lobby info</p>
                        <CustomTooltip title='Copy to clipboard'>
                            <p className='lobby-info-text' onClick={() => copyTextToClipboard(state.roomSocket)}>{state.roomSocket}</p>
                        </CustomTooltip>
                    </div>
                    <div className='connected-players-div'>
                        <p className='lobby-info-title'>Connected Players</p>
                        {playersConnected.map(player => {
                            return (
                                <PlayerDisplay
                                    key={player.id}
                                    player={player}
                                    openProfile={() => openProfile(player.user)}
                                    actions={amIHosting}
                                    myInfo={myInfo}
                                    host={player.user.hosting === state.roomId}
                                    kickPlayer={handleKickPlayer}
                                />
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
            <LoadingDialog open={showLoadingDialog} message={'Starting game...'} />
        </div>
    )
}

export default Lobby