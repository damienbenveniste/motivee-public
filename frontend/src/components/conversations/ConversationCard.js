
import { useState, useEffect } from 'react'
import {
    Box,
    Card,
    Divider,
    Typography,
    Stack,
    CardMedia,
    CardContent,
    ButtonBase,
    CardActionArea,
} from '@mui/material'
import background from 'images/background.png'
import WheelView from 'pages/wheelView/WheelView'
import { styled } from '@mui/material/styles'
import Number from 'utils/numbers'
import InsightButton from 'components/views/buttons/InsightButton'
import EditButton from 'components/views/buttons/EditButton'
import WheelButton from 'components/views/buttons/WheelButton'
import DeleteConversationButton from 'components/views/buttons/DeleteConversationButton'


const StyledTypography = styled(Typography)(({ theme }) => ({
    "&:hover": {
        color: '#03dbfc'
    }
}))


export default function ConversationCard({ conversation, isAdmin, user, deleteConversation }) {

    const [open, setOpen] = useState(false)
    const [elevation, setElevation] = useState(1)
    const [canDelete, setCanDelete] = useState(false)

    const onClick = () => setOpen(true)
    const onClose = () => setOpen(false)
    const onMouseOver = () => setElevation(20)
    const onMouseOut = () => setElevation(1)

    useEffect(() => {
        if (!conversation || !user) return
        const claim_number = conversation?.claim_number
        const votes = conversation?.votes
        const author = conversation?.author
        if (claim_number === 0 && votes === 0 && author === user.id) {
            setCanDelete(true)
        } else {
            setCanDelete(false)
        }

    }, [user, conversation])

    return <Card
        sx={{
            textAlign: 'center',
            boxShadow: '#919EAB',
            borderRadius: 5,
            height: 375,
            display: 'flex',
            flexFlow: 'column',
        }}
        elevation={elevation}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
    >
        <CardMedia
            component="img"
            height="100"
            image={background}
            sx={{ flex: '0 1 auto' }}
            alt="green iguana" />
        <CardContent sx={{ height: '100%' }}>
            <Stack justifyContent="space-between" alignItems="center" sx={{ height: '100%' }}>
                <CardActionArea
                    component={ButtonBase}
                    onClick={onClick}
                    sx={{ flex: '1 1 auto' }}
                >
                    <Stack
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2 }}
                        spacing={1}>

                        <StyledTypography
                            variant="subtitle1"
                            sx={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 3,
                            }}>
                            <b>{conversation?.title}</b>
                        </StyledTypography>

                        <Typography variant="body2" sx={{
                            color: 'text.secondary',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2
                        }}>
                            {conversation?.question}
                        </Typography>
                    </Stack>
                </CardActionArea>
                <Stack
                    spacing={1}
                    direction='row'
                    justifyContent="center"
                    sx={{ width: '100%' }}>
                    <WheelButton conversation={conversation} />
                    <EditButton conversation={conversation} />
                    {isAdmin && <InsightButton conversation={conversation} />}
                    {canDelete && <DeleteConversationButton
                        onDelete={deleteConversation}
                        conversation={conversation} />}
                </Stack>
                <Stack>
                    <Divider sx={{ borderStyle: 'dashed' }} />
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                    }}>
                        <div>
                            <Typography
                                variant="caption"
                                component="div"
                                sx={{ mb: 0.75, color: 'text.disabled' }}>
                                Claims
                            </Typography>
                            <Typography variant="subtitle1">
                                {Number.shortenNumber(conversation?.claim_number)}
                            </Typography>
                        </div>

                        <div>
                            <Typography
                                variant="caption"
                                component="div"
                                sx={{ mb: 0.75, color: 'text.disabled' }}>
                                Votes
                            </Typography>
                            <Typography variant="subtitle1">
                                {Number.shortenNumber(conversation?.votes)}
                            </Typography>
                        </div>

                        <div>
                            <Typography
                                variant="caption"
                                component="div"
                                sx={{ mb: 0.75, color: 'text.disabled' }}>
                                Participants
                            </Typography>
                            <Typography variant="subtitle1">
                                {Number.shortenNumber(conversation?.participant_number)}
                            </Typography>
                        </div>
                    </Box>
                </Stack>
            </Stack>
        </CardContent>
        {open && <WheelView open={open} onClose={onClose} conversation={conversation} />}
    </Card>

}