
import { IconButton, Typography } from "@mui/material"
import LogoutIcon from '@mui/icons-material/Logout'
import { Auth } from 'components/login/firebaseAuth'


export default function LogoutButton(props) {

    return <IconButton
        {...props}
        size='large'
        edge='end'
        onClick={Auth.logout}
        color='inherit'>
        <Typography variant='subtitle1' sx={{ mr: 1 }}>
            Logout
        </Typography>
        <LogoutIcon />
    </IconButton>
}