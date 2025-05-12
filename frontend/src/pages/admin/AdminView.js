import {useState} from 'react'
import Modal from "components/views/Modal"
import { Stack, Typography } from '@mui/material'
import GuestListView from "./GuestListView"
import GuestInviteView from "./GuestInviteView"
import DomainListView from './DomainListView'
import DeleteWorkspaceButton from 'components/admin/DeleteWorkspaceButton'
import ChangePlanButton from 'components/admin/ChangePlanButton'


export default function AdminView({ open, onClose }) {

    const [key, setKey] = useState(Math.random())
    const reset = () => setKey(Math.random())

    return <Modal open={open} onClose={onClose} >
        <Stack sx={{ width: '70vw', height: '70vh', overflow: 'auto' }} spacing={2}>
            <Typography variant='h5'>
                Admin Page
            </Typography>
            <GuestListView key={key}/>
            <GuestInviteView reset={reset}/>
            <DomainListView />
            <ChangePlanButton/>
            <DeleteWorkspaceButton />
        </Stack>
    </Modal>
}