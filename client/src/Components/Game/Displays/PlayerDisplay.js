import React from 'react'
import { CharacterStatsForMenu } from '../Character/CharacterStats'

import './PlayerDisplay.css'

function PlayerDisplay({ player }) {
    return (
        <div className='player-display-div'>
            <div className='player-display-image-text-wrapper'>
                <img
                    alt={player.character.name}
                    className='player-display-image'
                    src={`${process.env.REACT_APP_SERVER_URL}/resources/images/characters/${player.character.image}`}
                />
                <div className='player-display-names'>
                    <p>{player.character.name}</p>
                    <p>{player.user.name}</p>
                </div>
            </div>
                <div className='player-display-stats'>
                    <p className='player-display-stats-title'>Character Current Stats</p>
                    <CharacterStatsForMenu player={player} />
                </div>
        </div>
    )
}

export default PlayerDisplay