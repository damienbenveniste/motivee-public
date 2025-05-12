import { useState } from 'react'
import { Button, Typography, TextField, Stack } from '@mui/material'
import Modal from 'components/views/Modal'
import { CustomerAPI } from 'api/customers'
import { useParams, useNavigate } from 'react-router-dom'
import ButtonWithAlert from 'components/views/ButtonWithAlert'
import URL from 'route/url'


function DeletePromt({ open, onClose }) {

    const [text, setText] = useState('')
    const { customerId } = useParams()
    const navigate = useNavigate()
    const disabled = text !== 'delete'

    return <Modal open={open} onClose={onClose}>
        <Stack spacing={1}>
            <Typography>
                This cannot be undone! Type the "delete" in the following textbox
            </Typography>
            <TextField
                placeholder='delete'
                value={text}
                onChange={event => {
                    setText(event.target.value)
                }} />
            <ButtonWithAlert
                variant='contained'
                color='error'
                disabled={disabled}
                apiCall={CustomerAPI.delete}
                apiArgs={{ customerId }}
                onSuccess={() => navigate(URL.WORKSPACE)}
                successMessage='The workspace has been deleted'
            >
                Delete
            </ButtonWithAlert>
        </Stack>
    </Modal>
}


export default function DeleteWorkspaceButton() {

    const [open, setOpen] = useState(false)

    const onClick = () => setOpen(true)
    const onClose = () => setOpen(false)

    return <>
        <Button
            onClick={onClick}
            variant='contained'
            color='error'>
            Delete entire workspace
        </Button>
        {open && <DeletePromt open={open} onClose={onClose} />}
    </>

}