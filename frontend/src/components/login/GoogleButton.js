import GoogleIcon from '@mui/icons-material/Google';
import { Button } from '@mui/material'
import ButtonWithAlert from 'components/views/ButtonWithAlert'
import { Auth } from 'components/login/firebaseAuth'


export default function GoogleButton() {

    return <ButtonWithAlert
        variant='outlined'
        startIcon={<GoogleIcon />}
        sx={{ flex: 1 }}
        apiCall={Auth.signInWithGoogle}
        successMessage='You are now logged in'>
        Continue with Google
    </ButtonWithAlert>
}