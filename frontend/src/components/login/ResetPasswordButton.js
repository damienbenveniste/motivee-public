
import { useState } from 'react'

import { Typography, Stack } from '@mui/material'
import ButtonWithAlert from 'components/views/ButtonWithAlert'
import { Auth } from 'components/login/firebaseAuth'
import { EmailAPI } from 'api/emails'

export default function ResetPasswordButton({ email }) {

    const [text, setText] = useState('Forgot password?')
    const [sent, setSent] = useState(false)

    return <Stack alignItems='center'>
        {sent && <Typography align='center' variant='caption' color='text.secondary'>
            An email has been sent to <b>{email}</b> to reset your password
        </Typography>}
        <ButtonWithAlert
            disabled={email === ''}
            apiCall={EmailAPI.sendEmail}
            apiArgs={{  email, type: 'resetPassword' }}
            onSuccess={() => {
                setText('Resend email')
                setSent(true)
            }}
            successMessage='The Email has been sent'
        >
            {text}
        </ButtonWithAlert>
    </Stack>

}