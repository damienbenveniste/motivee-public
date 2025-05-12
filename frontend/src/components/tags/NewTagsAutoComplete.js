import { useEffect, useState, useRef } from 'react'
import { TagAPI } from 'api/tags'
import {
    Stack,
    TextField,
    Autocomplete,
    Typography,
    Chip
} from '@mui/material'
import TagsView from 'components/conversations/TagsView'
import { useParams } from 'react-router-dom'


export default function NewTagsAutocomplete({ fixedOptions, tagNames = [], setTagNames }) {

    const [options, setOptions] = useState([])
    const [errorDuplicate, setErrorDuplicate] = useState(false)
    const {customerId} = useParams()
    const allValues = fixedOptions.concat(tagNames)

    const errorDuplicateText = errorDuplicate && 'Tag already added!'

    useEffect(() => {
        TagAPI.getTags({
            page: 1,
            customerId,
            onSuccess: res => {
                setOptions(res.data.results.map(
                    tag => tag.name
                ).filter(
                    tagName => !fixedOptions.includes(tagName)
                ))
            }
        })
    }, [])


    return <Stack spacing={2}>
        <TagsView tags={allValues} />
        <Typography color='text.secondary'>
            <b>Add additional tags</b>
        </Typography>
        <Autocomplete
            sx={{ width: 400 }}
            freeSolo={true}
            options={options}
            multiple
            filterSelectedOptions
            value={allValues}
            onChange={(event, value, reason, details) => {
                setTagNames(
                    value.map(
                        v => v.replaceAll('/', '-').toLowerCase()
                    ).filter(
                        option => fixedOptions.indexOf(option) === -1
                    )
                )
            }}
            onInputChange={(event, value, reason) => {
                setErrorDuplicate(tagNames.includes(value))
            }}
            renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                    <Chip
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                        disabled={fixedOptions.indexOf(option) !== -1}
                    />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Add more Tags"
                    placeholder="Tags"
                    error={errorDuplicate}
                    helperText={errorDuplicateText}
                />
            )}
        />
    </Stack>
}