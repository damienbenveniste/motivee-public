
import { useEffect, useState } from "react"
import { ClaimAPI } from "api/claims"
import { useParams } from "react-router-dom"
import AnswerBox from "components/insight/AnswerBox"
import { Stack, CircularProgress } from "@mui/material"
import { PValueInformation } from 'components/views/HelperComponent'

export default function TopAnswersView() {

    const [topClaims, setTopClaims] = useState([])
    const [loading, setLoading] = useState(false)
    const { conversationId, tag, customerId } = useParams()

    const topRelation = 0

    useEffect(() => {
        setLoading(true)
        ClaimAPI.getTopClaims({
            conversationId,
            topRelation,
            tag,
            customerId,
            onSuccess: res => {
                setLoading(false)
                setTopClaims(res.data.results)
            },
            onFailure: () => setLoading(false)
        })
    }, [conversationId, tag])

    const claimList = topClaims.map((claim, i) => {
        return <AnswerBox key={claim?.id} claim={claim} index={i+1} />
    })

    return <Stack spacing={1} sx={{width:'100%'}} alignItems="center">
        <PValueInformation />
        {loading ? <CircularProgress /> : claimList}
    </Stack>
}