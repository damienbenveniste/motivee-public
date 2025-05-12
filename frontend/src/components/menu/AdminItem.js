import { useState } from 'react'
import SettingsIcon from '@mui/icons-material/Settings'
import useIsAdmin from 'hooks/useIsAdmin'
import { MenuItem, ListItemIcon } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import URL from 'route/url'


export default function AdminItem() {
    const [isAdmin, isLoading] = useIsAdmin()
    const { customerId } = useParams()
    const navigate = useNavigate()

    const onClick = () => {
        navigate(URL.admin(customerId))
    }

    return isAdmin ? <MenuItem title='Admin' onClick={onClick}>
        <ListItemIcon  >
            <SettingsIcon />
        </ListItemIcon>
        Admin
    </MenuItem> : null

}



