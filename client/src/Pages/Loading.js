import React from 'react'
import { PropagateLoader } from "react-spinners";

import './css/Loading.css'

function Loading() {
    return (
        <div className='loading-page-main-div'>
            <p className='loading-page-text'>Loading</p>
            <PropagateLoader color='var(--light-yellow)' loading={true} size={25} />
        </div>

    )
}

export default Loading