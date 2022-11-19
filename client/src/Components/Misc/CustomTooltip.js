import React from 'react'
import { Tooltip } from '@mui/material'

function CustomTooltip({ title, interactive, onFocusListener, children, ...props }) {
    return (
        <Tooltip
            title={title}
            disableInteractive={!interactive}
            disableFocusListener={!onFocusListener}
            componentsProps={{
                tooltip: {
                    sx: {
                        fontSize: '14px ',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        textAlign: 'center',
                        whiteSpace: 'pre-line'
                    }
                }
            }}
            {...props}
        >
            {children}
        </Tooltip>
    )
}

export default CustomTooltip