import React from 'react'
import PickCharacterCard from '../../Cards/Characters/PickCharacterCard'
import DialogPrefab from '../DialogPrefab'

import './PickCharacterDialog.css'

function PickCharacterDialog(props) {

    const handlePickChar = (char) => {
        props.close()
        props.onCharPick(char)
    }

    return (
        <DialogPrefab
            open={props.open}
            close={props.close}
            maxWidth='lg'
        >
            <div className='pick-char-main-div'>
                <p className='pick-char-dialog-title'>Pick a character</p>
                <div className='pick-char-dialog-content'>
                    {props.data.map(char => {
                        return (
                            <PickCharacterCard key={char.id} character={char} onPick={() => handlePickChar(char)} />
                        )
                    })}
                </div>
            </div>
        </DialogPrefab>
    )
}

export default PickCharacterDialog