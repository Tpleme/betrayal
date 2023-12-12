import React from 'react'
import CustomTooltip from '../Misc/CustomTooltip'

import AttackIcon from '../../Assets/Icons/attack.png'
import InventoryIcon from '../../Assets/Icons/inventory.png'
import MoveIcon from '../../Assets/Icons/move.png'
import PassTurnIcon from '../../Assets/Icons/pass-turn.png'

import './PlayerActions.css'

function PlayerActions({ playerMode, setPlayerMode, passTurn, openInventory }) {

    const handleClick = (mode) => {
        if (mode === playerMode) {
            setPlayerMode('free')
            return;
        }

        setPlayerMode(mode)
    }

    return (
        <div className='game-room-player-actions'>
            <CustomTooltip title='View Inventory'>
                <img className={`action-icon ${playerMode === 'inventory' ? 'active' : ''}`} alt='inventory' src={InventoryIcon} onClick={openInventory} />
            </CustomTooltip>
            <CustomTooltip title={playerMode === 'attack' ? 'Exit Attack Mode' : 'Enter Attack Mode'}>
                <img className={`action-icon ${playerMode === 'attack' ? 'active' : ''}`} alt='attack' src={AttackIcon} onClick={() => handleClick('attack')} />
            </CustomTooltip>
            <CustomTooltip title={playerMode === 'move' ? 'Exit Move Mode' : 'Enter Move Mode'}>
                <img className={`action-icon ${playerMode === 'move' ? 'active' : ''}`} alt='move' src={MoveIcon} onClick={() => handleClick('move')} />
            </CustomTooltip>
            <CustomTooltip title='Pass turn'>
                <img className='action-icon' alt='pass turn' src={PassTurnIcon} onClick={passTurn} />
            </CustomTooltip>
        </div>
    )
}

export default PlayerActions