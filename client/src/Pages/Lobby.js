import React, { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { getEntity, getRoomUsers } from '../API/requests';
import { useUserInfo } from '../Hooks/useUser'
import Button from '../Components/Buttons/Button';
import { SocketContext } from '../Context/socket/socket'
import PickCharacterDialog from '../Components/Dialogs/PickCharacter/PickCharacterDialog';
import LobbyChat from '../Components/Chat/LobbyChat';
import { useNavigate } from 'react-router-dom';
import Image from '../Components/Misc/Image';
import LobbyCharacter from '../Components/Cards/Characters/LobbyCharacter';
import UserProfile from '../Components/Dialogs/Users/UserProfile/UserProfile';

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

    useEffect(() => {
        sessionStorage.setItem('room', state.roomId)

        socket.on('user_connected_lobby', () => getUsersFromRoom())
        socket.on('user_disconnected_lobby', () => getUsersFromRoom())
        socket.on('character-picked-response', () => getUsersFromRoom())

        return () => {
            socket.off('user_connected_lobby', getUsersFromRoom)
            socket.on('user_disconnected_lobby', getUsersFromRoom)
            socket.off('character-picked-response', getUsersFromRoom)
        }
    }, [])


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
            console.log(res)
            setPlayersConnected(res.data)
        }, err => {
            console.log(err)
        })
    }

    const onCharPick = (userId, charId) => {
        socket.emit('character-picked', { userId, charId, roomSocket: state.roomSocket })
    }

    const onLeaveRoom = () => {
        sessionStorage.removeItem('room')
        socket.emit('leave-room', { userId: userInfo.id })
        navigate('/', { replace: true })
    }

    const openProfile = user => {
        setSelectedUser(user)
        setOpenUserProfile(true)
    }

    return (
        <div className='lobby-main-div'>
            <div className='lobby-characters-div'>
                {allCharacters && <UpperCharacterDisplay
                    players={playersConnected}
                    me={userInfo}
                    allCharacters={allCharacters}
                    onCharPick={onCharPick}
                />}
            </div>
            <div className='lobby-bottom-div'>
                <div className='lobby-settings-div'>

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
                                    <Image alt={player.name} src={player.user.picture} entity='users' className='lobby-player-image' />
                                    <p>{player.user.name}</p>
                                    {!player.user.connected_to_room &&
                                        <p style={{fontSize: '16px'}}>{`(Disconnected)`}</p>
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

const UpperCharacterDisplay = ({ players, me, allCharacters, onCharPick }) => {
    const [openPickCharacter, setOpenPickCharacter] = useState(false)

    const myInfo = players.filter(player => player.user.id === me.id)[0]

    const repickCharacter = player => {
        if (player.user.id === myInfo.user.id) {
            setOpenPickCharacter(true)
        }
    }

    return (
        <>
            {players.map(player => {
                return (
                    player.character &&
                    <LobbyCharacter key={player.user.id} player={player.user} character={player.character} onClick={() => repickCharacter(player)} myInfo={myInfo} />

                )
            })}
            {!myInfo?.character &&
                <div className='pick-character-background'>
                    <Button label='Pick a Character' onClick={() => setOpenPickCharacter(true)} />
                </div>
            }
            <PickCharacterDialog open={openPickCharacter} close={() => setOpenPickCharacter(false)} data={allCharacters} onCharPick={char => onCharPick(me.id, char.id)} players={players} />
        </>
    )
}
