import { useOutletContext, useParams } from "react-router-dom"
import { Stack, Typography } from '@mui/material'
import OpenEndedConversationView from 'pages/insight/top-claims/OpenEndedConversationView'
import ClosedConversationView from 'pages/insight/top-claims/ClosedConversationView'


function capitalizeFirstLetter(string) {
    if (!string) return 'Overall'
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export default function TopClaims() {
    const { conversation } = useOutletContext()
    const { tag } = useParams()

    return <Stack spacing={2} alignItems='center' sx={{ width: '100%', height: '90vh', overflow: 'auto' }}>
        <Typography variant='h5'>
            {conversation?.question}
        </Typography>
        <Typography variant='h6'>
            {`${capitalizeFirstLetter(tag)} Top Claims`}
        </Typography>
        {conversation?.open_ended ? <OpenEndedConversationView /> : <ClosedConversationView />}
    </Stack>
}