import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SnackbarProvider } from 'notistack';

import Login from './Pages/Login'
import PassReset from './Pages/PassReset'

import { SocketContext, socket } from './Context/socket/socket'
import { UserProvider } from './Context/user';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<SnackbarProvider maxSnack={4}>
		<UserProvider>
			<SocketContext.Provider value={socket}>
				<BrowserRouter>
					<Routes>
						<Route path='/login' element={<Login />} />
						<Route path='/passwordReset' element={<PassReset />} />
						<Route path='/*' element={<App />} />
						<Route path='*' element={<Navigate to='/login' />} />
					</Routes>
				</BrowserRouter>
			</SocketContext.Provider>
		</UserProvider>
	</SnackbarProvider>
);


