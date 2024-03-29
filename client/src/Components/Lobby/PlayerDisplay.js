import React from 'react'
import CustomTooltip from '../Misc/CustomTooltip'
import { Check, Block } from '@mui/icons-material'
import Image from '../Misc/Image'
import useDialog from '../../Hooks/useDialog'
import Crown from '../../Assets/misc/crown.png'

import './PlayerDisplay.css'

function PlayerDisplay({ player, openProfile, actions, kickPlayer, myInfo, host }) {
    const { openInfoDialog } = useDialog()

    const handleKickPlayer = (e) => {
        e.stopPropagation()

        openInfoDialog({
            title: `Kick ${player.user.name}?`,
            message: `Are you sure you want to kick ${player.user.name}?`,
            type: 'y/n',
            ycb: () => kickPlayer(player.user)
        })
    }

    return (
        <div className='lobby-player-div' key={player.id} onClick={() => openProfile(player.user)}>
            {player.ready &&
                <CustomTooltip title='Player Ready'>
                    <Check htmlColor='var(--light-yellow)' sx={{ scale: '1.5' }} />
                </CustomTooltip>
            }
            <div className='lobby-player-image-div'>
                {host &&
                    <CustomTooltip title='Host'>
                        <img alt='crown' src={Crown} className='lobby-player-div-crown' />
                    </CustomTooltip>
                }
                <Image alt={player.user.name} src={player.user.picture} entity='users' className='lobby-player-image' />
            </div>
            <p>{player.user.name}</p>
            {!player.user.connected_to_room &&
                <p style={{ fontSize: '16px' }}>{`(Disconnected)`}</p>
            }
            {(actions && myInfo.user.id !== player.user.id) &&
                <CustomTooltip title='Kick Player'>
                    <Block className='player-ban-icon' htmlColor='var(--light-yellow)' onClick={handleKickPlayer} />
                </CustomTooltip>
            }
        </div>
    )
}

export default PlayerDisplay