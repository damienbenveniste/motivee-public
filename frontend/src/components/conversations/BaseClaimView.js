
import { useState, useEffect } from 'react'
import { Paper, Typography, Stack, Box } from '@mui/material'
import TagsView from './TagsView'
import VoteView from './VoteView'
import { styled } from '@mui/material/styles'
import String from 'utils/strings'
import DeleteClaimButton from 'components/views/buttons/DeleteClaimButton'
import EditClaimButton from 'components/views/buttons/EditClaimButton'


const PaperColor = styled(Paper, {
    shouldForwardProp: (prop) => prop !== "color",
})(({ theme, color }) => ({
    "&:hover": {
        // borderColor: "blue !important"
        border: `1px solid ${color}`
    }
}))

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

export default function BaseClaimView({
    claim,
    conversation,
    user,
    onMessageSent,
    isTop = false,
    onClick = null,
    ...restProps
}) {

    const [elevation, setElevation] = useState(0)
    const [canDelete, setCanDelete] = useState(false)
    const [votes, setVotes] = useState(null)

    const onMouseOver = () => setElevation(20)
    const onMouseOut = () => setElevation(0)

    const color = getColor(claim)
    const text = claim ? claim?.text : conversation?.question
    const tags = claim ? claim?.tags : conversation?.tags
    const variant = isTop ? 'h6' : 'body1'

    useEffect(() => {
        if (!claim || !user) return
        const children = claim.children
        const author = claim.author
        if (children.length === 0 && votes === 0 && author === user.id) {
            setCanDelete(true)
        } else {
            setCanDelete(false)
        }
    }, [claim, user, votes])

    return <PaperColor
        {...restProps}
        color={color}
        elevation={elevation}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={onClick}
        sx={{ pt: 3, pl: 3, pr: 3, pb: 1, borderRadius: 5, width: '100%' }}>
        <Stack
            spacing={2}
            justifyContent='space-evenly'
            alignItems='flex-start'
            sx={{ width: '100%' }}
        >
            <Typography variant={variant}>
                {String.getLinks(text)}
            </Typography>
            <Stack
                sx={{ width: '100%' }}
                justifyContent='space-evenly'
                alignItems='flex-end'>
                {claim && <TagsView
                    tags={tags}
                    edit={true}
                    claim={claim}
                    modifyClaim={onMessageSent} />}
                {claim && <VoteView
                    key={claim.id}
                    claim={claim}
                    modifyClaim={onMessageSent}
                    setVotes={setVotes} />}
            </Stack>
            {canDelete && <Box
                justifyContent='center'
                display='flex'
                sx={{ width: '100%' }}>
                <Stack
                    direction='row'
                    spacing={1}
                    sx={{ display: 'flex', width: 300 }}
                    justifyContent='center'>
                    <DeleteClaimButton
                        claim={claim}
                        deleteClaim={onMessageSent}
                        sx={{ flex: 1 }} />
                    <EditClaimButton
                        sx={{ flex: 1 }}
                        conversation={conversation}
                        onEdit={onMessageSent}
                        claim={claim} />
                </Stack>
            </Box>}
        </Stack>
    </PaperColor>

}