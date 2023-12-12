import React, { useState, useEffect, useContext } from 'react'
import LobbyChat from '../Components/Chat/LobbyChat';
import { SocketContext } from '../Context/socket/socket'
import { useNavigate, useLocation } from 'react-router-dom';
import { getRoomUsers } from '../API/requests';
import useGlobalSnackbar from '../Hooks/useGlobalSnackbar';
import GameBoard from '../Components/GameRoom/GameBoard';
import PlayerActions from '../Components/GameRoom/PlayerActions';
import { useUserInfo } from '../Hooks/useUser'

import './css/Room.css'

function Room() {
    const { state } = useLocation();
    const { userInfo } = useUserInfo()
    const socket = useContext(SocketContext)
    const navigate = useNavigate()
    const { showSnackbar } = useGlobalSnackbar()

    const [playerMode, setPlayerMode] = useState('free')
    const [players, setPlayers] = useState([])
    const [myToken, setMyToken] = useState()

    useEffect(() => {
        console.log(state)
        if (state) getUsersFromRoom()
    }, [state])

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
            console.log(res.data)
            const mappedPlayers = res.data.map(player => ({ ...player, position: { x: 0, y: 0 }, navigationHistory: [] }))
            const otherPlayers = mappedPlayers.filter(player => player.userId !== userInfo.id)
            const me = mappedPlayers.filter(player => player.userId === userInfo.id)[0]

            setPlayers(otherPlayers)
            setMyToken(me)
        }, err => {
            console.log(err)
        })
    }

    const onKicked = () => {
        showSnackbar({ message: 'You have been kicked out from the game', variant: 'default', persist: true })
        navigate('/', { replace: true, state: { wasKicked: true } })
    }

    const openInventory = () => {
        console.log('Opening Inventory')
    }

    const passTurn = () => {
        console.log('Passing Turn')
    }


    return (
        <div className='game-room-main-div' >
            <div className='game-room-background' />
            <PlayerActions playerMode={playerMode} setPlayerMode={setPlayerMode} passTurn={passTurn} openInventory={openInventory} />
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
            {(players && myToken) &&
                <GameBoard players={players} setPlayers={setPlayers} myToken={myToken} setMyToken={setMyToken} playerMode={playerMode} />
            }
        </div>
    )
}

export default Room