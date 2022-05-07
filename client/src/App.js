import './App.css';
import { Routes, Route } from 'react-router-dom'

// import { io } from 'socket.io-client'

// const socket = io('http://localhost:3000')

import Game from './Pages/Game'
import Lobby from './Pages/Lobby'
import Room from './Pages/Room'

function App() {

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
