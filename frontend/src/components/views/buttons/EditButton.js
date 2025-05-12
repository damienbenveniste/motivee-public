import BorderColorIcon from '@mui/icons-material/BorderColor'
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { IconButton, Tooltip } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import URL from 'route/url'


export default function EditButton({conversation, ...props}) {
    const navigate = useNavigate()
    const {customerId} = useParams()

    const onClick = () => {
        navigate(URL.conversation(customerId, conversation.id))
    }

    return <Tooltip title='Contribute'>
        <IconButton {...props} onClick={onClick}>
            <BorderColorIcon fontSize="inherit" />
        </IconButton>
    </Tooltip>
}


