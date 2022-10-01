import React from 'react'
import { useLocation } from 'react-router-dom'

function Lobby() {
    const { state } = useLocation();

    console.log(state)

    return (
        <div>Lobby</div>
    )
}

export default Lobby