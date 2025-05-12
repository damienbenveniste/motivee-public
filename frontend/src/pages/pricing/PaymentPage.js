import { useState, useEffect } from 'react'
import PaymentSummary from "./PaymentSummary"
import CardPaymentView from "./CardPaymentView"
import { useParams, useNavigate } from 'react-router-dom'
import { PaymentAPI } from 'api/payments'
import URL from 'route/url'
import {Stack, Typography} from '@mui/material' 
import SignalWifiStatusbarConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4'


function FallBackUI() {
    return <Stack
        justifyContent="center"
        alignItems="center">
        <SignalWifiStatusbarConnectedNoInternet4Icon
            color='disabled'
            sx={{ height: 50, width: 50 }} />
        <Typography variant='h6' color='gray'>
            Oops something went wrong!
        </Typography>
    </Stack>
}


export default function PaymentPage() {

    const [yearly, setYearly] = useState(false)
    const [price, setPrice] = useState(null)
    const [memberNumber, setMemberNumber] = useState(null)
    const [total, setTotal] = useState(null)
    const [clientSecret, setClientSecret] = useState(null)
    const [checked, setChecked] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [key, setKey] = useState(Math.random())
    const navigate = useNavigate()
    const { customerId } = useParams()

    const interval = yearly ? 'year' : 'month'

    useEffect(() => {
        setLoading(true)
        PaymentAPI.getSubscriptionIntent({
            customerId,
            interval,
            onSuccess: (res) => {

                setError(false)
                if (res.status === 208) {
                    navigate(URL.billingAdmin(customerId))
                } else {
                    setPrice(res.data.price)
                    setMemberNumber(res.data.quantity)
                    setTotal(res.data.total)
                    setClientSecret(res.data.clientSecret)
                    setKey(Math.random())

                }

                setLoading(false)
            },
            onFailure: () => {
                setLoading(false)
                setError(true)
                setYearly(!yearly)
            }
        })
    }, [customerId, yearly])


    return <>
        <PaymentSummary
            yearly={yearly}
            setYearly={setYearly}
            price={price}
            memberNumber={memberNumber}
            loading={loading}
            total={total} />
        {error ? <FallBackUI /> : <CardPaymentView
            key={key}
            keyReset={key}
            checked={checked}
            loading={loading}
            setChecked={setChecked}
            clientSecret={clientSecret} />}
    </>
}