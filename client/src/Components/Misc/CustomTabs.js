import React from 'react'
import { Tabs, Tab } from '@mui/material'

import './CustomTabs.css'

function CustomTabs({ options, value, onClick, variant }) {
    return (
        <Tabs className='custom-tabs' value={value} onChange={onClick} variant={variant ? variant : 'fullWidth'}>
            {options.map(option => {
                return (
                    <Tab key={option} label={option} />
                )
            })}
        </Tabs>
    )
}

export default CustomTabs