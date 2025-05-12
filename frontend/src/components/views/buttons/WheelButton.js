import { useState } from 'react'
import DonutSmallIcon from '@mui/icons-material/DonutSmall'
import { IconButton, Tooltip } from '@mui/material'
import WheelView from 'pages/wheelView/WheelView'

export default function WheelButton({conversation, ...props}) {

    const [open, setOpen] = useState(false)
    const onClick = () => setOpen(true)
    const onClose = () => setOpen(false)

    return <><Tooltip title='Explore'>
        <IconButton {...props} onClick={onClick}>
            <DonutSmallIcon fontSize="inherit" />
        </IconButton>
    </Tooltip>
    {open && <WheelView open={open} onClose={onClose} conversation={conversation} />}
    </>
}




