
import { IconButton, Typography } from "@mui/material"
import LoginIcon from '@mui/icons-material/Login'
import { useNavigate } from "react-router-dom"
import URL from "route/url"


export default function LoginButton(props) {

    const navigate = useNavigate()

    return <IconButton
        {...props}
        size='large'
        edge='end'
        onClick={() => navigate(URL.LOGIN)}
        color='inherit'>
        <Typography variant='subtitle1' sx={{ mr: 1 }}>
            Login
        </Typography>
        <LoginIcon />
    </IconButton>
}