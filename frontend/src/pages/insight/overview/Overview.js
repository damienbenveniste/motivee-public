import { useOutletContext, useParams } from "react-router-dom"
import { Stack, Typography } from '@mui/material'
import OpenEndedConversationView from 'pages/insight/overview/OpenEndedConversationView'
import ClosedConversationView from 'pages/insight/overview/ClosedConversationView'


export default function Overview() {
    const { conversation } = useOutletContext()

    return <Stack spacing={2} alignItems='center' sx={{ width: '100%', height: '90vh', overflow: 'auto' }}>
        <Typography variant='h5'>
            {conversation?.question}
        </Typography>
        {conversation?.open_ended ? <OpenEndedConversationView /> : <ClosedConversationView />}
    </Stack>
}