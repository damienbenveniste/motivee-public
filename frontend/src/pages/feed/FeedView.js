
import { useState } from 'react'
import { Grid, Button, Box } from '@mui/material'
import FeedContainer from "./FeedContainer"
import ConversationFormContainer from 'pages/finder/ConversationFormContainer'
import useIsAdmin from 'hooks/useIsAdmin'
import { Auth } from 'components/login/firebaseAuth'

export default function FeedView() {

    const [open, setOpen] = useState(false)
    const onClose = () => setOpen(false)
    const onClick = () => setOpen(true)
    const [isAdmin, isLoading] = useIsAdmin()

    return <Grid container spacing={2}>
        <Grid item xs>
            {isAdmin && <Box display="flex" justifyContent="flex-end">
                <Button variant='outlined' onClick={onClick}>
                    Create Conversation
                </Button>
            </Box>}
            {open && isAdmin && <ConversationFormContainer open={open} onClose={onClose} />}
        </Grid>
        <Grid item xs={7} >
            <FeedContainer />
        </Grid>
        <Grid item xs />
    </Grid>
}