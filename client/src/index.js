import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './Pages/Login'
import PassReset from './Pages/PassReset'


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<BrowserRouter>
		<Routes>
			<Route path='/login' element={<Login />} />
			<Route path='/passwordReset' element={<PassReset />} />
			<Route path='/*' element={<App />} />
			<Route path='*' element={<Navigate to='/login' />} />
		</Routes>
	</BrowserRouter>
);


