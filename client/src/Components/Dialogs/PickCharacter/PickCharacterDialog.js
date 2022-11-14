import React from 'react'
import PickCharacterCard from '../../Cards/Characters/PickCharacterCard'
import DialogPrefab from '../DialogPrefab'

import './PickCharacterDialog.css'

function PickCharacterDialog(props) {
    return (
        <DialogPrefab
            open={props.open}
            close={props.close}
            maxWidth='md'
        >
            <div className='pick-char-main-div'>
                {props.data.map(char => {
                    return (
                        <PickCharacterCard key={char.id} character={char} onPick={props.onCharPick} />
                    )
                })}
            </div>
        </DialogPrefab>
    )
}

export default PickCharacterDialog