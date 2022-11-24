import React from 'react'
import './Button.css'
import { PulseLoader } from "react-spinners";

function Button({ label, loading, size, ...props }) {
    return (
        <button
            className={`main-menu-button${loading ? ' loading' : ''}${size ? ` ${size}` : ' medium'}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ?
                <PulseLoader color='var(--light-yellow)' loading={true} size={20} />
                :
                label
            }
        </button>
    )
}

export default Button