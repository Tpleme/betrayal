import React from 'react'
import { Dialog, Tooltip } from '@mui/material'
import PropTypes from 'prop-types'
import { Close } from '@mui/icons-material'


import './DialogPrefab.css'


function DialogPrefab({ children, open, close, maxWidth, title, ...props }) {

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
            <div className='dialog-content-div'>
                <div style={props.error ? { backgroundColor: 'var(--dark-red)' } : { backgroundColor: 'var(--dark-blue' }} className='dialog-top-bar'>
                    <p>{title}</p>
                    <Tooltip disableInteractive title='Fechar Janela'>
                        <Close htmlColor='white' className='dialog-close-icon' onClick={close} />
                    </Tooltip>
                </div>
                <div className='dialog-inner-content' style={props.margin ? { margin: props.margin } : { margin: '20px' }}>
                    {children}
                </div>
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