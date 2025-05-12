
import { useState } from 'react'

import Modal from "components/views/Modal"
import { Stack, TextField } from '@mui/material'
import ButtonWithAlert from 'components/views/ButtonWithAlert'
import { Auth } from 'components/login/firebaseAuth'

export default function ResetPasswordView({ open, onClose }) {

    const [email, setEmail] = useState('')

    return <Modal open={open} onClose={onClose}>
        <Stack spacing={1} sx={{ width: 400 }}>
            <TextField
                type='email'
                label='Email Address'
                autoComplete='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <ButtonWithAlert
                variant='contained'
                apiCall={Auth.sendPasswordResetEmail}
                apiArgs={{ email }}
                onSuccess={() => setTimeout(onClose, 2000)}
                successMessage='The Email has been sent'
            >
                Send reset email
            </ButtonWithAlert>
        </Stack>
    </Modal>


}