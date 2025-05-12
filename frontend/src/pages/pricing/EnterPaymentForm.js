import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import URL from 'route/url'
import {
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js'
import {
    Button,
    Stack,
    Checkbox,
    Typography,
    CircularProgress
} from '@mui/material'

export default function EnterPaymentForm({ checked, setChecked, loading, keyReset }) {

    const [isLoading, setisLoading] = useState(false)
    const {customerId} = useParams()
    const navigate = useNavigate()

    const stripe = useStripe()
    const elements = useElements()

    const onSuccess = () => {
        navigate(URL.billingAdmin(customerId))
    }

    const handleChange = () => setChecked(!checked)

    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault()

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return
        }
        setisLoading(true)

        // setIsLoading(true)

        // transform with then https://stripe.com/docs/js/payment_intents/confirm_payment
        stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: "http://localhost:3000"
            },
            redirect: 'if_required'
        }).then((results) => {


            if (results.error) {
                // This point will only be reached if there is an immediate error when
                // confirming the payment. Show error to your customer (e.g., payment
                // details incomplete)
                // setMessage(results.error.message)
                // setSeverity('error')
                // setOpen(true)
                console.log(results.error.message)
                setisLoading(true)

            } else if (results.paymentIntent) {
                // Your customer will be redirected to your `return_url`. For some payment
                // methods like iDEAL, your customer will be redirected to an intermediate
                // site first to authorize the payment, then redirected to the `return_url`.
                console.log(results.paymentIntent.status)
                switch (results.paymentIntent.status) {

                    case 'succeeded':
                        //   setSeverity('success')
                        //   setOpen(true)
                        //   setMessage('Success! Your payment method has been saved.');
                        onSuccess()
                        setisLoading(true)
                        break;

                    case 'processing':
                        //   setSeverity('success')
                        //   setOpen(true)
                        //   setMessage("Processing payment details. We'll update you when processing is complete.");
                        setisLoading(true)
                        break;

                    case 'requires_payment_method':
                        // Redirect your user back to your payment page to attempt collecting
                        // payment again
                        //   setSeverity('error')
                        //   setOpen(true)
                        //   setMessage('Failed to process payment details. Please try another payment method.');
                        setisLoading(true)
                        break;

                    default:
                        // setSeverity('error')
                        // setOpen(true)
                        // setMessage('Oops! Something went wrong');
                        return null
                }
            }
            // setIsLoading(false)
        })
    }

    return (
        loading ? <CircularProgress/> : <form id='payment-form' style={{ width: '100%' }} onSubmit={handleSubmit} key={keyReset}>
            <Stack spacing={3}>
                <PaymentElement 
                id='payment-element' 
                style={{ width: '100%' }} 
                key={keyReset} 
                disabled={ loading || !stripe || !elements || isLoading}/>
                <Stack direction='row' justifyContent="space-between" spacing={1}>
                    <Checkbox
                        checked={checked}
                        onChange={handleChange} />
                    <Typography align='justify'>
                    I understand that after this initial billing is complete, 
                    any additional user I or another admin adds to this workspace will 
                    be charged to the same card at a prorated price for that billing period 
                    and at the full price for each following billing period. 
                    If I have allowed an entire email domain to access this workspace, 
                    then the same card will be charged for each additional user that signs 
                    into this workspace from that domain.
                    </Typography>
                </Stack>
                <Button
                    id="submit"
                    disabled={!checked || loading || !stripe || !elements || isLoading}
                    variant='contained'
                    type='submit'
                    fullWidth>
                   {isLoading? <CircularProgress/>: 'Submit Payment'}
                </Button>
            </Stack>
        </form>
    )
}