import AnalyticsIcon from '@mui/icons-material/Analytics'
import { IconButton, Tooltip } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import URL from 'route/url'

export default function InsightButton({ conversation, ...props }) {
    const navigate = useNavigate()
    const { customerId } = useParams()

    const onClick = () => {
        navigate(URL.insightOverview(customerId, conversation.id))
    }

    return <Tooltip title='Insight'>
        <IconButton {...props} onClick={onClick} >
            <AnalyticsIcon fontSize="inherit" />
        </IconButton>
    </Tooltip>
}

