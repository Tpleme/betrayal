import React from 'react'
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'

import './NumberRange.css'

function NumberRange({ label, max, min, value, ...props }) {
    return (
        <div className='number-range-main-div'>
            <p className='number-range-label'>{label}</p>
            <div className='number-range-actions-div'>
                <ArrowBackIos className={`number-range-add${value === min ? ' disabled' : ''}`} onClick={() => props.onChange(value - 1)} />
                <p>{value}</p>
                <ArrowForwardIos className={`number-range-add${value === max ? ' disabled' : ''}`} onClick={() => props.onChange(value + 1)} />
            </div>
        </div>
    )
}

export default NumberRange