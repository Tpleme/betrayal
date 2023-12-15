import React, { useEffect, useState } from 'react'

import './TurnDisplay.css'

//TODO timer para inatividade
function TurnDisplay({ turn, turnOrder, players }) {
    const [currentPlayer, setCurrentPlayer] = useState();

    useEffect(() => {
        if (turnOrder && turn !== undefined) {
            const playerTurn = turnOrder[turn]
            const player = players.find(el => el.id === parseInt(playerTurn))
            setCurrentPlayer(player)
        }

    }, [turn, turnOrder])

    return (
        <div className='turn-display-main-div'>
            {currentPlayer &&
                <>
                    <img alt={currentPlayer.character.name} src={`${process.env.REACT_APP_SERVER_URL}/resources/images/characters/${currentPlayer.character.image}`} />
                    <p>{currentPlayer.character.name}'s turn playing</p>
                </>
            }
        </div>
    )
}

export default TurnDisplay