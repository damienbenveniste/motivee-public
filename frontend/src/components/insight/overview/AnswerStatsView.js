import { useEffect, useState } from 'react'
import { ConversationAPI } from 'api/conversations'
import { useOutletContext, useParams } from "react-router-dom"
import AnswerDonutChart from 'components/visualizations/AnswerDonutChart'


export default function AnswerStatsView() {

    const { conversation } = useOutletContext()
    const [counts, setCounts] = useState([])
    const {customerId} = useParams()

    useEffect(() => {
        ConversationAPI.getStats({
            conversationId: conversation.id,
            customerId,
            onSuccess: res => setCounts(res.data)
        })
    }, [])

    return <AnswerDonutChart
        labels={counts.map(c => c.consensus)}
        data={counts.map(c => c.count)} />


}