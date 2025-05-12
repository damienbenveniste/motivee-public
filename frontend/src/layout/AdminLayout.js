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
import AdminNav from 'pages/admin/AdminNav'


const drawerWidth = 280;

const MainStyle = styled('main')(({ theme }) => ({
    flexGrow: 1,
    [theme.breakpoints.up('lg')]: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 5,
        paddingBottom: 5,
        width: '100%',
        transition: theme.transitions.create('margin-left', {
            duration: theme.transitions.duration.shorter,
        }),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}))


export default function AdminLayout() {
    return (
        <Box
            sx={{
                display: { lg: 'flex' },
                minHeight: { lg: 1 },
                height: '100%'
            }}
        >
            <AdminNav />

            <MainStyle >
                <ErrorBoundary>
                    <Outlet />
                </ErrorBoundary>
            </MainStyle>
        </Box>
    )
}