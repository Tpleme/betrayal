import React, { useContext, useEffect, useState } from 'react'
import Chat from '../Components/Chat/Chat'
import { useUserInfo } from '../Hooks/useUser'
import PlayerStatistics from '../Components/Panels/Statistics/PlayerStatistics'
import Button from '../Components/Buttons/Button'
import { SocketContext } from '../Context/socket/socket'
import { useNavigate } from 'react-router-dom'
import LoadingDialog from '../Components/Dialogs/LoadingDialog'
import CreateRoomDialog from '../Components/Dialogs/CreateRoom/CreateRoomDialog'
import JoinRoomDialog from '../Components/Dialogs/JoinRoom/JoinRoomDialog'
import PassWordDialog from '../Components/Dialogs/PasswordDialog/PasswordDialog'
import useGlobalSnackbar from '../Hooks/useGlobalSnackbar'

import './css/Game.css'

function Game() {
	const [openLoadingDialog, setOpenLoadingDialog] = useState(false)
	const [openJoinLoading, setOpenJoinLoading] = useState(false)
	const [openCreateGameRoom, setOpenCreateGameRoom] = useState(false)
	const [openJoinRoom, setOpenJoinRoom] = useState(false)
	const [openPasswordDialog, setOpenPasswordDialog] = useState(false)
	const [savedRoomId, setSavedRoomId] = useState(null)

	const { userInfo } = useUserInfo()
	const socket = useContext(SocketContext)
	const navigate = useNavigate()
	const { showSnackbar } = useGlobalSnackbar()

	useEffect(() => {

		socket.on('room_created', data => handleRoomCreated(data))
		socket.on('join-room-response', data => handleJoinRoomResponse(data))

		return () => {
			socket.off('room_created', handleRoomCreated)
			socket.off('join-room-response', handleJoinRoomResponse)
		}
	}, [])

	const handleRoomCreated = (data) => {
		setOpenLoadingDialog(false)
		navigate('lobby', { state: data, replace: true })
	}

	const handleCreateRoom = (pass) => {
		setOpenCreateGameRoom(false)
		setOpenLoadingDialog(true)
		setTimeout(() => {
			socket.emit('create-room', { user: userInfo, password: pass })
		}, 2000)
	}


	const handleJoinRoomResponse = (data) => {
		switch (data.code) {
			case 0:
				setOpenJoinLoading(true)
				setTimeout(() => {
					setOpenJoinLoading(false)
					navigate('lobby', { state: data, replace: true });
				}, 2000)
				break;
			case 1:
				setSavedRoomId(data.roomId)
				setOpenPasswordDialog(true)
				setOpenJoinRoom(false)
				break;
			default: showSnackbar({ message: data.message, variant: 'error' })
		}
	}

	const handleJoinRoom = (roomId, password) => {
		socket.emit('join-room', { roomId, userId: userInfo.id, password })
	}

	return (
		<div className='game-main-div'>
			<p className='game-div-title'>{`Welcome, ${userInfo.name}`}</p>
			<div className='game-content-div'>
				<div className='game-left-and-right-div'>
					<div className='game-left-side'>
						<PlayerStatistics />
					</div>
					<div className='game-right-side'>
						<p className='game-section-title'>Join or Create Game</p>
						<div className='game-join-create-buttons'>
							<div className='button-div first'>
								<Button size='big' label='Create Game' onClick={() => setOpenCreateGameRoom(true)} />
								<p className='create-game-description'>
									Create a new game to play with your friends. Creating a game gives you the possibility to invite people and manage game settings
								</p>
							</div>
							<div className='button-div'>
								<Button size='big' label='Join Game' onClick={() => setOpenJoinRoom(true)} />
								<p className='create-game-description'>
									Join an already existing game, to join a game you need the code that the host the game shared with you.
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className='game-chat-side'>
					<Chat />
				</div>
			</div>
			<LoadingDialog open={openLoadingDialog} close={() => setOpenLoadingDialog(false)} message='Creating room, please wait...' />
			<LoadingDialog open={openJoinLoading} close={() => setOpenJoinLoading(false)} message='Joining room, please wait...' />
			<CreateRoomDialog open={openCreateGameRoom} close={() => setOpenCreateGameRoom(false)} submit={handleCreateRoom} />
			<JoinRoomDialog open={openJoinRoom} close={() => setOpenJoinRoom(false)} submit={handleJoinRoom} />
			<PassWordDialog open={openPasswordDialog} close={() => setOpenPasswordDialog(false)} submit={handleJoinRoom} savedRoomId={savedRoomId} />
		</div>
	)
}

export default Game