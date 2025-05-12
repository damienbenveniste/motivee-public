import { useEffect, useState } from 'react'
import { MenuItem, Typography, CircularProgress, Stack } from '@mui/material'
import { useParams } from 'react-router-dom'
import { PaymentAPI } from 'api/payments'

const planDict = {
    'basic': 'Basic Plan (free)',
    'team_monthly': 'Team Plan / montly subscription',
    'team_yearly': 'Team Plan / yearly subscription'
}

export default function PlanItem() {

    const { customerId } = useParams()
    const [plan, setPlan] = useState(null)
    const [email, setEmail] = useState(null)
    const [memberNumber, setMemberNumber] = useState(null)

    useEffect(() => {

        PaymentAPI.getCurrentPlan({
            customerId,
            onSuccess: (res) => {
                if (!res.data.subscription && res.data.trial) {
                    const trialPlan = `Free trial (${res.data.trial_days} days left)`
                    setPlan(trialPlan)  
                } else {
                    setPlan(planDict[res.data.plan])
                }
                setEmail(res.data.email)
                setMemberNumber(res.data.member_number)
            }
        })

    }, [customerId])

    return plan ? <MenuItem sx={{ backgroundColor: '#d7fcdc' }}>
        <Stack sx={{width: '100%'}}>
            <Typography variant='caption'>
                {email}
            </Typography>
            <Typography noWrap>
                {plan}
            </Typography>
            <Typography  noWrap variant='caption'>
                {memberNumber} members
            </Typography>
        </Stack>
    </MenuItem> : <CircularProgress />



}