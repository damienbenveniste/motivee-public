
import AnswerStatsView from 'components/insight/overview/AnswerStatsView'
import {
    Grid,
} from '@mui/material'
import SimpleSummaryView from 'components/insight/SimpleSummaryView'


export default function OpenEndedConversationView() {

    return <Grid
        container
        sx={{ marginTop: 3 }}
        justifyContent="center"
        alignItems="center"
        spacing={2}>
        <Grid item xs={4}>
            <AnswerStatsView />
        </Grid>
        <Grid item />
        <Grid item xs={6}>
        <SimpleSummaryView type={'ANS'}/>
        </Grid>
    </Grid>
}