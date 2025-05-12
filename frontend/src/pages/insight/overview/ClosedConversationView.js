
import { useState, useEffect } from 'react'
import DonutChart from "components/visualizations/DonutChart"
import {
    Grid,
    Stack,
    Typography
} from '@mui/material'
import { useOutletContext } from "react-router-dom"
import Summaries from "./Summaries"
import CategoriesButtons from './CategoriesButtons'
import useUser from "hooks/useUser"


export default function ClosedConversationView() {

    const [user, isLoading] = useUser()
    const [color, setColor] = useState('green')
    const [text, setText] = useState('')
    const [data, setData] = useState([])
    const [pvalue, setPvalue] = useState(null)
    const { conversation } = useOutletContext()

    useEffect(() => {
        if (!conversation || !conversation.survey) return
        setPvalue(conversation.survey.pvalue)
        setData([
            conversation?.survey?.up_votes,
            conversation?.survey?.down_votes
        ])
    }, [conversation])



    useEffect(() => {
        if (!pvalue) return

        if (pvalue <= -0.95) {
            setColor('green')
        } else if (pvalue <= -0.9) {
            setColor('orange')
        } else {
            setColor('red')
        }

        if (pvalue <= -0.95) {
            setText('Clear Positive Consensus')
        } else if (pvalue >= 0.95) {
            setText('Clear Negative Consensus')
        } else if (pvalue <= -0.90) {
            setText('Potential Positive Consensus')
        } else if (pvalue >= 0.90) {
            setText('Potential Negative Consensus')
        } else {
            setText('Not clear Consensus')
        }

    }, [pvalue])

    const categoryAvailable = (user) => {
        if (!user) return false
        if (!user.categories) return false
        if (Object.keys(user.categories).length === 0) return false

        return true
    }

    return <Stack>
        <Grid
            container
            sx={{ marginTop: 3 }}
            justifyContent="center"
            alignItems="center"
            spacing={2}>
            <Grid item xs={5}>
                <Stack
                    spacing={2}
                    justifyContent="center"
                    alignItems="center">
                    <DonutChart data={data} />
                    <Typography color={color} variant='h5' align='center' >
                        {text}
                    </Typography>
                    {categoryAvailable(user) && <CategoriesButtons
                        conversation={conversation}
                        setPvalue={setPvalue}
                        setData={setData} />}
                </Stack>
            </Grid>
            <Grid item />
            <Grid item xs={6}>
                <Summaries />
            </Grid>
        </Grid>
    </Stack>
}