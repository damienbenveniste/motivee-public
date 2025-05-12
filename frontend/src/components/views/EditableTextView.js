import { useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import { TextField, Typography, IconButton, Button, Stack } from '@mui/material'


export default function EditableTextView({ text, ...props }) {

    const [isEditing, setIsEditing] = useState(false)

    const onSave = () => {
        setIsEditing(false)
    }

    const onEdit = () => {
        setIsEditing(true)
    }

    const editView = <Stack
        direction='row'
        justifyContent="center"
        alignItems="center"
        spacing={1}>
        <TextField 
        sx={{width: 200}}
        variant="standard"
        value={text} />
        <Button onClick={onSave}>
            Save
        </Button>
    </Stack>

    const nonEditView = <Stack
        direction='row'
        justifyContent="center"
        alignItems="center"
        spacing={1}>
        <Typography {...props}>
            {text}
        </Typography>
        <IconButton onClick={onEdit}>
            <EditIcon color='primary' />
        </IconButton>
    </Stack >

    return (
        isEditing ? editView : nonEditView
    )









}