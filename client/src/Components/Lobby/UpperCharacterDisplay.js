import React, { useState } from 'react'
import Button from '../Buttons/Button'
import LobbyCharacter from '../Cards/Characters/LobbyCharacter'
import PickCharacterDialog from '../Dialogs/Lobby/PickCharacterDialog'

import './UpperCharacterDisplay.css'

function UpperCharacterDisplay({ players, myInfo, allCharacters, onCharPick }) {
    const [openPickCharacter, setOpenPickCharacter] = useState(false)

    const repickCharacter = player => {
        if (player.user.id === myInfo.user.id) {
            setOpenPickCharacter(true)
        }
    }

    return (
        <>
            {players.map(player => {
                return (
                    player.character &&
                    <LobbyCharacter key={player.user.id} player={player.user} character={player.character} onClick={() => repickCharacter(player)} myInfo={myInfo} />

                )
            })}
            {!myInfo?.character &&
                <div className='pick-character-background'>
                    <Button label='Pick a Character' onClick={() => setOpenPickCharacter(true)} />
                </div>
            }
            <PickCharacterDialog open={openPickCharacter} close={() => setOpenPickCharacter(false)} data={allCharacters} onCharPick={char => onCharPick(myInfo.user.id, char.id)} players={players} />
        </>
    )
}

export default UpperCharacterDisplay