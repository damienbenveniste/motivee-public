import { Grid } from '@mui/material'
import QuestionnaireContainer from './QuestionnaireContainer'
import LogoutButton from 'components/header/buttons/LogoutButton'
import loginlanding from 'images/landing.svg'


export default function QuestionnaireView() {
    return <>
    <LogoutButton sx={{position: 'absolute', right:100}}/>
    <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100%", pb: 20 }}>
        <Grid item/>
        <Grid item md={5} >
            <img src={loginlanding} alt='landing' style={{ width: 480 }} />
        </Grid>
        <Grid item md={5}>
            <QuestionnaireContainer />
        </Grid>
        <Grid item/>
    </Grid>
    </>
}