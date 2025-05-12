import { useState, useEffect } from 'react'
import {
    Autocomplete,
    TextField,
    Stack,
    Typography,
    Button
} from '@mui/material'
import { InviteeAPI } from 'api/invitees'
import { useParams } from 'react-router-dom'


const SINGLE_EMAIL_PATTERN = /^@*\w+([\.-]?\w+)*(\.\w{2,5})+$/
const MULTIPLE_EMAIL_PATTERN = /\w+([\.-]?\w+)*(\.\w{2,5})/gi

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

function findToRemove(inviteeList, removed) {
    return inviteeList.filter(invitee => removed.includes(invitee.email_domain))
}

function remove(inviteeList, removed) {
    return inviteeList.filter(invitee => !removed.includes(invitee.email_domain))
}

function terminateString(value) {
    const vals = [',', ';', ' ', '|', '!', '%', '\\', '/']
    for (let val of vals) {
        if (value.endsWith(val)) return true
    }
    return false
}

function deleteRecurssion(toRemove, customerId, onSuccess, onFailure) {
    if (toRemove.length === 0) {
        onSuccess()
        return
    }
    const invitee = toRemove.pop()
    InviteeAPI.delete({
        inviteeId: invitee.id,
        customerId,
        onSuccess: () => {
            deleteRecurssion(toRemove, customerId, onSuccess, onFailure)
        },
        onFailure
    })
}


export default function DomainListView() {

    const [domainList, setDomainList] = useState([])
    const [inviteeList, setInviteeList] = useState([])
    const [loading, setLoading] = useState(false)
    const [validEmailError, setValidEmailError] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const validEmailErrorText = validEmailError && 'Not a valid domain!'
    const { customerId } = useParams()

    useEffect(() => {
        setLoading(true)
        InviteeAPI.getDomains({
            customerId,
            page: 1,
            onSuccess: res => {
                const uniqueDomains = res.data.results.map(
                    invitee => invitee.email_domain
                ).filter(onlyUnique)

                setDomainList(uniqueDomains)
                setInviteeList(res.data.results)
                setLoading(false)
            },
            onFailure: () => {
                setDomainList([])
                setLoading(false)
            }
        })
    }, [])

    const options = inputValue === '' ? [] : [inputValue]

    return <Stack>
        <Typography variant='h6'>
            Update allowed email domains
        </Typography>
        <Autocomplete
            freeSolo={true}
            options={options}
            disabled={loading}
            loading={loading}
            multiple
            value={domainList}
            inputValue={inputValue}
            sx={{ maxHeight: 300, overflow: 'auto', pt: 1 }}
            onChange={(event, value, reason, details) => {
                setLoading(true)
                const newDomainList = value.filter(
                    v => v !== '' && v !== null && v !== '\n'
                ).map(extractEmails).flat().filter(onlyUnique).filter(
                    v => v !== '' && v !== null && v !== '\n'
                ).map(v => {
                    return v?.toLowerCase()
                })

                const added = newDomainList.filter(x => !domainList.includes(x))
                const removed = domainList.filter(x => !newDomainList.includes(x))

                if (added.length > 0) {
                    InviteeAPI.addDomains({
                        domainList: added,
                        customerId,
                        onSuccess: (res) => {
                            setInviteeList([
                                ...inviteeList,
                                ...res.data
                            ])
                            setDomainList(newDomainList)
                            setLoading(false)
                        },
                        onFailure: () => setLoading(false)
                    })
                }

                if (removed.length > 0) {
                    const toRemove = findToRemove(inviteeList, removed)
                    const newInviteeList = remove(inviteeList, removed)
                    deleteRecurssion(
                        toRemove,
                        customerId,
                        () => {
                            setInviteeList(newInviteeList)
                            setDomainList(newDomainList)
                            setLoading(false)
                        },
                        () => setLoading(false)
                    )
                }
                setValidEmailError(false)
            }}
            onInputChange={(event, value, reason) => {
                if (terminateString(value)) {
                    const newDomainList = extractEmails(value).filter(onlyUnique).map(v => v.toLowerCase())
                    if (newDomainList.length === 0) return
                    const added = newDomainList.filter(x => !domainList.includes(x))

                    if (added.length > 0) {
                        setLoading(true)
                        InviteeAPI.addDomains({
                            domainList: added,
                            customerId,
                            onSuccess: (res) => {
                                setInviteeList([
                                    ...inviteeList,
                                    ...res.data
                                ])
                                setInputValue('')
                                setValidEmailError(false)
                                setDomainList([
                                    ...domainList,
                                    ...res.data.map(d => d.email_domain)

                                ])
                                setLoading(false)
                            },
                            onFailure: () => setLoading(false)
                        })
                    }
                } else {
                    setValidEmailError(value !== '' && !validateEmail(value))
                    setInputValue(value)
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    multiline
                    sx={{ backgroundColor: 'white' }}
                    label="Add or remove guest domains"
                    placeholder="Guest domains"
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