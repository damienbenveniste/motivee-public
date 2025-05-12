
import { useState } from 'react'
import ButtonWithAlert from "components/views/ButtonWithAlert"
import { Button, Typography, Stack } from '@mui/material'
import Modal from 'components/views/Modal'
import { PaymentAPI } from 'api/payments'
import { useParams } from 'react-router-dom'

const options = { year: 'numeric', month: 'short', day: 'numeric' }


function RenewPrompt({ open, onClose, subscription, setSubscription }) {

    const { customerId } = useParams()
    const date = new Date(subscription?.current_period_end * 1000).toLocaleString('en-US', options)

    return <Modal open={open} onClose={onClose}>
        <Stack sx={{ width: 500 }} spacing={2}>
            <Typography>
                Click the button below to immediately restore your plan. 
                It will be as though you never canceled. 
                If you change your mind, you can cancel your plan again 
                before {date} to avoid associated charges.
            </Typography>
            <ButtonWithAlert
                variant='contained'
                color='success'
                apiCall={PaymentAPI.renewSubscription}
                apiArgs={{ customerId }}
                onSuccess={(res) => {
                    setSubscription(res.data.subscription)
                    setTimeout(onClose, 500)
                }}
                successMessage='The subscription has been renewed'
            >
                Renew
            </ButtonWithAlert>
        </Stack>

    </Modal>

}


export default function RenewSubscriptionButton({ subscription, setSubscription, ...props }) {

    const [open, setOpen] = useState(false)

    const onClick = () => setOpen(true)
    const onClose = () => setOpen(false)

    return <>
        <Button
            {...props}
            variant='contained'
            color='success'
            onClick={onClick}>
            Renew Subscription
        </Button>
        {open && <RenewPrompt 
        open={open} 
        onClose={onClose} 
        subscription={subscription} 
        setSubscription={setSubscription}/>}
    </>
}