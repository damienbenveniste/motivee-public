import {useState} from 'react'
import {Stack, Typography, IconButton} from '@mui/material'
import Colors from 'components/visualizations/colors'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import ClaimFormContainer from 'pages/claims/ClaimFormContainer'

export default function AddClaimView({ type, conversation, parent }) {

    const [open, setOpen] = useState(false)

    var color = null
    var text = null

    switch (type) {
        case 'CON':
            color = Colors.CON
            text = 'Cons'
            break
        case 'PRO':
            color = Colors.PRO
            text = 'Pros'
            break
        case 'ANS':
            color = Colors.ANS
            text = 'Answers'
            break
    }

    const onClick = () => {
        setOpen(true)
    }

    const close = () => {
        setOpen(false)
    }

    return <Stack
            direction='row'
            justifyContent='center'
            alignItems='center'>
            <Typography variant='h6' color={color}>
                <b>{text}</b>
            </Typography>
            <IconButton onClick={onClick}>
                <AddCircleIcon sx={{ fontSize: 30, color: color }} />
            </IconButton>
            {open && <ClaimFormContainer
                open={open}
                onClose={close}
                conversation={conversation}
                type={type}
                parent={parent}
            />}
        </Stack>
}