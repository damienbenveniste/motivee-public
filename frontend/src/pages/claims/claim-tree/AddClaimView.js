
import { useState } from 'react'
import { Stack, Paper, Typography, IconButton, Button } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Colors from 'components/visualizations/colors'
import ClaimFormContainer from 'pages/claims/ClaimFormContainer'


export default function AddClaimView({ type, conversation, topClaim, onMessageSent }) {

    const [open, setOpen] = useState(false)

    var color = null
    var text = null
    var buttonText = null

    switch (type) {
        case 'CON':
            color = Colors.CON
            text = 'Cons'
            buttonText = 'Add a CON'
            break
        case 'PRO':
            color = Colors.PRO
            text = 'Pros'
            buttonText = 'Add a PRO'
            break
        case 'ANS':
            color = Colors.ANS
            text = 'Answers'
            buttonText = 'Add an Answer'
            break
    }

    const onClick = () => {
        setOpen(true)
    }

    const close = ({ claim = null }) => {
        setOpen(false)
        if (!claim) return
        onMessageSent('CREATE', [claim, topClaim])
    }

    return <Paper elevation={0} sx={{ width: '100%', padding: 2, borderRadius: 5 }}>
        <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'>
            <Typography variant='h6' color={color}>
                <b>{text}</b>
            </Typography>
            <Button onClick={onClick}>
                {buttonText} <AddCircleIcon sx={{ fontSize: 40, color: color, ml:2 }} />
            </Button>
            {open && <ClaimFormContainer
                open={open}
                onClose={close}
                conversation={conversation}
                type={type}
                parent={topClaim}
            />}
        </Stack>
    </Paper>
}