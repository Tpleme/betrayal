import { useEffect } from 'react';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom'
import useToken from './Hooks/useToken'
import { useUserInfo } from './Hooks/useUser'
import { getUser } from './API/requests';
import ModalProvider from 'mui-modal-provider'

import TopPanel from './Components/Panels/TopPanel/TopPanel';
import Game from './Pages/Game'
import Lobby from './Pages/Lobby'
import Room from './Pages/Room'

function App() {
	const { token } = useToken()
	const navigate = useNavigate()

	const { userInfo, setUserInfo } = useUserInfo()

	useEffect(() => {
		if (!token) {
			navigate('/login', { replace: true })
			return;
		}

		getUser(token.split('/')[0], token).then(res => {
			const { name, id, email, picture } = res.data
			setUserInfo({ name, id, email, picture, token: token })
		}, err => {
			console.log(err)
			navigate('/login', { replace: true });
		})
	}, [token])

	return (
		<div>
			<ModalProvider>
				{userInfo.id && <TopPanel />}
				<Routes>
					<Route path='/' element={<Game />} />
					<Route path='/lobby' element={<Lobby />} />
					<Route path='/room' element={<Room />} />
				</Routes>
			</ModalProvider>
		</div>
	);
}

export default App;
