
import { IconButton, Typography } from "@mui/material"
import LoginIcon from '@mui/icons-material/Login'
import { useNavigate } from "react-router-dom"
import URL from "route/url"

export default function SignupButton(props) {

    const navigate = useNavigate()

    return <IconButton
        {...props}
        size='large'
        edge='end'
        onClick={() => navigate(URL.SIGNUP)}
        color='inherit'>
        <Typography variant='subtitle1' sx={{ mr: 1 }}>
            Sign up
        </Typography>
        <LoginIcon />
    </IconButton>
}