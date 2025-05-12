
import { Auth } from 'components/login/firebaseAuth'
import ButtonWithAlert from 'components/views/ButtonWithAlert'
import { EmailAPI } from 'api/emails'

export default function PasswordButton({ email, password }) {

    return <ButtonWithAlert
        color='secondary'
        disabled={!email || !password || email.length === 0 || password.length === 0} 
        sx={{ flex: 1 }}
        variant='contained'
        apiCall={Auth.createUserOrSignin}
        apiArgs={{ email, password }}
        successMessage='Verify your email address'
        onSuccess={() => {
            EmailAPI.sendEmail({
                email, 
                type: 'verifyEmail'
            })
        }}
    >
        Continue with password
    </ButtonWithAlert>
}