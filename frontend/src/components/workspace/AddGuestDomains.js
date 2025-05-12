import { useState } from 'react'
import {
    Autocomplete,
    TextField,
    Stack,
    Typography
} from '@mui/material'


const SINGLE_EMAIL_PATTERN = /^@*\w+([\.-]?\w+)*(\.\w{2,5})+$/
const MULTIPLE_EMAIL_PATTERN = /\w+([\.-]?\w+)*(\.\w{2,5})+/gi

function extractEmails(text) {
    const val = text.match(MULTIPLE_EMAIL_PATTERN)
    return val ? val : []
}

function validateEmail(email) {
    return SINGLE_EMAIL_PATTERN.test(email)
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index
}

function terminateString(value) {
    const vals = [',', ';', ' ', '|', '!', '%', '\\', '/']
    for (let val of vals) {
        if (value.endsWith(val)) return true
    }
    return false
}


export default function AddGuestDomains({ domainList, setDomainList }) {

    const [validEmailError, setValidEmailError] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const validEmailErrorText = validEmailError && 'Not a valid domain!'

    const options = inputValue === '' ? [] : [inputValue]

    return <Stack>
        <Typography >
            Allow anyone from an email domain to contribute
        </Typography>
        <Autocomplete
            freeSolo={true}
            options={options}
            multiple
            value={domainList}
            inputValue={inputValue}
            sx={{ maxHeight: 300, overflow: 'auto', pt: 1 }}
            onChange={(event, value, reason, details) => {
                const newDomainList = value.filter(
                    v => v !== '' && v !== null && v !== '\n'
                ).map(extractEmails).flat().filter(onlyUnique).map(v => v.toLowerCase())
                setDomainList(newDomainList)
                setValidEmailError(false)
            }}
            onInputChange={(event, value, reason) => {
                if (terminateString(value)) {
                    const newDomainList = extractEmails(value).filter(onlyUnique).map(v => v.toLowerCase())
                    if (newDomainList.length === 0) return
                    setDomainList([
                        ...domainList,
                        ...newDomainList
                    ].filter(onlyUnique))
                    setInputValue('')
                    setValidEmailError(false)
                } else {
                    setValidEmailError(value !== '' && !validateEmail(value))
                    setInputValue(value)
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    multiline
                    label="Add guest domains"
                    placeholder="e.g., example.com"
                    error={validEmailError}
                    helperText={validEmailErrorText}
                />
            )}
        />
        <Typography variant='caption' color='error'>
            Anyone from those domains will be able to create an account and see this workspace.
            You will be billed for each user who creates an account. You can change who has access at anytime.
        </Typography>
    </Stack>

}