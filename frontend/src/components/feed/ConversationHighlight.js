import { useEffect, useState } from "react"
import { ClaimAPI } from "api/claims"
import { useParams } from "react-router-dom"
import { Stack, CircularProgress } from '@mui/material'
import ClaimBox from "./ClaimBox"
import AddClaimView from 'components/feed/AddClaimView'


export default function ConversationHighlight({ conversation }) {

    const [loading, setLoading] = useState(false)
    const [claims, setClaims] = useState([])
    const {customerId} = useParams()

    useEffect(() => {
        setLoading(true)
        ClaimAPI.getTopClaims({
            conversationId: conversation?.id,
            root: true,
            customerId,
            onSuccess: res => {
                setLoading(false)
                setClaims(res.data.results.slice(0, 3))
            },
            onFailure: () => setLoading(false)
        })
    }, [])

    const maxVal = Math.max(...claims.map(c => Math.max(c.up_votes, c.down_votes)))
    const claimsList = claims.map(claim => <ClaimBox key={claim.id} claim={claim} max={maxVal} />)


    return <Stack spacing={1}>
        {loading ? <CircularProgress /> : claimsList}
        {conversation?.open_ended ? (
            <AddClaimView
                type='ANS'
                conversation={conversation}
                parent={null} />
        ) : <Stack
            direction='row'
            spacing={4}
            justifyContent="space-around"
            alignItems="center"
        >
            <AddClaimView
                type='PRO'
                conversation={conversation}
                parent={null}
            />
            <AddClaimView
                type='CON'
                conversation={conversation}
                parent={null}
            />
        </Stack>}
    </Stack>
}