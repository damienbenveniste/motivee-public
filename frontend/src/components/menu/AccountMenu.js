import * as React from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import { IconButton, Tooltip } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import PlanItem from './PlanItem'
import LogoutItem from './LogoutItem'
import AdminItem from './AdminItem'


export default function AccountMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    return (
        <React.Fragment>
            <Tooltip title="Your Account">
                <IconButton color='inherit' onClick={handleClick}>
                    <AccountCircleIcon color='warning' sx={{ width: 40, height: 40 }} />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                sx={{width: 300}}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        width: 300,
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <PlanItem />
                <Divider />
                <AdminItem/>
                <LogoutItem />
            </Menu>
        </React.Fragment>
    )
}