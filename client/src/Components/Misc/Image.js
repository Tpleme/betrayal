import React from 'react'

import portraitPlaceholder from '../../Assets/placeholders/portrait.jpg'

function Image({ alt, src, entity, className, ...props }) {
    return (
        <img
            alt={alt}
            className={className}
            src={src ? `${process.env.REACT_APP_SERVER_URL}/resources/images/${entity}/${src}` : portraitPlaceholder}
            {...props}
        />
    )
}

export default Image