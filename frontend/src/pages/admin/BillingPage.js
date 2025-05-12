import { useEffect, useState, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import {
    Stack,
    Typography
} from '@mui/material'
import PricingPlanView from 'pages/pricing/PricingPlanView'
import { PaymentAPI } from 'api/payments'
import CurrentSubscriptionView from './billing/CurrentSubscriptionView'
import ModifyPlanView from './billing/ModifyPlanView'
import Modal from 'components/views/Modal'


function UpgradePrompt({open, onClose}) {
    return <Modal open={open} onClose={onClose}>
        <Typography variant='h5' align='center'>
            You need to upgrade your plan or remove members from the workspace
            to continue using Motivee!
        </Typography>

    </Modal>

}

export default function BillingPage() {
    const { customerId } = useParams()
    const [plan, setPlan] = useState(null)
    const [email, setEmail] = useState(null)
    const [open, setOpen] = useState(false)
    const [memberNumber, setMemberNumber] = useState(null)
    const [elevation, setElevation] = useState(1)
    const [subscription, setSubscription] = useState(null)
    let location = useLocation()
    const pricingRef = useRef()
    const upgrade = location?.state?.upgrade

    useEffect(() => {

        PaymentAPI.getCurrentPlan({
            customerId,
            onSuccess: (res) => {
                if (!res.data.subscription && res.data.trial) {
                    setPlan('free_trial')  
                } else {
                    setPlan(res.data.plan)
                }
                setEmail(res.data.email)
                setMemberNumber(res.data.member_number)
                if (res.data.subscription) {
                    setSubscription(res.data.subscription)
                }
            }
        })

    }, [customerId])

    const scrollToBottom = () => {
        if (!pricingRef) return
        pricingRef.current.scrollIntoView({ behavior: "smooth" })
        setElevation(10)
        setTimeout(() => setElevation(1), 500)
    }

    useEffect(() => {
        if (!upgrade) return
        scrollToBottom()
        setOpen(true)

    }, [upgrade])

    const onClose = () => setOpen(false)

    return <Stack sx={{ height: '100%', overflow: 'auto', pb: 5 }} spacing={3}>
        <Typography variant='h5'>
            Billing Page
        </Typography>
        <CurrentSubscriptionView
            plan={plan}
            email={email}
            memberNumber={memberNumber}
            subscription={subscription} />
        <ModifyPlanView
            subscription={subscription}
            setPlan={setPlan}
            setSubscription={setSubscription}
            scrollToBottom={scrollToBottom} />
        <div style={{ float: "left", clear: "both" }} ref={pricingRef} />
        <PricingPlanView 
        elevation={elevation}
        currentPlan={plan}/>
        {open && <UpgradePrompt open={open} onClose={onClose}/>}
    </Stack>
}