import React from 'react'
import Image from '../../Misc/Image'

import './PickCharacterCard.css'

function PickCharacterCard({ character }) {
    console.log(character)
    return (
        <div className='pick-character-card-main-div'>
            <Image
                alt={character.name} src={character.image}
                entity='characters'
                className='pick-character-card-image'
            />
            <div className='pick-character-card-info'>
                <p className='pick-character-card-name'>{character.name}</p>
            </div>
        </div>
    )
}

export default PickCharacterCard