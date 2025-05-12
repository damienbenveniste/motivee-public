
import { Paper, Typography, Stack, Box } from '@mui/material'
import TagsView from 'components/conversations/TagsView'
import VoteView from 'components/conversations/VoteView'
import String from 'utils/strings'
import palette from 'themes/palette'
import AddClaimView from 'components/feed/AddClaimView'

const colors = {
    PRO: 'success',
    CON: 'error',
    ANS: 'primary'
}

const titles = {
    PRO: 'Pro',
    CON: 'Con',
    ANS: 'Answer'
}

export default function FeedClaimView({ claim, ...restProps }) {

    const color = colors[claim?.type]
    const title = titles[claim?.type]

    return <Paper
        {...restProps}
        color={color}
        elevation={0}
        sx={{
            pt: 3, pl: 3, pr: 3, pb: 1,
            borderRadius: 5, width: '100%',
            color: palette[color].darker,
            bgcolor: palette[color].lighter,
        }}>
        <Stack
            spacing={1}
            justifyContent='space-evenly'
            alignItems='center'
            sx={{ width: '100%' }}
        >
            <Typography variant="h6">
                <b>{title}</b>
            </Typography>
            {String.getLinks(claim?.text)}
            <Stack
                sx={{ width: '100%' }}
                justifyContent='space-evenly'
                alignItems='flex-end'>
                <TagsView tags={claim?.tags} />
            </Stack>
            <Stack
                direction='row'
                sx={{ width: '100%' }}
                spacing={4}
                justifyContent="center"
                alignItems="center"
            >
                <AddClaimView
                    type='PRO'
                    conversation={claim?.conversation}
                    parent={claim}
                />
                <AddClaimView
                    type='CON'
                    conversation={claim?.conversation}
                    parent={claim}
                />
                <Box sx={{ flexGrow: 1 }} />
                <VoteView claim={claim} />
            </Stack>
        </Stack>
    </Paper>

}