
import { useState } from 'react'
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'


export default function SelectOption({ label, options, state, setState }) {

    const [value, setValue] = useState('')

    const items = options.map(item => {
        return <MenuItem key={item} value={item}>{item}</MenuItem>
    })

    const handleChange = (event) => {
        setValue(event.target.value)
        setState({
            ...state,
            [label]: event.target.value
        })
    }

    return <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">What is your {label}?</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={value}
            label={`What is your ${label}?`}
            onChange={handleChange}
        >
            {items}
        </Select>
    </FormControl>

}