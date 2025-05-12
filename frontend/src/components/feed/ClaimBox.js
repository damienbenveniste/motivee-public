import { Paper, Stack, Typography } from '@mui/material'
import palette from 'themes/palette'
import VerticalBarChart from 'components/visualizations/VerticalBarChart'
import String from 'utils/strings'

const colors = {
    PRO: 'success',
    CON: 'error',
    ANS: 'primary'
}


export default function ClaimBox({ claim, max, ...restProps }) {

    const color = colors[claim?.type]

    const noVotes = <Typography align='center' color='gray' variant='caption'>
        No votes yet!
    </Typography>

    const chart = (claim.up_votes + claim.down_votes) === 0 ? noVotes : (
        <VerticalBarChart claim={claim} max={max} />
    )

    return <Paper
        {...restProps}
        color={color}
        elevation={0}
        sx={{
            padding: 1,
            pl: 2, pr: 2, width: '100%',
            color: palette[color].darker,
            bgcolor: palette[color].lighter,
        }}>
        <Typography variant='caption'>
            {String.getLinks(claim?.text)}
        </Typography>
        {chart}
    </Paper>



}