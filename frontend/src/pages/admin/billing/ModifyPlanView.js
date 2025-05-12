
import { Typography, Stack, Button } from "@mui/material"
import DeleteSubscriptionButton from "components/admin/DeleteSubscriptionButton"
import RenewSubscriptionButton from "components/admin/RenewSubscriptionButton"
import ChangeBillingPeriodButton from "components/admin/ChangeBillingPeriodButton"


export default function ModifyPlanView({ 
    subscription, 
    setSubscription, 
    scrollToBottom,
    setPlan 
}) {

    const cancelAt = subscription?.cancel_at
    const active = subscription && subscription.plan.active

    const modifyButton = cancelAt ? <RenewSubscriptionButton
        subscription={subscription}
        setSubscription={setSubscription}
        sx={{ width: '50%' }}
    /> : <DeleteSubscriptionButton
        subscription={subscription}
        setSubscription={setSubscription}
        sx={{ width: '50%' }} />


    return <Stack>
        <Typography variant='h6'>
            Modify Subscription
        </Typography>
        <Stack
            spacing={2}
            alignItems="center"
            justifyContent='stretch'>
            <Button
                variant='contained'
                onClick={scrollToBottom}
                sx={{ width: '50%' }} >
                Upgrade Subscription
            </Button>
            {active && <ChangeBillingPeriodButton
                disabled={cancelAt}
                subscription={subscription}
                setSubscription={setSubscription}
                setPlan={setPlan}
                sx={{ width: '50%' }} />}
            {active && modifyButton}
        </Stack>
    </Stack>
}