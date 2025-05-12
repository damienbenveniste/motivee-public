import { useState } from 'react'
import Modal from "components/views/Modal"
import {
    Stack,
    Typography,
    TextField,
} from '@mui/material'
import AddGuestEmails from 'components/workspace/AddGuestEmails'
import AddGuestDomains from 'components/workspace/AddGuestDomains'
import { CustomerAPI } from 'api/customers'
import { useNavigate } from 'react-router-dom'
import URL from 'route/url'
import ButtonWithAlert from 'components/views/ButtonWithAlert'


export default function CreateWorkspaceView({ open, onClose }) {

    const [name, setName] = useState('')
    const [emailList, setEmailList] = useState([])
    const [domainList, setDomainList] = useState([])
    const navigate = useNavigate()

    const handleChange = (event) => {
        setName(event.target.value)
    }

    return <Modal open={open} onClose={onClose}>
        <Stack spacing={2} sx={{ width: 400 }}>
            <Typography variant='h6'>
                Create a new workspace
            </Typography>
            <TextField
                label="Name"
                variant="outlined"
                value={name}
                onChange={handleChange} />
            <AddGuestEmails emailList={emailList} setEmailList={setEmailList} />
            <AddGuestDomains domainList={domainList} setDomainList={setDomainList} />
            <ButtonWithAlert
                variant='contained'
                disabled={name === ''}
                apiCall={CustomerAPI.createCustomer}
                apiArgs={{
                    name,
                    emailList,
                    email_domains: domainList
                }}
                onSuccess={(res) => {
                    navigate(URL.conversation(res.data.id), { state: { newUser: true } })
                    onClose()
                }}
                successMessage='The Workspace has have been created'
            >
                Create
            </ButtonWithAlert>
        </Stack>
    </Modal>
}