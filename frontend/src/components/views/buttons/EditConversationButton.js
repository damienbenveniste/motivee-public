import { useState } from 'react'
import { Button } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import ConversationFormContainer from 'pages/finder/ConversationFormContainer'



export default function EditConversationButton({ conversation, onEdit, ...props }) {

    const [open, setOpen] = useState(false)

    const onClick = () => {
        setOpen(true)
    }

    const onClose = () => {
        setOpen(false)
    }

    return <>
        <Button
            {...props}
            onClick={onClick}
            variant='outlined'
            endIcon={<EditIcon />}
        >
            Edit
        </Button>
        {open && <ConversationFormContainer
            open={open}
            onClose={onClose}
            onEdit={onEdit}
            conversation={conversation}
            create={false} />}
    </>


}