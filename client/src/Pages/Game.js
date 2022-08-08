import React from 'react'
import Chat from '../Components/Chat/Chat'
import { useUserInfo } from '../Hooks/useUser'
import PlayerStatistics from '../Components/Panels/Statistics/PlayerStatistics'
import MainMenuButton from '../Components/Buttons/MainMenuButton'

import './css/Game.css'

function Game() {
	const { userInfo } = useUserInfo()

	return (
		<div className='game-main-div'>
			<p className='game-div-title'>{`Welcome, ${userInfo.name}`}</p>
			<div className='game-content-div'>
				<div className='game-left-and-right-div'>
					<div className='game-left-side'>
						<PlayerStatistics />
					</div>
					<div className='game-right-side'>
						<p className='game-section-title'>Join or Create Game</p>
						<div className='game-join-create-buttons'>
							<div className='button-div first'>
								<MainMenuButton label='Create Game' />
								<p className='create-game-description'>
									Create a new game to play with your friends. Creating a game gives you the possibility to invite people and manage game settings
								</p>
							</div>
							<div className='button-div'>
								<MainMenuButton label='Join Game' />
								<p className='create-game-description'>
									Join an already existing game, to join a game you need the code that the host the game shared with you.
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className='game-chat-side'>
					<Chat />
				</div>
			</div>
		</div>
	)
}

export default Game