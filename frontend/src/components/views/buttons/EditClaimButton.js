import {useState} from 'react'
import { Button } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import ClaimFormContainer from 'pages/claims/ClaimFormContainer'


export default function EditClaimButton({conversation, claim, onEdit, ...props}) {

    const [open, setOpen] = useState(false)

    const onClick = (event) => {
        event.stopPropagation()
        setOpen(true)
    } 

    const onClose = (event) => {
        if (event) event.stopPropagation()
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
        {open && <ClaimFormContainer
                open={open}
                onClose={onClose}
                onEdit={onEdit}
                conversation={conversation}
                create={false}
                claim={claim}
            />}
 
    </>

}