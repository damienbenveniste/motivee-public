import { Paper, Typography, Stack } from '@mui/material'
import TagsView from './TagsView'
import InactiveVoteView from './InactiveVoteView'
import String from 'utils/strings'


function getColor(claim) {
    if (!claim) return '#05e3e3'

    switch (claim.type) {
        case 'CON':
            return '#fa1b1b'
        case 'PRO':
            return '#0ccc13'
        default:
            return '#05e3e3'
    }
}

export default function OverlayClaimView({
    claim,
    ...restProps
}) {

    const color = getColor(claim)
    const text = claim?.text
    const tags = claim?.tags

    return <Paper
        {...restProps}
        elevation={10}

        sx={{
            pt: 2, pl: 2, pr: 2, pb: 1,
            border: `1px solid ${color}`,
            borderRadius: 5, maxWidth: 800,
            width: restProps.width ? restProps.width : '100%'
        }}>
        <Stack
            spacing={2}
            justifyContent='space-evenly'
            alignItems='flex-start'
            sx={{ width: '100%' }}
        >
            <Typography variant='body2'>
                {String.getLinks(text)}
            </Typography>
            <Stack
                sx={{ width: '100%' }}
                justifyContent='space-evenly'
                alignItems='flex-end'>
                <TagsView tags={tags} />
                {claim.up_votes !== undefined && <InactiveVoteView claim={claim} />}
            </Stack>
        </Stack>
    </Paper>

}