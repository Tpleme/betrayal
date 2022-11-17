import React from 'react'
import { PlayArrow } from '@mui/icons-material'

import './Select.css'

function Select({ label, options, helperText, styleType, name, ...props }) {
    return (
        <div className='custom-select-main-div'>
            <label className={`custom-select-label ${styleType}`} htmlFor="custom-select">{label}</label>

            <select className={`custom-select ${styleType}`} name={name} id="custom-select" onChange={props.onChange} {...props} >
                {options.map(option => {
                    return (
                        <option key={option.name} value={option.value}>{option.name}</option>
                    )
                })}
            </select>
            <p className='helper-text-p'>{helperText}</p>
            <PlayArrow className='select-arrow' />
        </div>
    )
}

export default Select