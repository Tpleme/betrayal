import React from 'react'
import CustomTooltip from '../Misc/CustomTooltip'

import AttackIcon from '../../Assets/Icons/attack.png'
import InventoryIcon from '../../Assets/Icons/inventory.png'
import MoveIcon from '../../Assets/Icons/move.png'
import PassTurnIcon from '../../Assets/Icons/pass-turn.png'

import './PlayerActions.css'

function PlayerActions() {
    return (
        <div className='game-room-player-actions'>
            <CustomTooltip title='View Inventory'>
                <img alt='inventory' src={InventoryIcon} />
            </CustomTooltip>
            <CustomTooltip title='Enter attack mode'>
                <img alt='attack' src={AttackIcon} />
            </CustomTooltip>
            <CustomTooltip title='Enter move mode'>
                <img alt='move' src={MoveIcon} />
            </CustomTooltip>
            <CustomTooltip title='Pass turn'>
                <img alt='pass turn' src={PassTurnIcon} />
            </CustomTooltip>
        </div>
    )
}

export default PlayerActions