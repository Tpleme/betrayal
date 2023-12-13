import React, { useState, useEffect } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { RotateRight } from '@mui/icons-material'
import { getEntity } from '../../../API/requests'
import BoardViewActions from './BoardViewActions'
import { getVisualPlayerPosition, getDoors } from './GameRoomUtils'

import './GameBoard.css'
import CustomTooltip from '../../Misc/CustomTooltip'
import PlayerToken from '../../Tokens/PlayerToken'

const TILE_SIZE = 70
const BOARD_SIZE = 2000

function GameBoard({ players, setPlayers, myToken, setMyToken, playerMode, movePlayer, socket, roomSocket }) {
    const [boardTiles, setBoardTiles] = useState([])
    const [board, setBoard] = useState({ basement: [], ground: [], upper: [] })
    const [viewMode, setViewMode] = useState('active')
    const [lastSpawnedTile, setLastSpawnedTile] = useState(null)

    useEffect(() => {
        socket.on('on_tile_spawn', onTileSpawned)

        return () => {
            socket.off('on_tile_spawn', onTileSpawned)
        }
    }, [])


    useEffect(() => {
        getEntity('roomTiles').then(res => {
            const tiles = res.data.restTiles.map(tile => {
                return { ...tile, discarded: false }
            })

            setBoardTiles(tiles);
            buildBoard(res.data.initialTiles)
        }, err => {
            console.log(err)
        })

        document.addEventListener('keydown', (e) => onKeyDown(e))
        document.addEventListener('keyup', (e) => onKeyUp(e))

        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.removeEventListener('keyup', onKeyUp)
        }
    }, [])

    const onKeyDown = e => {
        if (e.keyCode === 17) {
            setViewMode('panning')
        }
    }

    const onKeyUp = e => {
        if (e.keyCode === 17) {
            setViewMode('active')
        }
    }

    const onTileSpawned = (data) => {
        console.log(data)
        setBoardTiles(data.boardTiles)
        setBoard(data.board)
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

            const boardCenter = Math.floor(tileCount / 2)

            board.ground[boardCenter][boardCenter].tile = entrance
            board.ground[boardCenter][boardCenter].rotation = 90

            board.ground[boardCenter + 1][boardCenter].tile = foyer
            board.ground[boardCenter + 1][boardCenter].rotation = 90

            board.ground[boardCenter + 2][boardCenter].tile = staircase
            board.ground[boardCenter + 2][boardCenter].rotation = 90

            const playersWithPosition = players.map(player => ({
                ...player,
                position: { x: boardCenter, y: boardCenter },
                navigationHistory: [board.ground[boardCenter][boardCenter], ...player.navigationHistory]
            }))

            setPlayers(playersWithPosition)

            setMyToken(prev => ({
                ...prev,
                position: { x: boardCenter, y: boardCenter },
                navigationHistory: [board.ground[boardCenter][boardCenter], ...prev.navigationHistory]
            }))
        }
    }

    const spawnTile = (x, y, floor) => {
        if (viewMode !== 'active') return;
        if (playerMode !== 'move') return;

        const boardData = board.ground

        const rightTile = boardData[y][x + 1] ? { data: boardData[y][x + 1], side: 'E' } : null
        const leftTile = boardData[y][x - 1] ? { data: boardData[y][x - 1], side: 'W' } : null
        const upperTile = boardData[y + 1] ? { data: boardData[y + 1][x], side: 'N' } : null
        const bottomTile = boardData[y - 1] ? { data: boardData[y - 1][x], side: 'S' } : null

        const neighborTiles = [rightTile, leftTile, upperTile, bottomTile]

        const possibleDoorConnections = []

        //por cada sala com tile a volta, verifica se tem ligação
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
                if (doorsAfterRotation.includes(playerInConnectedNeighborTile[0].side)) {
                    boardData[y][x].rotation = i * 90
                    break;
                }
            }
        }

        const usedTile = boardTiles.find(tile => tile.id === floorTiles[randomTile].id)
        usedTile.discarded = true

        const filteredTiles = boardTiles.filter(tiles => tiles.id !== usedTile.id)
        const newBoardTIles = [...filteredTiles, usedTile]
        const newBoard = { ...board, ground: boardData }


        setLastSpawnedTile(boardData[y][x])
        setBoardTiles(newBoardTIles)
        setBoard(newBoard)

        socket.emit('spawn_tile', { boardTiles: newBoardTIles, board: newBoard, roomSocket })

        moveCharacter(boardData[y][x])
    }

    const moveCharacter = (roomTile) => {
        if (viewMode !== 'active') return;
        if (playerMode !== 'move') return;

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
            directionTraveling.to = 'E';
            directionTraveling.from = 'W';
        } else if (startRoom.position.x > roomTile.position.x) {
            directionTraveling.to = 'W';
            directionTraveling.from = 'E'
        } else if (startRoom.position.y > roomTile.position.y) {
            directionTraveling.to = 'S'
            directionTraveling.from = 'N'
        } else {
            directionTraveling.to = 'N'
            directionTraveling.from = 'S'
        }

        if (destinyTileDors.includes(directionTraveling.from) && startingTileDoors.includes(directionTraveling.to)) {
            movePlayer(roomTile)
        }
    }

    const getPositionOfPlayer = (player) => {

        const playerInSameRoomAsMyToken = [...players, myToken].filter(el => el.position.x === player.position.x && el.position.y === player.position.y)

        const playerIndex = playerInSameRoomAsMyToken.findIndex(el => el.id === player.id)

        return getVisualPlayerPosition(playerInSameRoomAsMyToken.length - 1, playerIndex)
    }

    const manuallyRotateTile = (e, tile) => {
        e.stopPropagation()

        const fromTile = myToken.navigationHistory[1]
        const boardTile = board.ground[tile.position.y][tile.position.x];

        const xDistance = fromTile.position.x - boardTile.position.x
        const yDistance = fromTile.position.y - boardTile.position.y

        //calculate the door where the player came so we can force the new position to have a door in that direction
        let doorFromWherePlayerCame;

        if (xDistance !== 0) {
            if (xDistance > 0) doorFromWherePlayerCame = 'E'
            else doorFromWherePlayerCame = 'W'
        } else {
            if (yDistance > 0) doorFromWherePlayerCame = 'N'
            else doorFromWherePlayerCame = 'S'
        }

        const rotate = () => {
            if (boardTile.rotation + 90 >= 360) {
                boardTile.rotation = 0
            } else {
                boardTile.rotation += 90
            }

            //if the none of the doors with the rotation match the doorFromWherePlayerCame, rotate again
            if (!getDoors(boardTile.tile.doors, boardTile.rotation).includes(doorFromWherePlayerCame)) rotate()
        }

        rotate()

        const groundTiles = board.ground;
        groundTiles[[tile.position.y][tile.position.x]] = boardTile

        setBoard(prev => ({ ...prev, ground: groundTiles }))
    }

    const getRotatingButton = (tile) => {

        //if tile has 1 or 4 doors or it is not the last spawned tile return nothing
        if ([1, 4].some((el) => el === tile.doors.length) || lastSpawnedTile?.tile.id !== tile.id) return "";

        return (
            <CustomTooltip title='Rotate Tile'>
                <RotateRight className='rotate-tile-icon' onClick={(e) => manuallyRotateTile(e, lastSpawnedTile)} />
            </CustomTooltip>
        )
    }

    return (
        <div className='game-room-game-board' style={viewMode === 'panning' ? { cursor: 'grab' } : {}}>
            <TransformWrapper
                initialPositionX={-2150}
                initialPositionY={-2200}
                // centerOnInit={true}
                initialScale={3.0}
                doubleClick={{ disabled: true }}
                panning={{ disabled: viewMode !== 'panning' }}
            >
                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                    <>
                        <BoardViewActions mode={viewMode} setMode={setViewMode} zoomIn={zoomIn} zoomOut={zoomOut} resetTransform={resetTransform} />
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
                                                        }}
                                                    >
                                                        {getRotatingButton(row.tile)}
                                                        <img
                                                            alt={row.tile.name}
                                                            src={`${process.env.REACT_APP_SERVER_URL}/resources/images/roomTiles/${row.tile.image}`}
                                                            style={{ rotate: `${row.rotation}deg` }}
                                                        />
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div
                                                        className='game-room-board-tile empty'
                                                        key={`${index}-empty`}
                                                        onClick={() => spawnTile(row.position.x, row.position.y, '1')}
                                                        style={{
                                                            bottom: row.position.y * TILE_SIZE,
                                                            left: row.position.x * TILE_SIZE,
                                                            width: TILE_SIZE,
                                                            height: TILE_SIZE
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
                                <PlayerToken
                                    key={player.id}
                                    player={player}
                                    tokenStyle={getPositionOfPlayer(player)}
                                    wrapperStyle={{
                                        width: `${TILE_SIZE}px`,
                                        height: `${TILE_SIZE}px`,
                                        bottom: `${player.position.y * TILE_SIZE}px`,
                                        left: `${player.position.x * TILE_SIZE}px`,
                                    }}
                                />
                            ))}
                            <PlayerToken
                                key={myToken.id}
                                player={myToken}
                                tokenStyle={getPositionOfPlayer(myToken)}
                                wrapperStyle={{
                                    width: `${TILE_SIZE}px`,
                                    height: `${TILE_SIZE}px`,
                                    bottom: `${myToken.position.y * TILE_SIZE}px`,
                                    left: `${myToken.position.x * TILE_SIZE}px`,
                                }}
                            />
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>
        </div>
    )
}

export default GameBoard