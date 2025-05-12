import { Stack, Typography } from "@mui/material"


export default function YoutubeEmbed({ embedId, title, height="480", width="853" }) {

    return <Stack alignItems='flex-start'>
        <Typography variant='h6'>
            {title}
        </Typography>
        <iframe
            width={width}
            height={height}
            src={`https://www.youtube.com/embed/${embedId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
        />
    </Stack>

}