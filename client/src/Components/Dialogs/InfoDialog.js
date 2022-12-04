import Button from '../Buttons/Button'
import React from 'react'
import DialogPrefab from './DialogPrefab'

import './InfoDialog.css'

function InfoDialog(props) {
    return (
        <DialogPrefab
            open={props.open}
            close={props.close}
            maxWidth='xs'
            preventOutSideClose={props.preventOutSideClose}
            preventClose={props.preventClose}
        >
            <div className='info-dialog-main-div'>
                <div className='info-dialog-message'>
                    <p>{props.message}</p>
                </div>
                <div className='info-dialog-actions-div'>
                    {props.type === "y/n" ? (
                        <>
                            <Button size='small' onClick={props.ycb} label='Yes' />
                            <Button size='small' onClick={props.ncb} label='No' />
                        </>
                    ) : (
                        <Button size='small' onClick={props.ocb} label='Ok' />
                    )}
                </div>
            </div>
        </DialogPrefab>
    )
}

export default InfoDialog