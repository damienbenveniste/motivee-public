import { Stack, Typography } from "@mui/material"
import YoutubeEmbed from "./YoutubeEmbed"

const youtubeIds = [
    {
        id: 'jxeILHaRtsw',
        title: 'How to create workspaces'
    },
    {
        id: 'bD7qOnHY6BQ',
        title: 'How to create conversation topics'
    },
    {
        id: '-V2l3nc5OFo',
        title: 'How to interact with a topic'
    },
    {
        id: 'mF6is7Tf5YE',
        title: 'How to delete a topic'
    },
]


export default function HowToPage() {
    return <Stack 
    sx={{ width: '100%' }} 
    spacing={3}
    alignItems='center'>
        <Typography variant='h4'>
            Getting Started
        </Typography>
        {youtubeIds.map(obj => <YoutubeEmbed
            embedId={obj.id}
            title={obj.title}
            key={obj.id} />)}
    </Stack>
}