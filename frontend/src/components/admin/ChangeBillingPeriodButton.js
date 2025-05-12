import { useState } from 'react'
import ButtonWithAlert from "components/views/ButtonWithAlert"
import { Button, Typography, Stack } from '@mui/material'
import Modal from 'components/views/Modal'
import { PaymentAPI } from 'api/payments'
import { useParams } from 'react-router-dom'


function ChangePrompt({ open, onClose, subscription, setSubscription, setPlan }) {

    const { customerId } = useParams()
    const interval = subscription.plan.interval
    const text = interval === 'month' ? 'yearly': 'monthly'
    const newInterval = interval === 'month' ? 'year': 'month'

    return <Modal open={open} onClose={onClose}>
        <Stack sx={{ width: 500 }} spacing={2}>
            <Typography>
                The current subscription will be modified to {text}. The current subscription will be invoiced at 
                a prorated cost while the new one will start immediately.
            </Typography>
            <ButtonWithAlert
                variant='contained'
                color='warning'
                apiCall={PaymentAPI.modifySubscriptionInterval}
                apiArgs={{ customerId, interval: newInterval }}
                onSuccess={(res) => {
                    setSubscription(res.data.subscription)
                    setPlan(res.data.plan)
                    setTimeout(onClose, 500)
                }}
                successMessage='The billing period has been changed'
            >
                Modify to {text}
            </ButtonWithAlert>
        </Stack>
    </Modal>
}


export default function ChangeBillingPeriodButton({ subscription, setSubscription, setPlan, ...props }) {

    const [open, setOpen] = useState(false)

    const onClick = () => setOpen(true)
    const onClose = () => setOpen(false)

    const interval = subscription.plan.interval
    const text = interval === 'month' ? 'yearly': 'monthly'

    return <>
        <Button
            {...props}
            variant='contained'
            onClick={onClick}>
            Change to {text} Billing
        </Button>
        {open && <ChangePrompt
            open={open}
            onClose={onClose}
            subscription={subscription}
            setPlan={setPlan}
            setSubscription={setSubscription} />}
    </>
}