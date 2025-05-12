import { useEffect, useState } from 'react'
import { TagAPI } from 'api/tags'
import {
    Stack,
    TextField,
    Autocomplete,
    Button,
    Box,
    Typography
} from '@mui/material'
import { useParams } from 'react-router-dom'


function TagButton({ tagName, tagNames, setTagNames }) {

    const [isChecked, setIsChecked] = useState(false)

    useEffect(() => {
        setIsChecked(tagNames.includes(tagName))
    }, [tagNames])


    const onClick = (e) => {
        setIsChecked(!isChecked)
        if (isChecked) {
            setTagNames(tagNames.filter(item => item !== tagName))
        } else {
            if (!tagNames.includes(tagName)) {
                setTagNames([...tagNames, tagName])
            }
        }
    }

    return <Button
        disableElevation
        onClick={onClick}
        sx={{ borderRadius: 5, minWidth: 70, textTransform: 'none', margin: 0.5 }}
        variant={isChecked ? 'contained' : 'outlined'}>
        {tagName}
    </Button>
}

function TagButtonList({ options, tagNames, setTagNames }) {
    return <Box
        sx={{ width: '100%' }}>
        {options.map(tagName => <TagButton
            key={tagName}
            tagName={tagName}
            tagNames={tagNames}
            setTagNames={setTagNames} />)}
    </Box>
}


export default function TagsAutocomplete({ tagNames, setTagNames }) {

    const [options, setOption] = useState([])
    const [errorDuplicate, setErrorDuplicate] = useState(false)
    const {customerId} = useParams()

    const errorDuplicateText = errorDuplicate && 'Tag already added!'

    useEffect(() => {
        TagAPI.getTags({
            page: 1,
            customerId,
            onSuccess: res => {
                setOption(res.data.results.map(tag => tag.name))
            }
        })
    }, [])

    return <Stack spacing={2}>
        <Autocomplete
            freeSolo={true}
            options={options}
            multiple
            filterSelectedOptions
            value={tagNames}
            onChange={(event, value, reason, details) => {
                setTagNames(value.map(v => v.replaceAll('/', '-').toLowerCase()))
            }}
            onInputChange={(event, value, reason) => {
                setErrorDuplicate(tagNames.includes(value))
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Add Tags"
                    placeholder="Tags"
                    error={errorDuplicate}
                    helperText={errorDuplicateText}
                />
            )}
        />
        <Typography color='text.secondary'>
            <b>Commonly used tags</b>
        </Typography>
        <TagButtonList options={options.slice(0, 10)} tagNames={tagNames} setTagNames={setTagNames} />
    </Stack>
}