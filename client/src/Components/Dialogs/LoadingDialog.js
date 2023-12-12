import React, { useEffect, useState } from 'react'
import DialogPrefab from './DialogPrefab'
import { CircleLoader } from "react-spinners";

import './LoadingDialog.css'

function importAll(r) {
    return r.keys().map(r);
}

const images = importAll(require.context('../../Assets/loadingBackgrounds/', false, /\.(png|jpe?g|webp)$/));

function LoadingDialog({ message, ...props }) {
    const [randomImage, setRandomImage] = useState(null)

    useEffect(() => {
        if (props.open && images) {
            const randomIndex = Math.floor(Math.random() * 11)
            setRandomImage(images[randomIndex])
        }
    }, [props.open])

    return (
        <DialogPrefab
            open={props.open}
            close={() => { return }}
            preventClose={true}
            maxWidth='xs'
        >
            <div className='loading-dialog-main-div'>
                <img alt='background' src={randomImage} width='100%' height='100%' className='loading-dialog-image' />
                <div className='background-div' />
                <p className='loading-dialog-text'>{message}</p>
                <CircleLoader color='var(--light-yellow)' loading={true} size={75} />
            </div>
        </DialogPrefab>
    )
}

export default LoadingDialog