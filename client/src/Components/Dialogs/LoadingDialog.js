import React from 'react'
import DialogPrefab from './DialogPrefab'
import { CircleLoader } from "react-spinners";
import image from '../../Assets/backgrounds/test.webp'

import './LoadingDialog.css'

function LoadingDialog({ message, ...props }) {
    return (
        <DialogPrefab
            open={props.open}
            close={props.close}
            maxWidth='xs'
        >
            <div className='loading-dialog-main-div'>
                <img alt='background' src={image} width='100%' height='100%' className='loading-dialog-image' />
                <div className='background-div' />
                <p className='loading-dialog-text'>{message}</p>
                <CircleLoader color='var(--light-yellow)' loading={true} size={75} />
            </div>
        </DialogPrefab>
    )
}

export default LoadingDialog