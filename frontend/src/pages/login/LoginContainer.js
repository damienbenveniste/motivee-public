import Login from 'pages/login/Login'
import {
    Grid,
    Stack
} from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import loginlanding from 'images/landing.svg'
import SignupButton from 'components/header/buttons/SignupButton'


function LoginMobile() {

    return <>
        <SignupButton sx={{ position: 'absolute', right: 100 }} />
        <Stack
            spacing={3}
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100%", pb: 20 }}>
            <img src={loginlanding} alt='landing' style={{ width: 250 }} />
            <Login />
        </Stack>
    </>

}

function LoginDesktop() {
    return <>
        <SignupButton sx={{ position: 'absolute', right: 100 }} />
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
                <Login />
            </Grid>
            <Grid item />
        </Grid>
    </>
}


export default function LoginContainer() {

    const theme = useTheme()
    const mobile = useMediaQuery(theme.breakpoints.down('md'))

    return mobile ? <LoginMobile /> : <LoginDesktop />

}