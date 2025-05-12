import { useState, useEffect } from 'react'
import {
    TextField,
    Stack,
    Button,
    Typography,
    Link,
    IconButton,
    Divider,
    Collapse
} from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import TermsPage from 'pages/terms/TermsPage'
import GoogleButton from 'components/login/GoogleButton'
import PasswordLessButton from 'components/login/PasswordLessButton'
import PasswordButton from 'components/login/PasswordButton'


function getEmail() {
    const email = window.localStorage.getItem('emailForInvitee')
    if (email) {
        window.localStorage.removeItem('emailForInvitee')
    }
    return email ? email : ''
}


function Signup() {

    const [email, setEmail] = useState(getEmail())
    const [password, setPassword] = useState('')
    const [openTerm, setOpenTerm] = useState(false)
    const [openPrivacy, setOpenPrivacy] = useState(false)
    const [continueWithEmail, setContinueWithEmail] = useState(false)

    useEffect(() => {
        if (email.length === 0) {
            setContinueWithEmail(false)
        }
    }, [email])


    const onClickTerm = () => setOpenTerm(true)
    const onCloseTerm = () => setOpenTerm(false)
    const onClickPrivacy = () => setOpenPrivacy(true)
    const onClosePrivacy = () => setOpenPrivacy(false)
    const onClickContinue = () => setContinueWithEmail(true)

    const keyPress = (event) => {
        if (event.keyCode === 13) onClickContinue()
    }


    return (
        <Stack spacing={3} sx={{ maxWidth: 400, width: "100%" }}>
            <Typography variant='h4' align='center'>
                Sign up
            </Typography>
            <GoogleButton />
            <Divider />
            <Stack spacing={1}>
                <TextField
                    type='email'
                    label='Email Address'
                    autoComplete='email'
                    onKeyDown={keyPress}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                        endAdornment: email ? (
                            <IconButton
                                size="small"
                                onClick={() => setEmail('')}>
                                <CancelIcon />
                            </IconButton>
                        ) : undefined
                    }}
                />
                <Collapse in={continueWithEmail} sx={{ width: "100%" }}>
                    <TextField
                        sx={{ width: "100%" }}
                        type='password'
                        label='Password'
                        autoComplete='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                </Collapse>
                {!continueWithEmail ? <Button variant='contained' onClick={onClickContinue}>
                    Continue with email
                </Button> : <>
                    <PasswordLessButton email={email} />
                    <PasswordButton email={email} password={password} />
                </>}
            </Stack>
            <Typography align='center' color='text.secondary'>
                By clicking "continue" above, you acknowledge that you have read, understood,
                and agreed to Motivee's
                <Link component='button' onClick={onClickTerm}>
                    Terms & Conditions
                </Link> and <Link component='button' onClick={onClickPrivacy}>
                    Privacy Policy
                </Link>.
            </Typography>

            {openTerm && <TermsPage open={openTerm} onClose={onCloseTerm} />}
            {openPrivacy && <TermsPage open={openPrivacy} onClose={onClosePrivacy} />}
        </Stack>
    )
}
export default Signup