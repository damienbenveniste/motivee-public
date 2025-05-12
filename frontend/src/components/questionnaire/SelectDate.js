import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'


function convertDate(date) {
    const dateStr = (parseInt(date.getTime() / 1000)).toString()
    const zeros = Array(10 - dateStr.length).fill('0').join('')
    return zeros + dateStr

}


export default function SelectDate({ label, state, setState }) {
    const [value, setValue] = useState(null)
    const handleChange = (newValue) => {
        setValue(newValue)
        setState({
            ...state,
            [label]: convertDate(newValue)
        })
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                label={`When was your ${label}?`}
                value={value}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
    )

}