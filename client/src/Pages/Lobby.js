import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getEntity } from '../API/requests';

import CharacterCard from '../Components/Cards/Characters/LobbyCharacter';

import './css/Lobby.css'

function Lobby() {
    const { state } = useLocation();
    const [allCharacters, setAllCharacters] = useState([])

    useEffect(() => {
        getEntity('characters').then(res => {
            console.log(res)
            setAllCharacters(res.data)
        }, err => {
            console.log(err)
        })
    }, [])

    return (
        <div className='lobby-main-div'>
            <div className='lobby-characters-div'>
                {allCharacters.length > 0 &&
                <>
                    <CharacterCard player='Tpleme' character={allCharacters[0]} />
                    <CharacterCard player='Tpleme' character={allCharacters[1]} />
                    <CharacterCard player='Tpleme' character={allCharacters[2]} />
                    <CharacterCard player='Tpleme' character={allCharacters[3]} />
                    <CharacterCard player='Tpleme' character={allCharacters[4]} />
                    <CharacterCard player='Tpleme' character={allCharacters[5]} />
                </>
                }
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