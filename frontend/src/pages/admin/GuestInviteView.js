import { useState } from 'react'
import {
    Autocomplete,
    TextField,
    Stack,
    Button,
    Typography
} from '@mui/material'
import ButtonWithAlert from 'components/views/ButtonWithAlert'
import { InviteeAPI } from 'api/invitees'
import { useParams } from 'react-router-dom'


const MULTIPLE_EMAIL_PATTERN = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
const SINGLE_EMAIL_PATTERN = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/


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

export default function GuestInviteView({ reset }) {
    const [validEmailError, setValidEmailError] = useState(false)
    const [emailList, setEmailList] = useState([])
    const [inputValue, setInputValue] = useState('')
    const { customerId } = useParams()
    const validEmailErrorText = validEmailError && 'Not a valid email!'

    const disabled = emailList.length === 0

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

    return <Stack sx={{ width: '100%' }}>
        <Typography variant='h6'>
            Invite guests
        </Typography>
        <Stack
            direction='row'
            spacing={2}
            alignItems='flex-end'
            sx={{ width: '100%', display: 'flex' }} >
            <Autocomplete
                freeSolo={true}
                options={options}
                multiple
                filterSelectedOptions
                value={emailList}
                inputValue={inputValue}
                sx={{ maxHeight: 300, overflow: 'auto', pt: 1, flex: 1}}
                onChange={(event, value, reason, details) => {
                    const newEmailList = value.filter(
                        v => v !== '' && v !== null && v !== '\n'
                    ).map(extractEmails).flat().filter(onlyUnique).map(v => v.toLowerCase())
                    setEmailList(newEmailList)
                    setValidEmailError(false)
                }}
                onInputChange={(event, value, reason) => {
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
                        sx={{ backgroundColor: 'white' }}
                        multiline
                        label="Add guest emails"
                        placeholder="Guest emails"
                        error={validEmailError}
                        helperText={validEmailErrorText}
                    />
                )}
            />

            <ButtonWithAlert
                variant='contained'
                sx={{ flex: 0.3, height: 55 }}
                disabled={disabled}
                apiCall={InviteeAPI.addGuests}
                apiArgs={{ customerId, emailList }}
                onSuccess={() => {
                    setEmailList([])
                    reset()
                }}
                successMessage='The guests have been added'
            >
                Submit
            </ButtonWithAlert>
        </Stack>
        <Button component="label" size='small'>
            Upload email file
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


