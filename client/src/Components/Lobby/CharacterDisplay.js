import React, { useState } from 'react'
import CustomTooltip from '../Misc/CustomTooltip'
import { Help } from '@mui/icons-material'
import Image from '../Misc/Image'
import CharacterStatsRadar from '../Charts/CharacterStatsRadar'
import CharacterInfo from '../Dialogs/Characters/CharacterInfo'

import './CharacterDisplay.css'

function CharacterDisplay({ myInfo }) {
    const [openCharacterInfo, setOpenCharacterInfo] = useState(false)

    return (
        <div className='lobby-character-info-div'>
            {myInfo.character ?
                <>
                    <CustomTooltip title='View more info'>
                        <Help className='lobby-character-info-help' onClick={() => setOpenCharacterInfo(true)} />
                    </CustomTooltip>
                    <div className='lobby-character-info-left-div'>
                        <Image
                            alt={myInfo.character.name} src={myInfo.character.image}
                            entity='characters'
                            className='lobby-character-info-image'
                            style={{ boxShadow: `0px 0px 8px 3px ${myInfo.character.color}` }}
                        />
                    </div>
                    <div className='lobby-character-info-chart'>
                        <CharacterStatsRadar
                            data={
                                [
                                    { stat: 'Might', value: myInfo.character.might },
                                    { stat: 'Speed', value: myInfo.character.speed },
                                    { stat: 'Sanity', value: myInfo.character.sanity },
                                    { stat: 'Knowledge', value: myInfo.character.knowledge },
                                ]
                            }
                        />
                    </div>
                    <CharacterInfo open={openCharacterInfo} close={() => setOpenCharacterInfo(false)} character={myInfo.character} />
                </>
                :
                <p className='lobby-character-info-text'>Pick a character to see it here</p>
            }
        </div>
    )
}

export default CharacterDisplay