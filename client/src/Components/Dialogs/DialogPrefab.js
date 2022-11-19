import React from 'react'
import { Dialog } from '@mui/material'
import PropTypes from 'prop-types'
import { Close } from '@mui/icons-material'


import './DialogPrefab.css'


function DialogPrefab({ children, open, close, maxWidth, ...props }) {

    const handleClose = (e, reason) => {
        if (props.preventOutSideClose) {
            if (reason && reason === 'backdropClick') {
                return;
            }
        }
        close()
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            fullScreen={window.innerWidth < 960}
            maxWidth={maxWidth}
            className='dialog-outer-div'
        >
            <div className='dialog-prefab-wrapper'>
                <Close className='dialog-prefab-close-icon' htmlColor='var(--light-yellow' onClick={() => close()} />
                {children}
                <div className='dialog-prefab-background-div' />
            </div>
        </Dialog>
    )
}

export default DialogPrefab

DialogPrefab.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', ''])
}