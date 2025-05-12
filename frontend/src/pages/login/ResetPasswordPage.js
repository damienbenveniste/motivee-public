
import { useState } from 'react'
import {
    Grid,
    Stack,
    Typography,
    TextField,
    Button
} from '@mui/material'
import loginlanding from 'images/landing.svg'
import ButtonWithAlert from 'components/views/ButtonWithAlert'
import { Auth } from 'components/login/firebaseAuth'
import { useLocation, useNavigate} from 'react-router-dom'
import URL from 'route/url'


export function ResetPassword() {

    const [password, setPassword] = useState('')
    const location = useLocation()
    const navigate = useNavigate()
    const actionCode = location.state?.actionCode

    return <Stack spacing={1} alignItems='center' sx={{ maxWidth: 400, width: "100%" }}>
        <Typography>
            Enter a new password
        </Typography>
        <Stack spacing={1} sx={{ display: 'flex', width: "100%" }}>
            <TextField
                sx={{ width: "100%" }}
                type='password'
                label='Password'
                autoComplete='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <ButtonWithAlert
                sx={{ flex: 1 }}
                disabled={password === ''}
                variant='contained'
                color='secondary'
                apiCall={Auth.confirmPasswordReset}
                apiArgs={{ actionCode, password }}
                successMessage='The password has been reset'
                onSuccess={(res) => navigate(URL.LOGIN)}
            >
                Save new password
            </ButtonWithAlert>
        </Stack>
    </Stack>
}


export default function ResetPasswordPage() {
    return <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100%", pb: 20 }}>
        <Grid item />
        <Grid item md={5} >
            <img src={loginlanding} alt='landing' style={{ width: 480 }} />
        </Grid>
        <Grid item md={5}>
            <ResetPassword />
        </Grid>
        <Grid item />
    </Grid>

}