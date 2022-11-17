import React from 'react'
import { Autocomplete, Checkbox, Popper, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material'


const CustomPopper = (props) => {
    return <Popper {...props} style={{ width: 'max-content', maxWidth: '300px', minWidth: '150px' }} />
}

const CustomAutoCompleteStyled = styled(TextField)({
    margin: '0',
    '& label.Mui-focused': {
        color: 'var()',
    },
    '& .MuiFormHelperText-root': {
        color: 'var(--dark-red) !important',
        marginLeft: 0,
        fontFamily: 'ropa-mix-pro, sans-serif',
        fontSize: '16px'
    },
    '& .MuiInputBase-root': {
        padding: 0,
        backgroundColor: 'white',
        borderRadius: 0,
        transition: 'box-shadow 0.3s ease-in-out',
        fontFamily: 'ropa-mix-pro, sans-serif',
        fontWeight: '300',
        fontSize: '18px',
        '&:hover': {
            boxShadow: '0px 0px 4px 0px white'
        },
        '&:focus-visible': {
            outline: 'none'
        },
        '&.Mui-focused': {
            boxShadow: '0px 0px 4px 0px black',
        },
        '& fieldset': {
            border: 'none',
            borderRadius: 0,
        },
        '& input': {
            color: 'black',
            padding: '0px 5px !important',
            height: '35px'
        },
        '&:hover fieldset': {

        },
        '&.Mui-focused fieldset': {

        },
        '&.Mui-error fieldset': {
            border: '1px solid var(--dark-red)',
            borderLeftWidth: '10px',
            boxShadow: '0 0 4px 0 var(--dark-red)'
        },
        '& button': {
            color: 'var(--light-blue)',
            transform: 'scale(1.5)'
        }
    },
})

export function AutoComplete({ data, label, id, onChange, value, name, optionLabel, helperText, error, customLabel, ...props }) {

    return (
        <Autocomplete
            id={id}
            renderTags={(tagValue) =>
                <p style={{ color: 'var(--dark-blue)', marginLeft: '10px' }}>{`${tagValue.length} ${label} selecionada(s) `}</p>
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
                <li {...props} style={{ width: '250px', height: 'fit-content', fontSize: '16px' }}>
                    <Checkbox
                        icon={<CheckBoxOutlineBlank fontSize='small' />}
                        checkedIcon={<CheckBox fontSize='small' />}
                        style={{ color: 'var(--dark-blue)' }}
                        checked={selected}
                    />
                    {customLabel ? `${option.name} - ${option.year}` : option[optionLabel]}
                </li>
            )}
            renderInput={(params) =>
                <div style={{ marginBottom: '20px' }}>
                    <p style={{ color: 'white', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</p>
                    <CustomAutoCompleteStyled tabIndex={1} {...params} error={error} name={name} helperText={helperText} />
                </div>
            }
            {...props}
        />
    )
}