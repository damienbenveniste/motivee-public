import { useState, useEffect } from 'react'
import {
    Stack,
    Typography,
    TextField,
} from '@mui/material'
import { ConversationAPI } from 'api/conversations'
import ButtonWithAlert from 'components/views/ButtonWithAlert'
import ConversationTypeComponent from 'components/conversations/ConversationTypeComponent'
import TagsAutocomplete from 'components/tags/TagsAutocomplete'
import TextFieldWithLinks from 'components/conversations/TextFieldWithLinks'
import { useParams } from 'react-router-dom'


export default function EditConversationForm({conversation, onClose, onEdit}) {

    const [title, setTitle] = useState('')
    const [question, setQuestion] = useState('')
    const [openEnded, setOpenEnded] = useState(false)
    const [tagNames, setTagNames] = useState([])
    const {customerId} = useParams()

    useEffect(() => {
        if (!conversation) return
        setTitle(conversation.title)
        setQuestion(conversation.question)
        setTagNames(conversation.tags)
        setOpenEnded(conversation.open_ended)

    },  [conversation])

    const disabled = (title === '') || (question === '')

    return <Stack
        spacing={3}
        sx={{ width: '50vw'}}>
        <Typography variant='h4' color='text.secondary'>
            Edit the Conversation
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
        <TagsAutocomplete tagNames={tagNames} setTagNames={setTagNames}/>
        <ButtonWithAlert
            variant='contained'
            disabled={disabled}
            apiCall={ConversationAPI.updateConversation}
            apiArgs={{
                conversation,
                title,
                question,
                open_ended: openEnded,
                tags: tagNames,
                customerId,
            }}
            onSuccess={(res) => {
                onEdit(res.data)
                setTimeout(() => onClose(), 500)
            }}
            successMessage='The Conversation has been edited'
        >
            Edit
        </ButtonWithAlert>
    </Stack>
}