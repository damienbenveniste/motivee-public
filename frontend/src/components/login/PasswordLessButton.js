
import { useState } from 'react'
import { Auth } from 'components/login/firebaseAuth'
import ButtonWithAlert from 'components/views/ButtonWithAlert'
import { Typography, Stack } from '@mui/material'
import { EmailAPI } from 'api/emails'


export default function PasswordLessButton({ email }) {

    const [text, setText] = useState('Continue without password')
    const [sent, setSent] = useState(false)


    return <Stack alignItems='center' sx={{width: '100%'}}>
        {sent && <Typography align='center' variant='caption' color='text.secondary'>
            An email has been sent to your email to finish the log in
        </Typography>}
        <ButtonWithAlert
            disabled={!email || email.length === 0}
            sx={{ width: '100%' }}
            variant='contained'
            apiCall={EmailAPI.sendEmail}
            apiArgs={{ email, type: 'signin' }}
            onSuccess={() => {
                setText('Resend email')
                setSent(true)
            }}
            successMessage='Email sent'
        >
            {text}
        </ButtonWithAlert>
    </Stack>
}