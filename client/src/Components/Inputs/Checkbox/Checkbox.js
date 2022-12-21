import React from 'react'
import CustomTooltip from '../../Misc/CustomTooltip'

import './Checkbox.css'

function Checkbox({ label, name, tooltip, ...props }) {
    return (
        <CustomTooltip title={tooltip ? tooltip : ''}>
            <div className='custom-checkbox-div'>
                <input
                    className='custom-checkbox'
                    type='checkbox'
                    name={name}
                    {...props}
                />
                <label className='textfield-label' htmlFor={name}>{label}</label>
            </div>
        </CustomTooltip>
    )
}

export default Checkbox