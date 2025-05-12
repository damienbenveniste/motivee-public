
import { useState } from 'react'
import ButtonWithAlert from "components/views/ButtonWithAlert"
import { Button, Typography, Stack } from '@mui/material'
import Modal from 'components/views/Modal'
import { PaymentAPI } from 'api/payments'
import { useParams } from 'react-router-dom'

const options = { year: 'numeric', month: 'short', day: 'numeric' }


function CancelPrompt({ open, onClose, subscription, setSubscription }) {

    const { customerId } = useParams()
    const date = new Date(subscription?.current_period_end * 1000).toLocaleString('en-US', options)

    return <Modal open={open} onClose={onClose}>
        <Stack sx={{ width: 500 }} spacing={2}>
            <Typography>
                Your plan will be canceled, but is still available until the end of your billing period on {date}.
                If you change your mind, you can renew your subscription.
            </Typography>
            <ButtonWithAlert
                variant='contained'
                color='error'
                apiCall={PaymentAPI.cancelSubscription}
                apiArgs={{ customerId }}
                onSuccess={(res) => {
                    setSubscription(res.data.subscription)
                    setTimeout(onClose, 500)
                }}
                successMessage='The subscription has been canceled'
            >
                Cancel
            </ButtonWithAlert>
        </Stack>

    </Modal>

}


export default function DeleteSubscriptionButton({ subscription, setSubscription, ...props }) {

    const [open, setOpen] = useState(false)

    const onClick = () => setOpen(true)
    const onClose = () => setOpen(false)

    return <>
        <Button
            {...props}
            variant='contained'
            color='error'
            onClick={onClick}>
            Cancel Subscription
        </Button>
        {open && <CancelPrompt
            open={open}
            onClose={onClose}
            subscription={subscription}
            setSubscription={setSubscription} />}
    </>
}