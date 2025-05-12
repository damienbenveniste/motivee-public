import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { IconButton, Typography } from "@mui/material"
import { useNavigate, useparams } from 'react-router-dom'
import URL from 'route/url'


export default function LogoutButton() {

    const navigate = useNavigate()
    const {customerId} = useParams()

    return <IconButton
        size='large'
        edge='end'
        onClick={() => navigate(URL.conversation(customerId))}
        color='inherit'>
        <ArrowBackIosNewIcon />
        <Typography variant='subtitle1' sx={{ mr: 1 }}>
            Back
        </Typography>
    </IconButton>
}