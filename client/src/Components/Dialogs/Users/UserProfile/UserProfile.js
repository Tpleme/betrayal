import React from 'react'
import DialogPrefab from '../../DialogPrefab'
import Image from '../../../Misc/Image'

import './UserProfile.css'

function UserProfile(props) {
    console.log(props)
    return (
        <DialogPrefab
            open={props.open}
            close={props.close}
            maxWidth='xs'
        >
            <div className='user-profile-main-div'>
                <Image alt={props.user.name} src={props.user.picture} entity='users' className='user-profile-picture' />
                <p className='user-profile-name'>{props.user.name}</p>
                {/* TODO: put badges of the user here? */}
            </div>
        </DialogPrefab>
    )
}

export default UserProfile