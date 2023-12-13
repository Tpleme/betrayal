import React, { useState } from 'react'
import CustomTooltip from '../Misc/CustomTooltip';
import Menu from '@mui/material/Menu';
import { CharacterStatsForMenu } from '../Game/Character/CharacterStats';

import './PlayerToken.css'
import { Divider } from '@mui/material';

function PlayerToken({ player, wrapperStyle, tokenStyle }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const character = player.character;
    const user = player.user

    return (
        <div className='player-token-wrapper' style={wrapperStyle}>
            <CustomTooltip title={`${character.name} (${user.name})`} >
                <div
                    className='player-token'
                    style={{ border: `1px solid ${character.color}`, ...tokenStyle }}
                    onClick={e => setAnchorEl(e.currentTarget)}
                >
                    <img
                        alt={character.name}
                        className='player-token-image'
                        src={`${process.env.REACT_APP_SERVER_URL}/resources/images/characters/${character.image}`}
                    />
                </div>
            </CustomTooltip>
            <Menu
                MenuListProps={{ sx: { py: 0 } }}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}

            >
                <div className='player-token-menu-div'>
                    <img
                        alt={character.name}
                        className='player-token-menu-image'
                        src={`${process.env.REACT_APP_SERVER_URL}/resources/images/characters/${character.image}`}
                    />
                    <div className='player-token-bottom-info'>
                        <div className='player-token-menu-names'>
                            <p>{character.name}</p>
                            <p>{user.name}</p>
                        </div>
                        <Divider sx={{ background: 'var(--dark-yellow)' }} />
                        <div className='player-token-menu-stats'>
                            <p className='player-token-menu-stats-title'>Character Current Stats</p>
                            <CharacterStatsForMenu player={player} />
                        </div>
                    </div>
                </div>
            </Menu>
        </div>
    )
}

export default PlayerToken