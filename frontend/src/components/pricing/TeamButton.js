
import { Button } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import URL from 'route/url'



export default function TeamButton({ currentPlan, ...props }) {

    const { customerId } = useParams()
    const navigate = useNavigate()
    const onClick = () => navigate(URL.payment(customerId))

    return <Button
        {...props}
        disabled={currentPlan}
        onClick={onClick}>
        Choose Team Plan
    </Button>

}