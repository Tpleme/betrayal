import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom'
import useToken from './Components/CustomHooks/useToken'

// import { io } from 'socket.io-client'

// const socket = io('http://localhost:3000')

import Game from './Pages/Game'
import Lobby from './Pages/Lobby'
import Room from './Pages/Room'
import { useEffect } from 'react';

function App() {
	const { token } = useToken()
	const navigate = useNavigate()
	console.log(token)

	useEffect(() => {
		if (!token) navigate('/login', { replace: true })
	}, [token])

	return (
		<div>
			<Routes>
				<Route path='/' element={<Game />} />
				<Route path='/lobby' element={<Lobby />} />
				<Route path='/room' element={<Room />} />
			</Routes>
		</div>
	);
}

export default App;
