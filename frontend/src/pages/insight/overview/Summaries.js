
import SimpleSummaryView from 'components/insight/SimpleSummaryView'
import {Stack} from '@mui/material'


export default function Summaries() {

    return <Stack spacing={2}>
        <SimpleSummaryView type={'PRO'}/>
        <SimpleSummaryView type={'CON'}/>
    </Stack>




}