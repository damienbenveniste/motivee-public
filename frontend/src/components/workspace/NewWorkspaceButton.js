import { useState } from 'react'
import {
    Card,
    ButtonBase,
    CardActionArea,
    CardMedia,
} from '@mui/material'
import logo from 'images/workspace2.svg'
import CreateWorkspaceView from 'pages/workspaces/CreateWorkspaceView'


export default function NewWorkspaceButton() {

    const [open, setOpen] = useState(false)

    const onClick = () => setOpen(true)
    const onClose = () => setOpen(false)

    return <Card sx={{ borderRadius: 10, width: 250, height: 300 }} >
        <CardActionArea
            component={ButtonBase}
            onClick={onClick}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}
        >
            <CardMedia
                component="img"
                src={logo}
                sx={{ width: 250 }}
                alt="workspac" />

        </CardActionArea>
        {open && <CreateWorkspaceView open={open} onClose={onClose} />}
    </Card>
}