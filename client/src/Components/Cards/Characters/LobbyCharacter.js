import React from 'react'
import Image from '../../Misc/Image'

import './LobbyCharacter.css'

function LobbyCharacter(props) {
    console.log(props)
    return (
        <div className='character-card-main-div'>
            <Image
                alt={props.character.name} src={props.character.image}
                entity='characters'
                className='character-lobby-char-portrait'
            />
            <p className='char-lobby-card-player-name'>{props.player}</p>
            <p style={{ fontSize: '18px' }}>As</p>
            <p style={{ fontSize: '22px', fontFamily: 'xerox' }}>{props.character.name}</p>
        </div>
    )
}

export default LobbyCharacter