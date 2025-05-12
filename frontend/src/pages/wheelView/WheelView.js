import { useEffect, useState } from 'react'

import Modal from 'components/views/Modal'
import SunburstView from 'components/visualizations/SunburstView'
import TagsView from 'components/conversations/TagsView'
import { ClaimAPI } from 'api/claims'
import { useNavigate, useParams } from 'react-router-dom'
import { Stack, Button, CircularProgress, Typography } from '@mui/material'
import String from 'utils/strings'
import URL from 'route/url'


export default function WheelView({ conversation, ...restProps }) {

    const [data, setData] = useState({})
    const navigate = useNavigate()
    const {customerId} = useParams()

    useEffect(() => {
        ClaimAPI.getTreeClaims({
            conversationId: conversation.id,
            customerId,
            onSuccess: (res) => {
                setData({
                    id: 'root',
                    type: 'ANS',
                    tags: conversation.tags,
                    text: conversation.question,
                    children: res.data.results
                })
            }
        })
    }, [])

    const onClick = (topClaim) => {
        if (topClaim) {
            navigate(URL.conversation(customerId, conversation.id, topClaim.id))
        } else {
            navigate(URL.conversation(customerId, conversation.id))
        }
    }

    return <Modal open={restProps.open} onClose={restProps.onClose}>
        <Stack
            justifyContent="space-evenly"
            alignItems="center"
            sx={{ maxWidth: '60vw' }}
            spacing={1}>
            {Object.keys(data).length === 0 ? <CircularProgress /> : <SunburstView data={data} onClick={onClick} />}
            <Typography variant='h6'>
                {String.getLinks(conversation?.question)}
            </Typography>
            <TagsView tags={conversation?.tags} />
            <Button
                onClick={onClick}
                variant='outlined'>
                Contribute
            </Button>
        </Stack>
    </Modal>
}