import React, { useState } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material'

import './TextField.css'

export function TextField({ style, helperText, helperTextAction, error, onEnter, endText, ...props }) {
    return (
        <div className='textfield-main-div' style={style}>
            <p className='textfield-label'>{props.label}</p>
            <input
                name={props.name}
                className={`textfield-input-input${helperText ? ' helper-text' : ''}${error ? ' error' : ''}`}
                type={props.type ? props.type : 'text'}
                value={props.value}
                placeholder={props.placeholder}
                onChange={props.onChange}
                autoComplete={props.type}
                onKeyPress={e => {
                    if (e.key === 'Enter') onEnter && onEnter()
                }}
                {...props}
            />
            {helperTextAction ?
                <p className='helper-text-action' onClick={helperTextAction}>{helperText}</p> : <p className='helper-text-p'>{helperText}</p>
            }
        </div>
    )
}

export function TextArea({ style, helperText, helperTextAction, error, ...props }) {
    return (
        <div className='textfield-main-div' style={style}>
            <p className='textfield-label'>{props.label}</p>
            <textarea
                className='textarea-input-input'
                rows={props.rows}
                type='text'
                value={props.value}
                placeholder={props.placeholder}
                onChange={props.onChange}
                {...props}
            />
            {helperTextAction ?
                <p className='helper-text-action' onClick={helperTextAction}>{helperText}</p> : <p className='helper-text-p'>{helperText}</p>
            }
        </div>
    )
}

export function PasswordTextField({ style, helperText, helperTextAction, error, onEnter, ...props }) {
    const [show, setShow] = useState(false)

    return (
        <div className='password-textfield-main-div' style={style}>
            <p className='textfield-label'>{props.label ? props.label : 'Password'}</p>
            <input
                name={props.name ? props.name : 'password'}
                className={`password-input-input${helperText ? ' helper-text' : ''}${error ? ' error' : ''}`}
                type={show ? 'text' : 'password'}
                value={props.value}
                maxLength={40}
                onChange={props.onChange}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                autoComplete={props.autoComplete ? props.autoComplete : 'current-password'}
                onKeyPress={e => {
                    if (e.key === 'Enter') onEnter && onEnter()
                }}
                {...props}
            />
            {helperTextAction ?
                <p className='helper-text-action' onClick={helperTextAction}>{helperText}</p> : <p style={error ? { color: 'var(--light-red)' } : { color: 'var(--light-yellow)' }} className='helper-text-p'>{helperText}</p>
            }
            <div className='show-pass-button' onClick={() => setShow(!show)}>
                {show ? <VisibilityOff htmlColor='var(--light-yellow)' /> : <Visibility htmlColor='var(--light-yellow)' />}
            </div>
        </div>
    )
}