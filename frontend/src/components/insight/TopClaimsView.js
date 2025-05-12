
import { useEffect, useState } from "react"
import { ClaimAPI } from "api/claims"
import { useParams } from "react-router-dom"
import ClaimsBox from "components/insight/ClaimBox"
import { Stack, CircularProgress } from "@mui/material"

export default function TopClaimsView({ topRelation, claim=null }) {

    const [topClaims, setTopClaims] = useState([])
    const [loading, setLoading] = useState(false)
    const { conversationId, tag, customerId } = useParams()

    useEffect(() => {
        setLoading(true)
        ClaimAPI.getTopClaims({
            conversationId,
            topRelation,
            tag,
            claimId: claim?.id, 
            customerId,
            onSuccess: res => {
                setLoading(false)
                setTopClaims(res.data.results)
            },
            onFailure: () => setLoading(false)
        })
    }, [conversationId, tag])

    const claimList = topClaims.map((claim, i) => {
        return <ClaimsBox index={i+1} key={claim?.id} claim={claim} />
    })

    return <Stack spacing={2} alignItems="center" sx={{width: '100%'}}>
        {loading? <CircularProgress/> : claimList}
    </Stack>
}