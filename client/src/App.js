import { useEffect, useContext, useState } from 'react';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom'
import useToken from './Hooks/useToken'
import { useUserInfo } from './Hooks/useUser'
import { getEntity } from './API/requests';
import ModalProvider from 'mui-modal-provider'

import { SocketContext } from './Context/socket/socket'

import TopPanel from './Components/Panels/TopPanel/TopPanel';
import Game from './Pages/Game'
import Lobby from './Pages/Lobby'
import Room from './Pages/Room'


function App() {
	const { token } = useToken()
	const navigate = useNavigate()
	const [ready, setReady] = useState(false)

	const socket = useContext(SocketContext)
	const { setUserInfo } = useUserInfo()
	let timer;

	useEffect(() => {

		if (!token) {
			navigate('/login', { replace: true })
			return;
		}
		connectSocket()


		return () => clearTimeout(timer, getUser)
	}, [token])

	const connectSocket = async () => {
		if (socket.connected) {
			getUser();
			return;
		}
		socket.auth = { uuid: sessionStorage.getItem('id'), token: token }
		socket.connect();
		timer = setTimeout(() => getUser(), 1000)
	}

	const getUser = () => getEntity('users', sessionStorage.getItem('id')).then(res => {
		setUserInfo({ ...res.data, token })
		setReady(true)
	}, err => {
		console.log(err)
		navigate('/login', { replace: true })
	})

	return (
		<div>
			{ready ?
				<ModalProvider>
					<TopPanel />
					<Routes>
						<Route path='/' element={<Game />} />
						<Route path='/lobby' element={<Lobby />} />
						<Route path='/room' element={<Room />} />
					</Routes>
				</ModalProvider>
				:
				<div className='loading-page'>
					{/* <img alt='SalesShaker Logo' src={Logo} className='loading-logo' /> */}
					<p>Loading</p>
					{/* <Bars height='50px' fill='var(--dark-' /> */}
				</div>
			}
		</div>
	);
}

export default App;
