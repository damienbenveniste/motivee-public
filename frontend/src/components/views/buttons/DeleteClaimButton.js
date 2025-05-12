import { useState } from 'react'
import { Typography, Button, Stack } from "@mui/material"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Modal from "../Modal"
import { ClaimAPI } from 'api/claims'
import { useParams } from 'react-router-dom'
import ButtonWithAlert from '../ButtonWithAlert'


function DeletePrompt({ open, onClose, deleteClaim, claim }) {

    const {customerId} = useParams()

    return <Modal open={open} onClose={onClose}>
        <Stack spacing={2} sx={{ width: 300 }}>
            <Typography >
                Are you sure you want to delete this claim? This cannot be undone!
            </Typography>
            <Stack direction='row' spacing={1} sx={{ width: '100%', display: 'flex' }}>
                <Button variant='contained' sx={{ flex: 1 }} onClick={onClose}>
                    Cancel
                </Button>
                <ButtonWithAlert
                    variant='contained'
                    color='error'
                    sx={{ flex: 1 }}
                    apiCall={ClaimAPI.deleteClaim}
                    apiArgs={{
                        claim,
                        customerId,
                    }}
                    onSuccess={() => {
                        setTimeout(() => {
                            deleteClaim('DELETE', [claim])
                            onClose()
                        }, 500)
                    }}
                    successMessage='The Claim has been deleted'
                >
                    Delete
                </ButtonWithAlert>
            </Stack>
        </Stack>
    </Modal>
}


export default function DeleteClaimButton({ claim, deleteClaim, ...props }) {

    const [open, setOpen] = useState(false)

    const onClick = (event) => {
        event.stopPropagation()
        setOpen(true)
    }

    const onClose = (event) => {
        if (event) event.stopPropagation()
        setOpen(false)
    }

    return <>
        <Button
            {...props} onClick={onClick} color='error'
            variant='outlined'
            endIcon={<DeleteForeverIcon fontSize="inherit" />}>
            Delete
        </Button>
        {open && <DeletePrompt
            open={open}
            onClose={onClose}
            claim={claim}
            deleteClaim={deleteClaim} />}
    </>
}