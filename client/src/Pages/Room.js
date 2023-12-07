import React, { useState, useEffect, useContext } from 'react'
import LobbyChat from '../Components/Chat/LobbyChat';
import { SocketContext } from '../Context/socket/socket'
import { useNavigate } from 'react-router-dom';
import { getRoomUsers } from '../API/requests';
import useGlobalSnackbar from '../Hooks/useGlobalSnackbar';
import GameBoard from '../Components/GameRoom/GameBoard';
import PlayerActions from '../Components/GameRoom/PlayerActions';

import './css/Room.css'

function Room() {
    const [players, setPlayers] = useState([])
    const [state, setState] = useState({ roomSocket: '12kjasd90asd' }) //test only

    const socket = useContext(SocketContext)
    const navigate = useNavigate()
    const { showSnackbar } = useGlobalSnackbar()

    useEffect(() => {
        socket.on('user_connected_lobby', () => getUsersFromRoom())
        socket.on('user_disconnected_lobby', () => getUsersFromRoom())
        socket.on('hosting-now', () => getUsersFromRoom())
        socket.on('kicked', () => onKicked())

        return () => {
            socket.off('user_connected_lobby', getUsersFromRoom)
            socket.off('user_disconnected_lobby', getUsersFromRoom)
            socket.off('kicked', onKicked)
            socket.off('hosting-now', getUsersFromRoom)
        }
    }, [])

    const getUsersFromRoom = () => {
        getRoomUsers(state.roomId).then(res => {
            players(res.data)
        }, err => {
            console.log(err)
        })
    }

    const onKicked = () => {
        showSnackbar({ message: 'You have been kicked out from the game', variant: 'default', persist: true })
        navigate('/', { replace: true, state: { wasKicked: true } })
    }


    return (
        <div className='game-room-main-div' >
            <div className='game-room-background' />
            <PlayerActions />
            <div className='game-room-chat'>
                <LobbyChat roomId={state.roomSocket} />
            </div>
            <div className='game-room-players-display'>
                Players Display
            </div>
            <div className='game-room-player-display'>
                Player display
            </div>
            <div className='game-room-help-div'>
                <p>Game help div</p>
            </div>
            <div className='game-room-top'>
                Player turn indicator
            </div>
            <GameBoard />
        </div>
    )
}

export default Room