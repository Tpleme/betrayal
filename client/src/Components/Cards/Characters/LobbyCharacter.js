import React from 'react'
import Image from '../../Misc/Image'

import './LobbyCharacter.css'

function LobbyCharacter({ onClick, ...props }) {
    const me = props.myInfo.user.id === props.player.id

    return (
        <div className='character-card-main-div' onClick={onClick}>
            <Image
                alt={props.character.name} src={props.character.image}
                entity='characters'
                className={`character-lobby-char-portrait${me ? ' selectable' : ''}`}
            />
            <p className='char-lobby-card-player-name'>{props.player.name}</p>
            <p style={{ fontSize: '18px' }}>As</p>
            <p style={{ fontSize: '22px', fontFamily: 'xerox' }}>{props.character.name}</p>
            {me &&
                <p className='change-character-text'>Click to change Character</p>
            }
        </div>
    )
}

export default LobbyCharacter