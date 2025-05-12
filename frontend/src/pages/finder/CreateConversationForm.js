import { useState } from 'react'
import {
    Stack,
    Typography,
    TextField,
} from '@mui/material'
import { ConversationAPI } from 'api/conversations'
import { useNavigate, useParams } from 'react-router-dom'
import ButtonWithAlert from 'components/views/ButtonWithAlert'
import ConversationTypeComponent from 'components/conversations/ConversationTypeComponent'
import TagsAutocomplete from 'components/tags/TagsAutocomplete'
import TextFieldWithLinks from 'components/conversations/TextFieldWithLinks'
import URL from 'route/url'


export default function CreateConversationForm() {

    const [title, setTitle] = useState('')
    const [question, setQuestion] = useState('')
    const [openEnded, setOpenEnded] = useState(false)
    const [tagNames, setTagNames] = useState([])
    const { customerId } = useParams()
    const navigate = useNavigate()

    const disabled = (title === '') || (question === '')

    return <Stack
        spacing={3}
        sx={{ width: '50vw' }}>
        <Typography variant='h4' color='text.secondary'>
            Create a Conversation
        </Typography>
        <TextField
            label='Short title'
            onChange={event => setTitle(event.target.value)}
            value={title}
        />
        <TextFieldWithLinks
            label='Conversation question'
            multiline
            rows={4}
            setValue={setQuestion}
            value={question}
        />
        <ConversationTypeComponent openEnded={openEnded} setOpenEnded={setOpenEnded} />
        <TagsAutocomplete tagNames={tagNames} setTagNames={setTagNames} />
        <ButtonWithAlert
            variant='contained'
            disabled={disabled}
            apiCall={ConversationAPI.createConversation}
            apiArgs={{
                title,
                question,
                open_ended: openEnded,
                tags: tagNames,
                customerId,
            }}
            onSuccess={(res) => navigate(URL.conversation(customerId, res.data.id))}
            successMessage='The Conversation has been created'
        >
            Create
        </ButtonWithAlert>
    </Stack>
}