
import { useState } from 'react'
import { Stack, Typography, Button } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Modal from 'components/views/Modal'
import NewTagsAutocomplete from 'components/tags/NewTagsAutoComplete'
import ButtonWithAlert from 'components/views/ButtonWithAlert'
import { ClaimAPI } from 'api/claims'
import { useParams } from 'react-router-dom'


function TagPrompt({ onClose, open, tags, claim, modifyClaim }) {

    const [tagNames, setTagNames] = useState([])
    const {customerId} = useParams()
    const disabled = tagNames.length === 0

    return <Modal onClose={onClose} open={open}>
        <Stack spacing={1} sx={{ width: 400 }}>
            <NewTagsAutocomplete
                fixedOptions={tags}
                tagNames={tagNames}
                setTagNames={setTagNames} />
            <ButtonWithAlert
                variant='contained'
                disabled={disabled}
                apiCall={ClaimAPI.updateClaim}
                apiArgs={{
                    claim,
                    customerId,
                    tags: tags.concat(tagNames),
                }}
                onSuccess={(res) => setTimeout(() => {
                    const modifiedClaim = {
                        ...claim,
                        ...res.data
                    }
                    modifyClaim('UPDATE', [modifiedClaim])
                    onClose()
                }, 500)}
                successMessage='The Tags have been edited'
            >
                Submit
            </ButtonWithAlert>
        </Stack>
    </Modal>
}


export default function TagsView({ tags, edit = false, claim = null, modifyClaim = null, ...props }) {
    const [open, setOpen] = useState(false)

    const onClick = (event) => {
        event.stopPropagation()
        setOpen(true)
    }
    const onClose = () => setOpen(false)

    return <Stack
        direction='row'
        justifyContent="flex-end"
        alignItems="center"
        sx={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap'
        }}
        {...props}>
        {edit && <Button
            disabled={!edit}
            onClick={onClick}
            variant='outlined'
            size='small'
            startIcon={<AddCircleIcon />}
            sx={{
                borderRadius: 200,
                height: 40,
                margin: 0.5
            }}>
            Add Tag
        </Button>}
        {tags?.map(tag => {
            return <Typography
                variant='caption'
                key={tag}
                sx={{
                    border: '1px solid grey',
                    borderRadius: 200,
                    margin: 0.5,
                    height: 40,
                    padding: 1,
                    color: 'text.secondary'
                }}>
                {tag}
            </Typography>
        })}
        {open && <TagPrompt
            claim={claim}
            tags={tags}
            modifyClaim={modifyClaim}
            onClose={onClose}
            open={open} />}
    </Stack>

}