
import {useEffect, useState} from 'react'
import {
    Grid,
    Stack,
    Typography,
} from '@mui/material'
import loginlanding from 'images/landing.svg'
import ButtonWithAlert from 'components/views/ButtonWithAlert'
import LogoutButton from 'components/header/buttons/LogoutButton'
import { Auth } from 'components/login/firebaseAuth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { EmailAPI } from 'api/emails'


export function VerifyEmail() {

    const [user, loading, error] = useAuthState(Auth.getAuth())

    useEffect(()=> {
        Auth.checkEmailVerifiedLoop()
    }, [])

    return <Stack spacing={1} alignItems='center' sx={{ maxWidth: 400, width: "100%" }}>
        <Typography align='center'>
            We sent you an email to <b>{user?.email}</b> to verify your email address
        </Typography>
        <Stack spacing={1} direction='row' sx={{ display: 'flex', width: "100%" }}>
            <ButtonWithAlert
                sx={{ flex: 1 }}
                variant='contained'
                disabled={loading}
                color='secondary'
                apiCall={EmailAPI.sendEmail}
                apiArgs={{ email: user.email, type: 'verifyEmail' }}
                successMessage='The Email has been sent'
                // onSuccess={Auth.checkEmailVerifiedLoop}
            >
                Resend Email
            </ButtonWithAlert>
        </Stack>
    </Stack>
}


export default function VerifyEmailView() {
    return <>
        <LogoutButton sx={{position: 'absolute', right:100}}/>
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100%", pb: 20 }}>
            <Grid item />
            <Grid item md={5} >
                <img src={loginlanding} alt='landing' style={{ width: 480 }} />
            </Grid>
            <Grid item md={5}>
                <VerifyEmail />
            </Grid>
            <Grid item />
        </Grid>
    </>

}