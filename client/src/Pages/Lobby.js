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

import './css/Lobby.css'

function Lobby() {
    const { state } = useLocation();
    const { userInfo } = useUserInfo()
    const socket = useContext(SocketContext)
    const navigate = useNavigate()

    const [allCharacters, setAllCharacters] = useState()
    const [pickedCharacter, setPicketCharacter] = useState(null)
    const [playersConnected, setPlayersConnected] = useState([])

    const [openPickCharacter, setOpenPickCharacter] = useState(false)

    useEffect(() => {
        sessionStorage.setItem('room', state.roomId)

        socket.on('user_connected_lobby', data => handleUserConnected(data))
        socket.on('user_disconnected_lobby', data => handleUserDisconnected(data))
        socket.on('character_picked', data => handleCharacterPicked(data))

        return () => {
            socket.off('user_connected_lobby', handleUserConnected)
            socket.on('user_disconnected_lobby', handleUserDisconnected)
            socket.off('character_picked', handleCharacterPicked)
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
            // console.log(res)
            setPlayersConnected(res.data)
        }, err => {
            console.log(err)
        })
    }

    const handleUserConnected = data => {
        console.log(data)
        getUsersFromRoom()
    }

    const handleUserDisconnected = data => {
        console.log(data)
        getUsersFromRoom()
    }

    const handleCharacterPicked = data => {
        console.log(data)
    }

    const onCharPick = (char) => {
        console.log(char)
        setPicketCharacter(char)
        //emit here
    }

    const onLeaveRoom = () => {
        sessionStorage.removeItem('room')
        socket.emit('leave-room', { userId: userInfo.id })
        navigate('/', { replace: true })
    }

    return (
        <div className='lobby-main-div'>
            <div className='lobby-characters-div'>
                {allCharacters &&
                    <>
                        {pickedCharacter ?
                            <LobbyCharacter player={userInfo.name} character={pickedCharacter} />
                            :
                            <div className='pick-character-background'>
                                <Button label='Pick a Character' onClick={() => setOpenPickCharacter(true)} />
                            </div>
                        }
                    </>
                }
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
                                <div className='lobby-player-div' key={player.id}>
                                    <Image alt={player.name} src={player.picture} entity='users' className='lobby-player-image' />
                                    <p>{player.name}</p>
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
            {allCharacters &&
                <PickCharacterDialog open={openPickCharacter} close={() => setOpenPickCharacter(false)} data={allCharacters} onCharPick={onCharPick} />
            }
        </div>
    )
}

export default Lobby