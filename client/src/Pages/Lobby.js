import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import './css/Lobby.css'

function Lobby() {
    const { state } = useLocation();

    return (
        <div className='lobby-main-div'>
            <div className='lobby-characters-div'>

            </div>
            <div className='lobby-bottom-div'>
                <div className='lobby-settings-div'>

                </div>
                <div className='lobby-information'>
                    <div className='lobby-info-div'>
                        <p className='lobby-info-title'>Lobby info</p>
                        <p className='lobby-info-text'>{state.room_id}</p>
                    </div>
                    <div className='connected-players-div'>
                        <p className='lobby-info-title'>Connected Players</p>
                    </div>
                </div>
                <div className='lobby-chat-div'>

                </div>
            </div>
        </div>
    )
}

export default Lobby