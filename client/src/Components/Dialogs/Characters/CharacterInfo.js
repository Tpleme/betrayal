import React from 'react'
import DialogPrefab from '../DialogPrefab'
import Image from '../../Misc/Image'
import CharacterStatsRadar from '../../Charts/CharacterStatsRadar'

import './CharacterInfo.css'

function CharacterInfo({ character, ...props }) {

    return (
        <DialogPrefab
            open={props.open}
            close={props.close}
            maxWidth='sm'
        >
            <div className='character-more-info-div'>
                <div className='character-more-info-image-fade-in' />
                <Image
                    alt={character.name} src={character.image}
                    entity='characters'
                    className='character-more-info-image'
                />
                <p className='character-more-info-name'>{character.name}</p>
                <p className='character-more-info-description'>{character.description}</p>
                <div className='character-more-info-data'>
                    <p>Age:<span style={{ color: 'white', margin: '5px' }}>{character.age}</span></p>
                    <p>Birthday:<span style={{ color: 'white', margin: '5px' }}>{character.birthday}</span></p>
                    <p>Fears:<span style={{ color: 'white', margin: '5px' }}>{character.fears}</span></p>
                    <p>Hobbies:<span style={{ color: 'white', margin: '5px' }}>{character.hobbies}</span></p>
                </div>
                <div className='character-more-info-bottom-div'>
                    <CharacterStatsRadar
                        data={
                            [
                                { stat: 'Might', value: character.might },
                                { stat: 'Speed', value: character.speed },
                                { stat: 'Sanity', value: character.sanity },
                                { stat: 'Knowledge', value: character.knowledge },
                            ]
                        }
                        responsive={true}
                    />
                </div>
            </div>
        </DialogPrefab>
    )
}

export default CharacterInfo