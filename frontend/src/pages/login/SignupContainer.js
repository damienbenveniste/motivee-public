import Signup from 'pages/login/Signup'
import {
    Grid,
    Stack
} from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import loginlanding from 'images/landing.svg'
import LoginButton from 'components/header/buttons/LoginButton'


function SignupMobile() {

    return <>
        <LoginButton sx={{ position: 'absolute', right: 100 }} />
        <Stack
            spacing={3}
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100%", pb: 20 }}>
            <img src={loginlanding} alt='landing' style={{ width: 250 }} />
            <Signup />
        </Stack>
    </>

}

function SignupDesktop() {
    return <>
        <LoginButton sx={{ position: 'absolute', right: 100 }} />
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
                <Signup />
            </Grid>
            <Grid item />
        </Grid>
    </>
}


export default function SignupContainer() {

    const theme = useTheme()
    const mobile = useMediaQuery(theme.breakpoints.down('md'))

    return mobile ? <SignupMobile /> : <SignupDesktop />

}