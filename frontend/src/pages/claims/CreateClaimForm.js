
import { useState } from 'react'

import {
    Stack,
    Typography,
} from '@mui/material'
import { ClaimAPI } from 'api/claims'
import ButtonWithAlert from 'components/views/ButtonWithAlert'
import palette from 'themes/palette'
import TextFieldWithLinks from 'components/conversations/TextFieldWithLinks'
import String from 'utils/strings'
import ClaimTagsAutocomplete from 'components/tags/ClaimTagsAutoComplete'
import { useParams } from 'react-router-dom'


const typeDict = {
    ANS: 'Answer',
    PRO: 'Supporting claim',
    CON: 'Opposing claim'
}

const colors = {
    PRO: 'success',
    CON: 'error',
    ANS: 'primary'
}


export default function CreateClaimForm({
    conversation,
    type,
    onClose,
    parent = null
}) {

    const [text, setText] = useState('')
    const [tagNames, setTagNames] = useState([])
    const {customerId} = useParams()

    const disabled = (text === '')
    const color = palette[colors[type]].lighter
    const parentText = parent? parent.text : conversation?.question

    var title = null

    switch (type) {
        case 'CON':
            title = 'Add a Con'
            break
        case 'PRO':
            title = 'Add a Pro'
            break
        case 'ANS':
            title = 'Add an Answer'
            break
    }

    return <Stack
        spacing={3}
        sx={{ width: '50vw' }}>
        <Typography variant='h5'>
            {title}
        </Typography>
        <Typography >
            {String.getLinks(parentText)}
        </Typography>
        <TextFieldWithLinks
            label={`Your ${typeDict[type]}`}
            multiline
            rows={4}
            sx={{ bgcolor: color }}
            setValue={setText}
            value={text} />
            <ClaimTagsAutocomplete 
                conversation={conversation}
                tagNames={tagNames}
                setTagNames={setTagNames}/>
        <ButtonWithAlert
            variant='contained'
            disabled={disabled}
            apiCall={ClaimAPI.createClaim}
            apiArgs={{
                text,
                parent: parent?.id,
                conversationId: conversation?.id,
                type,
                tags: tagNames,
                customerId,
            }}
            onSuccess={(res) => setTimeout(() => onClose({ claim: res.data }), 1000)}
            successMessage='The Claim has been created'
        >
            Create
        </ButtonWithAlert>
    </Stack>

}