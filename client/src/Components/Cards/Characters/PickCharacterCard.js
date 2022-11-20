import React from 'react'
import Image from '../../Misc/Image'
import Button from '../../Buttons/Button'
import { Divider } from '@mui/material'

import './PickCharacterCard.css'

function PickCharacterCard({ character, ...props }) {
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
                <Divider sx={{ backgroundColor: 'white', width: '65%' }} />
                <CharacterStats character={character} />
                <p>Age: <span>{character.age}</span></p>
                <p>Birthday: <span>{character.birthday}</span></p>
                <p>Hobbies: <span>{character.hobbies}</span></p>
                <p>Fears: <span>{character.fears}</span></p>
                <span>{character.description}</span>
            </div>
            <Button
                style={{ position: 'absolute', top: '15px', right: '10px' }}
                label={`Pick ${character.name}`}
                onClick={props.onPick}
            />
        </div>
    )
}

export default PickCharacterCard

const CharacterStats = ({ character }) => {
    return (
        <div className='pick-character-stats'>
            <p>Might: <span>{character.might}</span></p>
            <p>Speed: <span>{character.speed}</span></p>
            <p>Knowledge: <span>{character.knowledge}</span></p>
            <p>Sanity: <span>{character.sanity}</span></p>
        </div>
    )
}