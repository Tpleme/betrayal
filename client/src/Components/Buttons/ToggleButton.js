import React, { useState } from 'react'
import './ToggleButton.css'
import { Check } from '@mui/icons-material'

function Button({ label, size, ...props }) {
    const [toggled, setToggled] = useState(false)

    return (
        <button
            className={`toggle-button${toggled ? ' toggled' : ''}${size ? ` ${size}` : ' medium'}`}
            onClick={() => { setToggled(!toggled); props.onToggle(!toggled)}}
            {...props}
        >
            {label}
            <div className={`toggle-btn-check-div${toggled ? ' toggled' : ''}`}>
                {toggled &&
                    <Check htmlColor='var(--dark-green)' />
                }
            </div>
        </button>
    )
}

export default Button