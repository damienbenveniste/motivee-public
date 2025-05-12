
import {
    Stack,
    Typography
} from '@mui/material'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'


export default function InactiveVoteView({ claim = null, upVotes = null, downVotes = null, ...props }) {


    return <Stack
        direction='row'
        justifyContent="center"
        alignItems="center"
        spacing={props.spacing}>
        <ThumbUpAltIcon color='disabled' sx={{ height: props.iconHeight, width: props.iconHeight }} />
        <Typography variant={props.variant}>
            {claim ? claim.up_votes : upVotes}
        </Typography>
        <ThumbDownAltIcon color='disabled' sx={{ height: props.iconHeight, width: props.iconHeight }} />
        <Typography variant={props.variant}>
            {claim ? claim.down_votes : downVotes}
        </Typography>
    </Stack>
}


InactiveVoteView.defaultProps = {
    variant: 'body1',
    iconHeight: 20,
    spacing: 1
}