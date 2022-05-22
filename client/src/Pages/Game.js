import React from 'react'
import { io } from 'socket.io-client'

function Game() {


	const socket = io('http://localhost:3000')

	return (
		<div>Game</div>
	)
}

export default Game