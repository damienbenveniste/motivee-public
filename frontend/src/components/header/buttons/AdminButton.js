import { useState } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import useIsAdmin from 'hooks/useIsAdmin'
import AdminView from 'pages/admin/AdminView'


export default function AdminButton() {
    const [isAdmin, isLoading] = useIsAdmin()
    const [open, setOpen] = useState(false)

    const onClick = () => setOpen(true)
    const onClose = () => setOpen(false)

    return isAdmin ? <>
        <Tooltip title='Admin'>
            <IconButton color='inherit' onClick={onClick}>
                <SettingsIcon color='action' sx={{ width: 40, height: 40 }} />
            </IconButton>
        </Tooltip>
        {open && <AdminView open={open} onClose={onClose} />}
    </> : null
}