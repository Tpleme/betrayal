import React from 'react'
import { useSnackbar } from 'notistack'
import { Close } from '@mui/icons-material'

import './DefaultComponent.css'

export default function DefaultComponent(props) {

    const { closeSnackbar } = useSnackbar();

    const getColor = () => {
        switch (props.type) {
            case 'success': return { backgroundColor: 'var(--dark-green)', color: 'var(--light-yellow)' }
            case 'error': return { backgroundColor: 'var(--dark-red)', color: 'var(--light-yellow)' }
            default: return { backgroundColor: 'dimgrey', color: 'white' }
        }
    }

    return (
        <div className='default-snackbar-div' style={getColor()}>
            <p>{props.message}</p>
            {props.description ?
                props.actions
                :
                <Close htmlColor='var(--light-yellow)' className='default-snackbar-close-btn' onClick={() => closeSnackbar(props.id)} />
            }
        </div>
    )
}