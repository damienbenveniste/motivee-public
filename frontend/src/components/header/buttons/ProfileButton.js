
import { IconButton, Tooltip } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Auth } from 'components/login/firebaseAuth'
import { useNavigate, useParams } from 'react-router-dom'
import URL from 'route/url'


export default function ProfileButton() {

    const [user, loading, error] = useAuthState(Auth.getAuth())
    const navigate = useNavigate()
    const { customerId } = useParams()

    const onClick = () => {
        if (!user) return
        navigate(URL.profile(customerId, user.uid))
    }

    return <Tooltip title="Profile">
        <IconButton color='inherit' disabled={loading} onClick={onClick}>
            <AccountCircleIcon color='warning' sx={{ width: 40, height: 40 }} />
        </IconButton>
    </Tooltip>
} 