import React from 'react'
import './MainMenuButton.css'

function MainMenuButton({label, ...props}) {
    return (
        <button className='main-menu-button' {...props}>
            {label}
        </button>
    )
}

export default MainMenuButton