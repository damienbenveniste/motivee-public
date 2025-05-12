import {
    Card,
    CardContent,
    CardHeader,
    CardActionArea,
    Stack,
    ButtonBase,
    Typography
} from '@mui/material'
import moment from 'moment'
import FeedClaimView from './FeedClaimView'
import String from 'utils/strings'
import { styled } from '@mui/material/styles'
import ConversationHighlight from 'components/feed/ConversationHighlight'
import ConversationSurveyForm from 'components/conversations/ConversationSurveyForm'
import { useNavigate, useParams } from 'react-router-dom'
import URL from 'route/url'


const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
    "&:hover": {
        color: '#03dbfc'
    }
}))


export default function FeedCard({ claim }) {

    const navigate = useNavigate()
    const {customerId} = useParams()

    const converationTitle = claim?.conversation?.question
    const timeAgo = moment(claim?.conversation?.time_created).fromNow()
    const parentText = claim?.type === 'ANS' ? (
        String.getLinks(`Question: ${claim?.conversation?.question}`)
    ) : (
        String.getLinks(`Claim: ${claim?.parent?.text}`)
    )

    const claimTitle = claim?.parent || claim?.type === 'ANS' ? parentText : null

    const onClick = () => {
        if (!claim || !claim.conversation) return
        navigate(URL.conversation(customerId, claim.conversation.id))
    }

    return <Card elevation={0} sx={{ borderRadius: 5 }} variant='outlined'>
        <CardActionArea
            component={ButtonBase}
            onClick={onClick}
            sx={{ flex: '1 1 auto' }}>
            <StyledCardHeader
                title={converationTitle}
                subheader={timeAgo}
            />
        </CardActionArea>
        <CardContent>
            {
                claim.conversation && !claim?.conversation?.open_ended &&
                <ConversationSurveyForm conversation={claim.conversation} wrap={false}/>
            }
            <Stack spacing={1}>
                <Typography>
                    <b>Top opinions</b>
                </Typography>
                <ConversationHighlight conversation={claim?.conversation} />
                <Typography>
                    <b>Latest claim</b>
                </Typography>
                {claimTitle}
                <FeedClaimView claim={claim} />
            </Stack>
        </CardContent>
    </Card>

}