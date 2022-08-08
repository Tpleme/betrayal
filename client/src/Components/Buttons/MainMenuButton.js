import React from 'react'
import './MainMenuButton.css'

function MainMenuButton({label}) {
    return (
        <button className='main-menu-button'>
            {label}
        </button>
    )
}

export default MainMenuButton