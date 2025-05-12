import { useState, useEffect } from 'react'
import { Stack, Button, Grid } from '@mui/material'
import ConversationFormContainer from 'pages/finder/ConversationFormContainer'
import SearchBar from 'components/views/SearchBar'
import { ConversationScroller } from 'pages/finder/ConversationScroller'
import useIsAdmin from 'hooks/useIsAdmin'
import useUser from 'hooks/useUser'
import WelcomeSlideShow from 'pages/slide_show/WelcomeSlideShow'
import { useLocation } from 'react-router-dom'


export default function ConversationFinder() {

    const [open, setOpen] = useState(false)
    const [openSlideShow, setOpenSlideShow] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [isAdmin, isLoading] = useIsAdmin()
    const [user, loading] = useUser()
    const location = useLocation()

    const onClose = () => setOpen(false)
    const onClick = () => setOpen(true)
    const onSlideClose = () => setOpenSlideShow(false)

    useEffect(() => {
        if (isLoading) return
        if (location.state?.newUser) setOpenSlideShow(true)
    }, [location, isAdmin])

    return <>
        <Stack
            spacing={2}
            sx={{ width: '100%', height: '100%' }}
            alignItems='center'>
            <Grid
                container
                direction='row'
                spacing={2}
                justifyContent='space-between'
                alignItems='center'>
                <Grid item xs={4} />
                <Grid item xs={4} >
                    <SearchBar searchText={searchText} setSearchText={setSearchText} />
                </Grid>
                <Grid item xs={4} >
                    {isAdmin && <Button variant='outlined' onClick={onClick} >
                        Create Conversation
                    </Button>}
                </Grid>
            </Grid>
            <ConversationScroller searchText={searchText} key={searchText} isAdmin={isAdmin} user={user} />
        </Stack>
        {open && isAdmin && <ConversationFormContainer open={open} onClose={onClose} />}
        {openSlideShow && <WelcomeSlideShow
            isAdmin={isAdmin}
            open={openSlideShow}
            onClose={onSlideClose} />}
    </>
}