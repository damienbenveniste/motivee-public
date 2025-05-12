import { Stack, Typography, Button } from "@mui/material"
import Label from 'components/pricing/Label'
import { PaymentAPI } from "api/payments"
import { useParams } from 'react-router-dom'


const planDict = {
    'basic': 'Basic Plan (free)',
    'team_monthly': 'Team Plan / montly subscription',
    'team_yearly': 'Team Plan / yearly subscription',
    'free_trial': 'Free Trial'
}

const frequencyDict = {
    'basic': 'None',
    'team_monthly': 'Month',
    'team_yearly': 'Year',
    'free_trial': 'None'
}

const options = { year: 'numeric', month: 'short', day: 'numeric' }


export default function CurrentSubscriptionView({
    plan,
    email,
    memberNumber,
    subscription }) {

    const { customerId } = useParams()
    const feePeruser = subscription? Math.round(subscription?.plan?.amount / 100): 0
    const total = feePeruser * memberNumber
    const cancelAt = subscription?.cancel_at
    const cancelDate = new Date(cancelAt * 1000).toLocaleString('en-US', options)
    const savings = 2 * 12 * memberNumber
    const active = subscription && subscription.plan.active

    const savingTextDict = {
        'team_monthly': `Switch to yearly billing and save $${savings}`,
        'team_yearly': `$${savings} saved with yearly billing`,
    }

    const savingText = savingTextDict[plan]

    const onClick = () => {
        PaymentAPI.getSession({
            customerId,
            onSuccess: (res) => {
                window.location.href = res.data.url
            }
        })
    }

    return <Stack>
        <Typography variant='h6'>
            Current Subscription
        </Typography>
        <Stack spacing={2} alignItems="center">

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems='center'
                sx={{ width: 500 }}>
                <Typography component="p" sx={{ color: 'text.secondary' }}>
                    Subscription
                </Typography>
                <Stack>
                    <Label color="success" variant="filled">
                        {planDict[plan]}
                    </Label>
                    {cancelAt && <Label variant="filled">
                        Set to be cancelled on {cancelDate}
                    </Label>}
                </Stack>
            </Stack>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems='center'
                sx={{ width: 500 }}>
                <Typography component="p" sx={{ color: 'text.secondary' }}>
                    Billing Period
                </Typography>
                <Typography component="p" >
                    {frequencyDict[plan]}
                </Typography>
            </Stack>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems='center'
                sx={{ width: 500 }}>
                <Typography component="p" sx={{ color: 'text.secondary' }}>
                    Contact email
                </Typography>
                <Typography component="p" >
                    {email}
                </Typography>
            </Stack>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems='center'
                sx={{ width: 500 }}>
                <Typography component="p" sx={{ color: 'text.secondary' }}>
                    Fees per user / billing period
                </Typography>
                <Typography >
                    ${feePeruser}
                </Typography>
            </Stack>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems='center'
                sx={{ width: 500 }}>
                <Typography component="p" sx={{ color: 'text.secondary' }}>
                    Workspace Users
                </Typography>
                <Typography >
                    {memberNumber} Members
                </Typography>
            </Stack>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems='center'
                sx={{ width: 500 }}>
                <Typography component="p" sx={{ color: 'text.secondary' }}>
                    Total fees / billing period
                </Typography>
                <Typography >
                    ${total}
                </Typography>
            </Stack>
            {active && <Typography
                variant="caption"
                sx={{
                    color: 'primary.main',
                }}
            >
                {savingText}
            </Typography>}
            {active && <Button onClick={onClick}>
                See more details
            </Button>}
        </Stack>
    </Stack>
}