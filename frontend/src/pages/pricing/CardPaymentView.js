import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import EnterPaymentForm from './EnterPaymentForm'
import {
    CircularProgress,
    Box,
    Stack,
    Typography,
} from '@mui/material'


const stripeKey = (
    window.location.hostname === 'insight.getmotivee.com'
) ? (
    process.env.REACT_APP_STRIPE_PUBLIC_KEY_PROD
) : (
    process.env.REACT_APP_STRIPE_PUBLIC_KEY_STAGING
)

const stripePromise = loadStripe(stripeKey)


export default function CardPaymentView({ clientSecret, checked, setChecked, loading, keyReset }) {

    const appearance = {
        theme: 'flat',
    }
    const options = {
        clientSecret: clientSecret,
        appearance: appearance,
    }

    return <Box sx={{ width: '75%', display: 'flex', justifyContent: 'center', height: '100%' }} >
        <Stack
            alignItems='center'
            justifyContent='center'
            sx={{ width: '50%' }}
            spacing={3}>
            <Typography variant='h4'>
                Let's finish powering you up!
            </Typography>
            <Typography>
                Enter payment information
            </Typography>
            {clientSecret ? (
                <Elements options={options} stripe={stripePromise} style={{ width: '100%' }} key={keyReset} >
                    <EnterPaymentForm
                        keyReset={keyReset}
                        checked={checked}
                        setChecked={setChecked}
                        loading={loading} />
                </Elements>
            ) : <CircularProgress sx={{ float: 'center' }} />}
        </Stack>
    </Box>
}