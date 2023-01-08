import React, { useState, useEffect, useContext } from 'react'
import { getEntity } from '../API/requests'
import LobbyChat from '../Components/Chat/LobbyChat';
import { SocketContext } from '../Context/socket/socket'
import { useNavigate } from 'react-router-dom';
import { getRoomUsers } from '../API/requests';
import useGlobalSnackbar from '../Hooks/useGlobalSnackbar';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { ZoomIn, ZoomOut, CenterFocusStrong, PanTool } from '@mui/icons-material'

import './css/Room.css'

const TILE_SIZE = 50
const BOARD_SIZE = 2000

function Room() {
    const [boardTiles, setBoardTiles] = useState([])
    const [players, setPlayers] = useState([])
    const [state, setState] = useState({ roomSocket: '12kjasd90asd' }) //test only
    const [board, setBoard] = useState({ basement: [], ground: [], upper: [] })
    const [mode, setMode] = useState('active')

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

    useEffect(() => {
        // if (!state) {
        //     navigate('/', { replace: true })
        //     return;
        // }

        getEntity('roomTiles').then(res => {
            const tiles = res.data.restTiles.map(tile => {
                return { ...tile, discarded: false }
            })

            setBoardTiles(tiles);
            buildBoard(res.data.initialTiles)
            console.log(res.data)
        }, err => {
            console.log(err)
        })

        document.addEventListener('keydown', (e) => onKeyDown(e))
        document.addEventListener('keyup', (e) => onKeyUp(e))

    }, [])

    const onKeyDown = e => {
        if (e.keyCode === 17) {
            setMode('panning')
        }
    }

    const onKeyUp = e => {
        if (e.keyCode === 17) {
            setMode('active')
        }
    }

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

    const buildBoard = (tiles) => {
        const tileCount = BOARD_SIZE / TILE_SIZE

        if (board.ground.length === 0) {
            for (var i = 0; i < tileCount; i++) {
                board.ground.push([])
                for (let j = 0; j < tileCount; j++) {
                    board.ground[i].push({ tile: null, position: { x: j, y: i }, rotation: 0 })
                }
            }

            const entrance = tiles.find(tile => tile.id === 47)
            const foyer = tiles.find(tile => tile.id === 48)
            const staircase = tiles.find(tile => tile.id === 46)

            board.ground[0][10].tile = entrance
            board.ground[0][10].rotation = 90
            board.ground[1][10].tile = foyer
            board.ground[1][10].rotation = 90
            board.ground[2][10].tile = staircase
            board.ground[2][10].rotation = 90

        }
    }

    //calcula onde estão as portas independentemente da rotação
    const getDoors = (doors, rotation) => {
        const splitDoors = doors.split('')
        const coord = ['N', 'E', 'S', 'W']
        const newDoorArray = []

        const getRotationNumber = (rotation) => {
            switch (rotation) {
                case 90: return 1;
                case 180: return 2;
                case 270: return 3;
                default: return 0
            }
        }

        splitDoors.forEach(door => {
            const doorIndex = coord.findIndex(coord => coord === door);
            if (coord[doorIndex + getRotationNumber(rotation)]) {
                newDoorArray.push(coord[doorIndex + getRotationNumber(rotation)])
            } else {
                const overflow = getRotationNumber(rotation) - (coord.length - doorIndex)
                newDoorArray.push(coord[overflow])
            }

        })
        return newDoorArray
    }

    const spawnTile = (x, y, floor) => {
        if (mode !== 'active') return;

        const boardData = board.ground

        const rightTile = boardData[y][x + 1] ? { data: boardData[y][x + 1], side: 'E' } : null
        const leftTile = boardData[y][x - 1] ? { data: boardData[y][x - 1], side: 'W' } : null
        const upperTile = boardData[y + 1] ? { data: boardData[y + 1][x], side: 'N' } : null
        const bottomTile = boardData[y - 1] ? { data: boardData[y - 1][x], side: 'S' } : null

        const neighborTiles = [rightTile, leftTile, upperTile, bottomTile]

        const possibleDoorConnections = []

        //por casa sala com tile a volta, verifica se tem ligação
        neighborTiles.forEach(el => {
            if (el?.data.tile) {
                const doorWithRotation = getDoors(el.data.tile.doors, el.data.rotation)
                switch (el.side) {
                    case 'N': doorWithRotation.includes('S') && possibleDoorConnections.push('N')
                        break;
                    case 'E': doorWithRotation.includes('W') && possibleDoorConnections.push('E')
                        break;
                    case 'S': doorWithRotation.includes('N') && possibleDoorConnections.push('S')
                        break;
                    case 'W': doorWithRotation.includes('E') && possibleDoorConnections.push('W')
                        break;
                    default: console.log('None')

                }
            }
        })

        if (possibleDoorConnections.length === 0) {
            return
        }


        const floorTiles = boardTiles.filter(tile => tile.floor.split(',').includes(floor) && !tile.discarded)

        if (floorTiles.length === 0) {
            console.log('No more tiles here')
            return;
        }

        const randomTile = Math.floor(Math.random() * floorTiles.length)

        boardData[y][x].tile = floorTiles[randomTile]

        const usedTile = boardTiles.find(tile => tile.id === floorTiles[randomTile].id)
        usedTile.discarded = true

        const filteredTiles = boardTiles.filter(tiles => tiles.id !== usedTile.id)

        setBoardTiles([...filteredTiles, usedTile])
        setBoard({ ...board, ground: boardData })
    }

    const onHover = (e, tile) => {

    }

    return (
        <div className='game-room-main-div' >
            <div className='game-room-background' />
            <div className='game-room-player-actions'>
                Player Actions
            </div>
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
                {/* Player turn indicator */}
                {mode}
            </div>
            <div className='game-room-game-board' style={mode === 'panning' ? { cursor: 'grab' } : {}}>
                <TransformWrapper
                    initialPositionX={-1240}
                    initialPositionY={-6748}
                    initialScale={3.70}
                    doubleClick={{ disabled: true }}
                    panning={{ disabled: mode !== 'panning' }}
                >
                    {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                        <>
                            <div className='game-room-board-tools'>
                                <ZoomIn onClick={() => zoomIn()} />
                                <ZoomOut onClick={() => zoomOut()} />
                                <CenterFocusStrong />
                                <PanTool
                                    htmlColor={mode === 'active' ? 'grey' : 'white'}
                                    fontSize='small'
                                    onClick={() => mode === 'active' ? setMode('panning') : setMode('active')}
                                />
                            </div>
                            <TransformComponent>
                                <div className='game-room-inner-game-board' style={{ height: `${BOARD_SIZE}px`, width: `${BOARD_SIZE}px` }}>
                                    {board.ground.map(col => {
                                        return (
                                            col.map((row, index) => {
                                                if (row.tile) {
                                                    return (
                                                        <div
                                                            key={row.tile.id}
                                                            className='game-room-board-tile filled'
                                                            onClick={() => console.log(row)}
                                                            style={{
                                                                bottom: `${row.position.y * TILE_SIZE}px`,
                                                                left: `${row.position.x * TILE_SIZE}px`,
                                                                width: `${TILE_SIZE}px`,
                                                                height: `${TILE_SIZE}px`,
                                                                rotate: `${row.rotation}deg`,
                                                                borderTop: `${row.tile.doors.includes('N') ? '1px solid green' : 'none'}`,
                                                                borderBottom: `${row.tile.doors.includes('S') ? '1px solid green' : 'none'}`,
                                                                borderRight: `${row.tile.doors.includes('E') ? '1px solid green' : 'none'}`,
                                                                borderLeft: `${row.tile.doors.includes('W') ? '1px solid green' : 'none'}`,

                                                            }}
                                                        >
                                                            <img alt={row.tile.name} src={`${process.env.REACT_APP_SERVER_URL}/resources/images/roomTiles/${row.tile.image}`} />
                                                        </div>
                                                    )
                                                } else {
                                                    return (
                                                        <div
                                                            className='game-room-board-tile empty'
                                                            key={`${index}-empty`}
                                                            onClick={() => spawnTile(row.position.x, row.position.y, '1')}
                                                            style={{
                                                                bottom: `${row.position.y * TILE_SIZE}px`,
                                                                left: `${row.position.x * TILE_SIZE}px`,
                                                                width: `${TILE_SIZE}px`,
                                                                height: `${TILE_SIZE}px`
                                                            }}
                                                        >
                                                        </div>
                                                    )
                                                }
                                            })
                                        )
                                    })}
                                </div>
                            </TransformComponent>
                        </>
                    )}
                </TransformWrapper>
            </div>
        </div>
    )
}

export default Room