import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom'
import useToken from './Components/Hooks/useToken'

import Game from './Pages/Game'
import Lobby from './Pages/Lobby'
import Room from './Pages/Room'
import { useEffect } from 'react';

function App() {
	const { token } = useToken()
	const navigate = useNavigate()

	useEffect(() => {
		if (!token) navigate('/login', { replace: true })
		return;
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
