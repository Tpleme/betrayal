import React, { Component } from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { debounce } from '@mui/material'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'test',
            password: '',
            error: false,
            showPassword: false
        }
    }

    debouncedHandleOnChange = debounce((e) => {
        console.log(e.target.name)
        console.log(e.target.value)
        this.setState({ [e.target.name]: e.target.value }, () => console.log(this.state))
    }, 300)

    render() {

        return (
            <div>
                <TextField
                    required
                    autoFocus
                    id='email'
                    name='email'
                    label='Email'
                    color='secondary'
                    fullWidth
                    size='small'
                    type='email'
                    variant='outlined'
                    value={this.state.email}
                    onChange={this.debouncedHandleOnChange}
                    error={this.state.error}
                />
                <TextField
                    variant='outlined'
                    required
                    id='password'
                    label='Password'
                    name='password'
                    fullWidth
                    size='small'
                    color='secondary'
                    error={this.state.error}
                    onCopy={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    onChange={this.debouncedHandleOnChange}
                    autoComplete='current-password'
                    type={this.state.showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position='end'>
                                <IconButton
                                    tabIndex={-1}
                                    aria-label='toggle password visibility'
                                    onClick={() => this.setState({ showPassword: !this.state.showPassword })}
                                >
                                    {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </div>
        )
    }
}

export default Login