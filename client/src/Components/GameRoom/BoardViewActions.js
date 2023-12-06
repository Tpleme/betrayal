import React from 'react'
import CustomTooltip from '../Misc/CustomTooltip'
import { ZoomIn, ZoomOut, CenterFocusStrong, PanTool } from '@mui/icons-material'

function BoardViewActions({mode, setMode, zoomIn, zoomOut, resetTransform}) {
    return (
        <div className='game-room-board-tools'>
            <CustomTooltip title='Zoom In'>
                <ZoomIn style={{ cursor: 'pointer' }} onClick={() => zoomIn()} />
            </CustomTooltip>
            <CustomTooltip title='Zoom Out'>
                <ZoomOut style={{ cursor: 'pointer' }} onClick={() => zoomOut()} />
            </CustomTooltip>
            <CustomTooltip title='Center View'>
                <CenterFocusStrong style={{ cursor: 'pointer' }} onClick={() => resetTransform()} />
            </CustomTooltip>
            <CustomTooltip title={mode === 'active' ? 'Turn on drag' : 'Turn off drag'}>
                <PanTool
                    style={{ cursor: 'pointer' }}
                    htmlColor={mode === 'active' ? 'grey' : 'white'}
                    fontSize='small'
                    onClick={() => mode === 'active' ? setMode('panning') : setMode('active')}
                />
            </CustomTooltip>
        </div>
    )
}

export default BoardViewActions