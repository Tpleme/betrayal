import { useEffect, useContext, useState } from 'react';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom'
import useToken from './Hooks/useToken'
import { useUserInfo } from './Hooks/useUser'
import { verifyUser } from './API/requests';
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
	const { userInfo, setUserInfo } = useUserInfo()

	useEffect(() => {
		let timer;
		console.log(token)
		if (!token) {
			navigate('/login', { replace: true })
			return;
		}

		async function connectSocket() {
			if (socket.connected) return
			socket.auth = { uuid: sessionStorage.getItem('id'), name: sessionStorage.getItem('name'), token: token }
			socket.connect();
		}

		connectSocket().then(() => {
			timer = setTimeout(() => setPageReady(), 1000)
		})

		verifyUser(token.split('/')[0], token).then(res => {
			const { name, id, email, picture } = res.data
			setUserInfo({ name, id, email, picture, token: token })
		}, err => {
			console.log(err)
			navigate('/login', { replace: true });
		})

		return () => clearTimeout(timer, setPageReady())
	}, [token])

	const setPageReady = () => {
		setReady(true)
	}


	return (
		<div>
			{ready ?
				<ModalProvider>
					{userInfo.id && <TopPanel />}
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
