
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Auth } from 'components/login/firebaseAuth'
import { InviteeAPI } from 'api/invitees'
import { Stack, Typography, Grid, Box, Divider } from '@mui/material'
import WorkspaceCard from 'components/workspace/WorkspaceCard'
import LogoutButton from 'components/header/buttons/LogoutButton'
import NewWorkspaceButton from 'components/workspace/NewWorkspaceButton'
import { useNavigate } from 'react-router-dom'
import URL from 'route/url'


function getWorkspaceId() {
    const id = window.localStorage.getItem('workspaceForInvitee')
    if (id) {
        window.localStorage.removeItem('workspaceForInvitee')
        return parseInt(id)
    }
    return id
}


function Workspaces({workspaces}) {

    const workspaceCards = workspaces.map(workspace => <WorkspaceCard
        customer={workspace}
        key={workspace.id} />)

    return <Stack spacing={3}
        alignItems='center'
        justifyContent='center'
        sx={{ width: "100%" }}>
        <Typography variant='h5'>
            Choose your Workspace
        </Typography>
        <Stack
            spacing={1}
            sx={{ width: "100%", maxHeight: 600, overflow: 'auto', pb: 1 }}
            alignItems='center' justifyContent='flex-start'>
            {workspaceCards}
        </Stack>
    </Stack>
}

export default function WorkspaceView() {
    const [user, loading, error] = useAuthState(Auth.getAuth())
    const [workspaces, setWorkspaces] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (!user || loading) return
        InviteeAPI.getCustomers({
            onSuccess: (res) => {
                const customers = res.data.results.map(w => w.customer)
                const uniqueCustomers = [...new Map(customers.map(customer =>
                    [customer.id, customer])).values()
                ]
                setWorkspaces(uniqueCustomers)
            }
        })
    }, [user, loading])

    useEffect(() => {
        if (workspaces.length === 0) return
        const id = getWorkspaceId()
        if (id && workspaces.map(w => w.id).includes(id)) {
            navigate(URL.conversation(id), {state: {newUser: true}})
        }

    }, [workspaces])

    return <>
        <LogoutButton sx={{ position: 'absolute', right: 100 }} />
        <Box sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Grid
                container
                justifyContent="center"
                alignItems="flex-start"
                sx={{ pb: 20 }}>
                <Grid item />
                {workspaces.length !== 0 && <><Grid item xs={3} >
                    <Workspaces workspaces={workspaces}/>
                </Grid>
                <Divider orientation="vertical" flexItem sx={{ padding: 2 }}>
                    Or
                </Divider></>}
                <Grid item xs={3} >
                    <Stack spacing={3}
                        alignItems='center'
                        justifyContent='center'
                        sx={{ width: "100%" }}>
                        <Typography variant='h5'>
                            Create a new Workspace
                        </Typography>
                        <NewWorkspaceButton />
                    </Stack>
                </Grid>
                <Grid item />
            </Grid>
        </Box>
    </>
}