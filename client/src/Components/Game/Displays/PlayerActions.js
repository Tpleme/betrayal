import React from 'react'
import CustomTooltip from '../../Misc/CustomTooltip'
import { IconButton } from '@mui/material'

import AttackIcon from '../../../Assets/Icons/attack.png'
import InventoryIcon from '../../../Assets/Icons/inventory.png'
import MoveIcon from '../../../Assets/Icons/move.png'
import PassTurnIcon from '../../../Assets/Icons/pass-turn.png'

import './PlayerActions.css'

function PlayerActions({ playerMode, setPlayerMode, passTurn, openInventory, myTurn }) {

    const handleClick = (mode) => {
        if (mode === playerMode) {
            setPlayerMode('free')
            return;
        }

        setPlayerMode(mode)
    }

    const handlePassTurnClick = () => {
        setPlayerMode('free');
        passTurn()
    }

    return (
        <div className='game-room-player-actions'>
            <IconButton onClick={openInventory} >
                <CustomTooltip title='View Inventory'>
                    <img className={`action-icon ${playerMode === 'inventory' ? 'active' : ''}`} alt='inventory' src={InventoryIcon} />
                </CustomTooltip>
            </IconButton>
            <IconButton disabled={!myTurn} onClick={() => handleClick('attack')}>
                <CustomTooltip title={playerMode === 'attack' ? 'Exit Attack Mode' : 'Enter Attack Mode'}>
                    <img className={`action-icon ${!myTurn ? 'disabled' : ''} ${playerMode === 'attack' ? 'active' : ''}`} alt='attack' src={AttackIcon} />
                </CustomTooltip>
            </IconButton>
            <IconButton disabled={!myTurn} onClick={() => handleClick('move')}>
                <CustomTooltip title={playerMode === 'move' ? 'Exit Move Mode' : 'Enter Move Mode'}>
                    <img className={`action-icon ${!myTurn ? 'disabled' : ''} ${playerMode === 'move' ? 'active' : ''}`} alt='move' src={MoveIcon} />
                </CustomTooltip>
            </IconButton>
            <IconButton disabled={!myTurn} onClick={handlePassTurnClick} >
                <CustomTooltip title='Pass turn'>
                    <img className={`action-icon ${!myTurn ? 'disabled' : ''}`} alt='pass turn' src={PassTurnIcon} />
                </CustomTooltip>
            </IconButton>
        </div>
    )
}

export default PlayerActions