
import { useState, useEffect } from 'react'

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


export default function EditClaimForm({
    conversation,
    claim,
    onClose,
    onEdit,
}) {

    const [text, setText] = useState('')
    const [type, setType] = useState('')
    const [parent, setParent] = useState(null)
    const [tagNames, setTagNames] = useState([])
    const {customerId} = useParams()

    useEffect(() => {
        if (!claim) return
        setText(claim.text)
        setTagNames(claim.tags)
        setType(claim.type)
        setParent(claim.parent)
    }, [claim])



    const disabled = (text === '')
    const color = palette[colors[type]]?.lighter
    const parentText = parent ? parent.text : conversation?.question

    var title = null

    switch (type) {
        case 'CON':
            title = 'Edit your Con'
            break
        case 'PRO':
            title = 'Edit your Pro'
            break
        case 'ANS':
            title = 'Edit your Answer'
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
            setTagNames={setTagNames} />
        <ButtonWithAlert
            variant='contained'
            disabled={disabled}
            apiCall={ClaimAPI.updateClaim}
            apiArgs={{
                claim,
                text,
                tags: tagNames,
                customerId,
            }}
            onSuccess={(res) => setTimeout(() => {
                const modifiedClaim = {
                    ...claim,
                    ...res.data
                }
                onEdit('UPDATE', [modifiedClaim])
                onClose()
            }, 500)}
            successMessage='The Claim has been Edited'
        >
            Edit
        </ButtonWithAlert>
    </Stack>

}