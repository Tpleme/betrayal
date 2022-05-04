import './App.css';
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

function App() {

	const emitMessage = () => {
		socket.emit('chat message', 'hello there');
	}

	return (
		<div className="App">
			<h1>Hello World</h1>
			<button onClick={emitMessage}>test</button>
		</div>
	);
}

export default App;
