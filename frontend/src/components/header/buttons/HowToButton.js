import { useState } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help'
import { useNavigate, useParams } from 'react-router-dom'
import URL from 'route/url'


export default function HowToButton() {

    const navigate = useNavigate()
    const {customerId} = useParams()

    const onClick = () => {
        navigate(URL.howTo(customerId))
    }

    return <Tooltip title='How to?'>
        <IconButton color='inherit' onClick={onClick}>
            <HelpIcon color='action' sx={{ width: 20, height: 20 }} />
        </IconButton>
    </Tooltip>
}