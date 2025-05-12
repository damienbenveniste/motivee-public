
import { useState } from 'react'
import { IconButton, Tooltip, Typography, Button, Stack } from "@mui/material"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Modal from "../Modal"
import { ConversationAPI } from 'api/conversations'
import ButtonWithAlert from '../ButtonWithAlert'
import { useParams } from 'react-router-dom'


function DeletePrompt({ open, onClose, onDelete, conversation }) {

    const {customerId} = useParams()

    return <Modal open={open} onClose={onClose}>
        <Stack spacing={2} sx={{ width: 300 }}>
            <Typography >
                Are you sure you want to delete this conversation? This cannot be undone!
            </Typography>
            <Stack direction='row' spacing={1} sx={{ width: '100%', display: 'flex' }}>
                <Button variant='contained' sx={{ flex: 1 }} onClick={onClose}>
                    Cancel
                </Button>
                <ButtonWithAlert
                    variant='contained'
                    color='error'
                    sx={{ flex: 1 }}
                    apiCall={ConversationAPI.deleteConversation}
                    apiArgs={{
                        conversation,
                        customerId,
                    }}
                    onSuccess={() => {
                        setTimeout(() => {
                            onDelete()
                            onClose()
                        }, 500)
                    }}
                    successMessage='The Conversation has been deleted'
                >
                    Delete
                </ButtonWithAlert>
            </Stack>
        </Stack>
    </Modal>
}


export default function DeleteConversationButton({ 
    conversation, 
    onDelete, 
    iconButton = true, 
    ...props }) {

    const [open, setOpen] = useState(false)

    const onClick = () => {
        setOpen(true)
    }

    const onClose = () => {
        setOpen(false)
    }

    return <>
        {iconButton ? <Tooltip title='Delete '>
            <IconButton {...props} onClick={onClick} color='error'>
                <DeleteForeverIcon fontSize="inherit" />
            </IconButton>
        </Tooltip> : <Button
            {...props} onClick={onClick} color='error'
            variant='outlined'
            endIcon={<DeleteForeverIcon fontSize="inherit" />}>
            Delete
        </Button>}
        {open && <DeletePrompt
            open={open}
            onClose={onClose}
            conversation={conversation}
            onDelete={onDelete} />}
    </>
}