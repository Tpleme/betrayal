import React, { useState, useEffect, useContext } from 'react'
import LobbyChat from '../Components/Chat/LobbyChat';
import { SocketContext } from '../Context/socket/socket'
import { useNavigate, useLocation } from 'react-router-dom';
import { getRoomUsers } from '../API/requests';
import useGlobalSnackbar from '../Hooks/useGlobalSnackbar';
import GameBoard from '../Components/Game/Board/GameBoard';
import PlayerActions from '../Components/Game/Displays/PlayerActions';
import { useUserInfo } from '../Hooks/useUser'

import './css/Room.css'
import PlayerDisplay from '../Components/Game/Displays/PlayerDisplay';
import TurnDisplay from '../Components/Game/Displays/TurnDisplay';

function Room() {
    const { state } = useLocation();
    const { userInfo } = useUserInfo()
    const socket = useContext(SocketContext)
    const navigate = useNavigate()
    const { showSnackbar } = useGlobalSnackbar()

    const [playerMode, setPlayerMode] = useState('free')
    const [players, setPlayers] = useState([])
    const [myToken, setMyToken] = useState()
    const [turnOrder, setTurnOrder] = useState()

    useEffect(() => {
        if (state) {
            setTurnOrder(state.turnOrder)
            getUsersFromRoom()
        }
    }, [state])

    useEffect(() => {
        // socket.on('user_connected_lobby', getUsersFromRoom)
        // socket.on('user_disconnected_lobby', getUsersFromRoom)
        socket.on('hosting-now', getUsersFromRoom)
        socket.on('kicked', onKicked)
        socket.on('on_player_move', onPlayerMove)

        return () => {
            socket.off('user_connected_lobby', getUsersFromRoom)
            socket.off('user_disconnected_lobby', getUsersFromRoom)
            socket.off('kicked', onKicked)
            socket.off('hosting-now', getUsersFromRoom)
            socket.off('on_player_move', onPlayerMove)
        }
    }, [])

    const getUsersFromRoom = () => {
        //get room info from database for turn number
        if (players.length === 0) {
            getRoomUsers(state.roomId).then(res => {
                const mappedPlayers = res.data.map(player => ({
                    ...player,
                    position: JSON.parse(player.position),
                    navigationHistory: [],
                }))

                const otherPlayers = mappedPlayers.filter(player => player.userId !== userInfo.id)
                const me = mappedPlayers.filter(player => player.userId === userInfo.id)[0]

                setPlayers(otherPlayers)
                setMyToken(me)

            }, err => {
                console.log(err)
            })
        }
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

    const movePlayer = roomTile => {
        const newData = {
            ...myToken,
            position: { x: roomTile.position.x, y: roomTile.position.y },
            navigationHistory: [roomTile, ...myToken.navigationHistory]
        }

        setMyToken(newData)

        socket.emit('move_player', { player: newData, roomSocket: state.roomSocket })
    }

    const onPlayerMove = data => {
        setPlayers(prev => {
            const newPlayersArray = prev.filter(player => player.id.toString() !== data.player.id.toString())
            return [...newPlayersArray, data.player]
        })
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
                {myToken && <PlayerDisplay player={myToken} />}
            </div>
            <div className='game-room-help-div'>
                <p>Game help div</p>
            </div>
            <div className='game-room-top'>
                <TurnDisplay turn={turnOrder} />
            </div>
            {(players && myToken) &&
                <GameBoard
                    players={players}
                    setPlayers={setPlayers}
                    myToken={myToken}
                    setMyToken={setMyToken}
                    playerMode={playerMode}
                    socket={socket}
                    movePlayer={movePlayer}
                    roomSocket={state.roomSocket}
                />
            }
        </div>
    )
}

export default Room