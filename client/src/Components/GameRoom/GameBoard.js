import React, { useState, useEffect } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { ZoomIn, ZoomOut, CenterFocusStrong, PanTool } from '@mui/icons-material'
import { getEntity } from '../../API/requests'

import './GameBoard.css'

const TILE_SIZE = 50
const BOARD_SIZE = 2000

function GameBoard() {
    const [boardTiles, setBoardTiles] = useState([])
    const [board, setBoard] = useState({ basement: [], ground: [], upper: [] })
    const [mode, setMode] = useState('active')
    const [players, setPlayers] = useState([
        // { name: 'test', position: { x: 10, y: 0 } },
        // { name: 'test1', position: { x: 10, y: 1 } },
    ])
    const [myToken, setMyToken] = useState({ name: 'test', position: { x: 0, y: 0 } })

    useEffect(() => {
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

    const buildBoard = (tiles) => {
        const tileCount = BOARD_SIZE / TILE_SIZE
        console.log(tileCount)

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

            const boardCenter = Math.floor(tileCount / 2)

            board.ground[boardCenter][boardCenter].tile = entrance
            board.ground[boardCenter][boardCenter].rotation = 90

            board.ground[boardCenter + 1][boardCenter].tile = foyer
            board.ground[boardCenter + 1][boardCenter].rotation = 90

            board.ground[boardCenter + 2][boardCenter].tile = staircase
            board.ground[boardCenter + 2][boardCenter].rotation = 90

            setMyToken(prev => ({ ...prev, position: { x: boardCenter, y: boardCenter } }))
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

        //Checks if player is in neighbor tiles and if there is a connection
        const possibleConnectionsTiles = neighborTiles.filter(tile => possibleDoorConnections.includes(tile?.side))

        const playerInConnectedNeighborTile = possibleConnectionsTiles.filter(el => {
            return (
                el.data.position.x === myToken.position.x &&
                el.data.position.y === myToken.position.y
            )
        })

        if (playerInConnectedNeighborTile.length === 0) return;
        //finish check

        if (possibleDoorConnections.length === 0) {
            return;
        }

        const floorTiles = boardTiles.filter(tile => tile.floor.split(',').includes(floor) && !tile.discarded)

        if (floorTiles.length === 0) {
            console.log('No more tiles here')
            return;
        }

        const randomTile = Math.floor(Math.random() * floorTiles.length)

        boardData[y][x].tile = floorTiles[randomTile]

        const tileDoors = floorTiles[randomTile].doors.split('')

        if (!tileDoors.includes(possibleDoorConnections[0])) {
            for (let i = 0; i < 4; i++) {
                const doorsAfterRotation = getDoors(floorTiles[randomTile].doors, i * 90)
                if (doorsAfterRotation.includes(possibleDoorConnections[0])) {
                    boardData[y][x].rotation = i * 90
                    break;
                }
            }
        }

        const usedTile = boardTiles.find(tile => tile.id === floorTiles[randomTile].id)
        usedTile.discarded = true

        const filteredTiles = boardTiles.filter(tiles => tiles.id !== usedTile.id)

        setBoardTiles([...filteredTiles, usedTile])
        setBoard({ ...board, ground: boardData })
        moveCharacter(boardData[y][x])
    }

    const moveCharacter = (roomTile) => {
        if (mode !== 'active') return;

        const startRoom = board.ground[myToken.position.y][myToken.position.x];

        const startingTileDoors = getDoors(startRoom.tile.doors, startRoom.rotation)
        const destinyTileDors = getDoors(roomTile.tile.doors, roomTile.rotation)

        const xDistance = Math.abs(startRoom.position.x - roomTile.position.x);
        const yDistance = Math.abs(startRoom.position.y - roomTile.position.y)

        if (xDistance + yDistance !== 1) { //can only travel 1 tile each time
            console.log('cannot travel more than a tile each time')
            return;
        }

        const directionTraveling = { from: null, to: null }

        if (startRoom.position.x < roomTile.position.x) {
            console.log('Traveling east')
            directionTraveling.to = 'E';
            directionTraveling.from = 'W';
        } else if (startRoom.position.x > roomTile.position.x) {
            console.log('traveling west')
            directionTraveling.to = 'W';
            directionTraveling.from = 'E'
        } else if (startRoom.position.y > roomTile.position.y) {
            console.log('traveling south')
            directionTraveling.to = 'S'
            directionTraveling.from = 'N'
        } else {
            console.log('traveling north')
            directionTraveling.to = 'N'
            directionTraveling.from = 'S'
        }

        if (destinyTileDors.includes(directionTraveling.from) && startingTileDoors.includes(directionTraveling.to)) {
            console.log('Can travel')
            setMyToken(prev => ({ ...prev, position: { x: roomTile.position.x, y: roomTile.position.y } }))
        } else {
            console.log('cannot travel')
        }

    }

    return (
        <div className='game-room-game-board' style={mode === 'panning' ? { cursor: 'grab' } : {}}>
            <TransformWrapper
                initialPositionX={-2950}
                initialPositionY={-2950}
                // centerOnInit={true}
                initialScale={3.70}
                doubleClick={{ disabled: true }}
                panning={{ disabled: mode !== 'panning' }}
            >
                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                    <>
                        <div className='game-room-board-tools'>
                            <ZoomIn onClick={() => zoomIn()} />
                            <ZoomOut onClick={() => zoomOut()} />
                            <CenterFocusStrong onClick={() => resetTransform()} />
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
                                                        onClick={() => moveCharacter(row)}
                                                        style={{
                                                            bottom: `${row.position.y * TILE_SIZE}px`,
                                                            left: `${row.position.x * TILE_SIZE}px`,
                                                            width: `${TILE_SIZE}px`,
                                                            height: `${TILE_SIZE}px`,
                                                            rotate: `${row.rotation}deg`,
                                                            // borderTop: `${row.tile.doors.includes('N') ? '1px solid green' : 'none'}`,
                                                            // borderBottom: `${row.tile.doors.includes('S') ? '1px solid green' : 'none'}`,
                                                            // borderRight: `${row.tile.doors.includes('E') ? '1px solid green' : 'none'}`,
                                                            // borderLeft: `${row.tile.doors.includes('W') ? '1px solid green' : 'none'}`,

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
                            {players.map(player => (
                                <div
                                    key={player.name}
                                    className='player-token'
                                    style={{
                                        bottom: `${player.position.y * TILE_SIZE}px`,
                                        left: `${player.position.x * TILE_SIZE}px`,
                                    }}
                                >
                                    {player.name}
                                </div>
                            ))}
                            <div
                                key={myToken.name}
                                className='player-token'
                                style={{
                                    bottom: `${myToken.position.y * TILE_SIZE}px`,
                                    left: `${myToken.position.x * TILE_SIZE}px`,
                                }}
                            >
                                {myToken.name}
                            </div>
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>
        </div>
    )
}

export default GameBoard