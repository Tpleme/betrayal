import React from 'react'
import CustomTooltip from '../../Misc/CustomTooltip'
import { checkIfStatValueIsSameAsIndex, getCharacterStatValue } from './CharacterUtils'

import MightIcon from '../../../Assets/Icons/might.png'
import SpeedIcon from '../../../Assets/Icons/speed.png'
import SanityIcon from '../../../Assets/Icons/sanity.png'
import KnowledgeIcon from '../../../Assets/Icons/knowledge.png'
import SkullIcon from '../../../Assets/Icons/skull.png'

import './CharacterStats.css'


export function CharacterStatsForMenu({ player }) {
    const character = player.character

    const stats = [
        { name: 'Speed', range: character.speed_range.split(','), valueIndex: character.speed_value_index, modifier: player.speed_modifier, icon: SpeedIcon },
        { name: 'Might', range: character.might_range.split(','), valueIndex: character.might_value_index, modifier: player.might_modifier, icon: MightIcon },
        { name: 'Sanity', range: character.sanity_range.split(','), valueIndex: character.sanity_value_index, modifier: player.sanity_modifier, icon: SanityIcon },
        { name: 'Knowledge', range: character.knowledge_range.split(','), valueIndex: character.knowledge_value_index, modifier: player.knowledge_modifier, icon: KnowledgeIcon },
    ]

    return (
        <div className='character-stats-wrapper'>
            {stats.map(stat => (
                <div key={stat.name} className='character-stat-main-div'>
                    <CustomTooltip title={`${stat.name}\nStarting value: ${stat.range[stat.valueIndex]}\nCurrent value: ${getCharacterStatValue(stat.range, stat.valueIndex, stat.modifier)}`}>
                        <div className='character-stat-range-div'>
                            <img alt={stat.name} src={stat.icon} style={{ height: 30, filter: 'invert(1)' }} />
                            {stat.range.map((el, index) => {
                                if (index === 0) {
                                    return <img
                                        key={index}
                                        alt={stat.name}
                                        src={SkullIcon}
                                        className={`character-stat-skull${checkIfStatValueIsSameAsIndex(stat.range, stat.valueIndex + stat.modifier, index) ? ' active' : ''}`}
                                    />
                                }
                                return (
                                    <p
                                        key={index}
                                        className={`character-stat-value${checkIfStatValueIsSameAsIndex(stat.range, stat.valueIndex + stat.modifier, index) ? ' current' : ''}${checkIfStatValueIsSameAsIndex(stat.range, stat.valueIndex, index) ? ' default' : ''}`}
                                    >
                                        {el}
                                    </p>
                                )
                            }
                            )}
                        </div>
                    </CustomTooltip>
                </div>
            ))}
        </div>
    )
}
