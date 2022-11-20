import React, { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { getEntity } from '../API/requests';
import { useUserInfo } from '../Hooks/useUser'
import Button from '../Components/Buttons/Button';
import { SocketContext } from '../Context/socket/socket'
import PickCharacterDialog from '../Components/Dialogs/PickCharacter/PickCharacterDialog';

import LobbyCharacter from '../Components/Cards/Characters/LobbyCharacter';

import './css/Lobby.css'

function Lobby() {
    const { state } = useLocation();
    const { userInfo } = useUserInfo()
    const socket = useContext(SocketContext)

    const [allCharacters, setAllCharacters] = useState()
    const [pickedCharacter, setPicketCharacter] = useState(null)
    const [playersConnected, setPlayersConnected] = useState([])

    const [openPickCharacter, setOpenPickCharacter] = useState(false)

    useEffect(() => {
        socket.on('user_connected_lobby', data => handleUserConnected(data))
        socket.on('character_picked', data => handleCharacterPicked(data))

        return () => {
            socket.off('user_connected_lobby', handleUserConnected)
            socket.off('character_picked', handleCharacterPicked)
        }
    }, [])

    useEffect(() => {
        getEntity('characters').then(res => {
            setAllCharacters(res.data)
        }, err => {
            console.log(err)
        })
    }, [])

    const handleUserConnected = data => {
        console.log(data)
    }

    const handleCharacterPicked = data => {
        console.log(data)
    }

    const onCharPick = (char) => {
        console.log(char)
        setPicketCharacter(char)
        //emit here
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
                        <LobbyCharacter player='Ana' character={allCharacters[2]} />
                        <LobbyCharacter player='John' character={allCharacters[10]} />
                    </>
                }
            </div>
            <div className='lobby-bottom-div'>
                <div className='lobby-settings-div'>

                </div>
                <div className='lobby-information'>
                    <div className='lobby-info-div'>
                        <p className='lobby-info-title'>Lobby info</p>
                        <p className='lobby-info-text'>{state.room_id}</p>
                    </div>
                    <div className='connected-players-div'>
                        <p className='lobby-info-title'>Connected Players</p>
                    </div>
                </div>
                <div className='lobby-chat-div'>

                </div>
            </div>
            {allCharacters &&
                <PickCharacterDialog open={openPickCharacter} close={() => setOpenPickCharacter(false)} data={allCharacters} onCharPick={onCharPick} />
            }
        </div>
    )
}

export default Lobby