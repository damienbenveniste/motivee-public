import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

import { HEADER } from 'components/header/constants'
import ConversationHeader from 'components/header/ConversationHeader'
import NavBar from 'components/navbar/insight/NavBar'
import {
    useParams,
} from "react-router-dom"
import { ConversationAPI } from 'api/conversations'
import ErrorBoundary from 'components/errors/ErrorBoundary'


const drawerWidth = 280;

const MainStyle = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    flexGrow: 1,
    paddingTop: HEADER.MOBILE_HEIGHT + 24,
    paddingBottom: HEADER.MOBILE_HEIGHT + 24,
    [theme.breakpoints.up('lg')]: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
        paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
        width: '100%',
        transition: theme.transitions.create('margin-left', {
            duration: theme.transitions.duration.shorter,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    },
}))


function getInitValue() {
    const pathname = window.location.pathname
    if (pathname.includes('conversations')) return 0
    if (pathname.includes('feed')) return 1
    if (pathname.includes('conversation')) return 2
    if (pathname.includes('insight')) return 3
}


export default function DashboardLayout() {

    const [value, setValue] = useState(getInitValue())
    const [conversation, setConversation] = useState(null)
    const { conversationId, customerId } = useParams()

    useEffect(() => {
        ConversationAPI.getConversation({
            conversationId: conversationId,
            customerId,
            onSuccess: res => {
                setConversation(res.data)
            }
        })
    }, [conversationId, customerId])

    const openDrawer = value === 3

    return (
        <Box
            sx={{
                display: { lg: 'flex' },
                minHeight: { lg: 1 },
                height: '100%'
            }}
        >
            <ConversationHeader value={value} setValue={setValue} />
            <NavBar open={openDrawer} conversation={conversation} />

            <MainStyle open={openDrawer}>
                <ErrorBoundary>
                    <Outlet context={{ conversation }} key={customerId} />
                </ErrorBoundary>
            </MainStyle>
        </Box>
    )
}