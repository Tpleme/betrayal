import React from 'react'
import './BigButton.css'

function BigButton({label, ...props}) {
    return (
        <button className='main-menu-button' {...props}>
            {label}
        </button>
    )
}

export default BigButton