import { MenuItem, ListItemIcon} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { Auth } from 'components/login/firebaseAuth'

export default function LogoutItem() {

    return <MenuItem onClick={Auth.logout}>
    <ListItemIcon>
        <LogoutIcon/>
    </ListItemIcon>
    Logout
    </MenuItem>
}