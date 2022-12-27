import React from 'react'
import { Autocomplete, Checkbox, Popper, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material'

import './AutoComplete.css'

const CustomPopper = (props) => {
    return <Popper {...props} style={{ width: 'max-content', maxWidth: '300px', minWidth: '150px' }} />
}

const CustomAutoCompleteStyled = styled(TextField)({
    margin: '0',
    '& label.Mui-focused': {
        color: 'var()',
    },
    '& .MuiFormHelperText-root': {
        color: 'var(--light-red) !important',
        marginLeft: 0,
        fontSize: '16px'
    },
    '& .MuiInputBase-root': {
        height: '35px',
        backgroundColor: 'var(--darker-green)',
        letterSpacing: '1px',
        fontSize: '18px',
        boxShadow: '2px 2px 2px 0 rgb(0 0 0 / 50%)',
        border: 'none',
        outline: 'none',
        color: 'var(--light-yellow)',
        transition: 'box-shadow 0.2s ease-in-out',
        borderRadius: '10px',
        padding: '0 10px 0 10px !important',
        fontFamily: 'xerox',
        '&:hover': {
            boxShadow: '2px 2px 4px 0px black'
        },
        '&:focus-visible': {
            boxShadow: '2px 2px 4px 0px black'
        },
        '&.Mui-focused': {
            boxShadow: '2px 2px 4px 0px black'
        },
        '& fieldset': {
            border: 'none',
            borderRadius: 0,
        },
        '& input': {
            padding: '0px 5px !important',
            height: '35px'
        },
        '&:hover fieldset': {

        },
        '&.Mui-focused fieldset': {

        },
        '&.Mui-error fieldset': {
            border: '1px solid var(--light-red)',
            borderLeftWidth: '10px',
            boxShadow: '0 0 4px 0 var(--light-red)'
        },
        '& button': {
            color: 'var(--light-yellow)',
            transform: 'scale(1.5)'
        }
    },
})

export function AutoComplete({ data, label, id, onChange, value, name, optionLabel, helperText, error, customLabel, placeholder, ...props }) {

    return (
        <Autocomplete
            sx={{ width: '100%' }}
            id={id}
            renderTags={(tagValue) =>
                props.renderTags ? props.renderTags :
                    <p style={{ color: 'var(--light-yellow)', marginLeft: '10px' }}>{`${tagValue.length} ${label} selected `}</p>
            }
            tabIndex={-1}
            options={data}
            limitTags={1}
            PopperComponent={CustomPopper}
            openOnFocus
            value={value}
            onChange={(e, newValue) => onChange(newValue)}
            getOptionLabel={optionLabel ? (option) => option[optionLabel] : props.getOptionLabel}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option, { selected }) => (
                <li {...props} className='autocomplete-list'>
                    <Checkbox
                        icon={<CheckBoxOutlineBlank fontSize='small' />}
                        checkedIcon={<CheckBox fontSize='small' />}
                        checked={selected}
                    />
                    {option[optionLabel]}
                </li>
            )}
            renderInput={(params) =>
                <div style={{ marginBottom: '20px' }}>
                    <p style={{ color: 'white', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</p>
                    <CustomAutoCompleteStyled tabIndex={1} {...params} error={error} name={name} helperText={helperText} placeholder={placeholder} />
                </div>
            }
            {...props}
        />
    )
}