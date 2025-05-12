import { useState } from 'react'
import Modal from "components/views/Modal"
import { Stack, Typography } from '@mui/material'
import GuestListView from "./GuestListView"
import GuestInviteView from "./GuestInviteView"
import DomainListView from './DomainListView'
import DeleteWorkspaceButton from 'components/admin/DeleteWorkspaceButton'
import ChangePlanButton from 'components/admin/ChangePlanButton'
import AdminNav from './AdminNav'

export default function AdminPage() {

    const [key, setKey] = useState(Math.random())
    const reset = () => setKey(Math.random())

    return <Stack sx={{  height: '100%', overflow: 'auto', pb: 5 }} spacing={2}>
        <Typography variant='h5'>
            Admin Page
        </Typography>
        <GuestListView key={key} />
        <GuestInviteView reset={reset} />
        <DomainListView />
        <DeleteWorkspaceButton />
    </Stack>
}