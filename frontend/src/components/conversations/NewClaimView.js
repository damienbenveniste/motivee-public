import {useState} from 'react'
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

export default function NewClaimView({
    claim,
    parent,
    conversation,
    onClick,
    ...restProps
}) {

    const [elevation, setElevation] = useState(0)

    const color = getColor(claim)
    const text = claim?.text
    const tags = claim?.tags
    const parentText = parent ? parent?.text : conversation?.question

    const onMouseOver = () => setElevation(20)
    const onMouseOut = () => setElevation(0)

    return <Paper
        {...restProps}
        onClick={() => onClick(claim)}
        elevation={elevation}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}

        sx={{
            pt: 2, pl: 2, pr: 2, pb: 1,
            border: `1px solid ${color}`,
            borderRadius: 5, maxWidth: 800,
            width: restProps.width ? restProps.width : '100%'
        }}>
        <Stack
            justifyContent='space-evenly'
            alignItems='flex-start'
            sx={{ width: '100%' }}
        >
            <Typography variant='body1' color='text.secondary' noWrap sx={{ width: '100%' }}>
                <b>{parentText}</b>
            </Typography>
            <Typography variant='body2'>
                {String.getLinks(text)}
            </Typography>
            <Stack
                sx={{ width: '100%' }}
                spacing={1}
                justifyContent='space-evenly'
                alignItems='flex-end'>
                <TagsView tags={tags} />
                {claim.up_votes !== undefined && <InactiveVoteView claim={claim} />}
            </Stack>
        </Stack>
    </Paper>

}