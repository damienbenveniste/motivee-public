import { useState } from 'react'
import {
    Autocomplete,
    TextField,
    Stack,
    Button,
    Typography
} from '@mui/material'


const MULTIPLE_EMAIL_PATTERN = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
const SINGLE_EMAIL_PATTERN = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/


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


export default function AddGuestEmails({ emailList, setEmailList }) {

    const [validEmailError, setValidEmailError] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const validEmailErrorText = validEmailError && 'Not a valid email!'

    const getFileData = async (e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e) => {
            const text = e.target.result

            setEmailList([
                ...emailList,
                ...extractEmails(text).map(v => v.toLowerCase())
            ].filter(onlyUnique))
        }
        reader.readAsText(e.target.files[0])
    }

    const options = inputValue === '' ? [] : [inputValue]

    return <Stack>
        <Typography >
            Add contributors
        </Typography>
        <Autocomplete
            freeSolo={true}
            options={options}
            multiple
            filterSelectedOptions
            value={emailList}
            inputValue={inputValue}
            sx={{ maxHeight: 300, overflow: 'auto', pt: 1 }}
            onChange={(event, value, reason, details) => {
                const newEmailList = value.filter(
                    v => v !== '' && v !== null && v !== '\n'
                ).map(extractEmails).flat().filter(onlyUnique).map(v => v.toLowerCase())
                setEmailList(newEmailList)
                setValidEmailError(false)
            }}
            onInputChange={(event, value, reason) => {
                if (value === ' ') return
                
                if (terminateString(value)) {
                    const newEmailList = extractEmails(value).filter(onlyUnique).map(v => v.toLowerCase())
                    if (newEmailList.length === 0) return
                    setEmailList([
                        ...emailList,
                        ...newEmailList
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
                    label="Add guest emails"
                    placeholder="name@example.com"
                    error={validEmailError}
                    helperText={validEmailErrorText}
                />
            )}
        />
        <Button component="label" size='small' sx={{textTransform: 'none'}}>
            UPLOAD EMAIL FILE (.csv, .tsv, .txt, .pdf)
            <input
                type="file"
                hidden
                onChange={(e) => {
                    getFileData(e)
                    e.target.value = null
                }} />
        </Button>
    </Stack>

}