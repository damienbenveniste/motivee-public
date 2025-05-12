import { useEffect, useState } from 'react'
import { PaymentAPI } from 'api/payments'
import { useParams, useLocation } from 'react-router-dom'


function getShouldUpdate(memberNumber, subscription, trial) {
    if (trial) return false
    if (subscription && subscription.status === 'active') return false
    return memberNumber > 5 
}


export default function useShouldUpgrade() {

    const [loading, setLoading] = useState(true)
    const [shouldUpdate, setShouldUpdate] = useState(false)
    const { customerId } = useParams()
    const location = useLocation()

    useEffect(() => {
        setLoading(true)
        PaymentAPI.getCurrentPlan({
            customerId,
            onSuccess: (res) => {
                setLoading(false)
                const memberNumber = res.data.member_number
                const subscription = res.data.subscription
                const trial = res.data.trial
                setShouldUpdate(
                    getShouldUpdate(memberNumber, subscription, trial)
                )
                setTimeout(() =>  setShouldUpdate(false), 2000)
            },
            onFailure: () => setLoading(false)
        })
    }, [customerId, location])

    return [shouldUpdate, loading]
}