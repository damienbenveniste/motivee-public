import { useState, useEffect } from 'react'
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@mui/material'
import useUser from 'hooks/useUser'
import { useNavigate, useParams } from 'react-router-dom'
import URL from 'route/url'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CreateWorkspaceView from 'pages/workspaces/CreateWorkspaceView'
import { InviteeAPI } from 'api/invitees'


const ADD_WORKSPACE_VALUE = '__add_workspace__'


export default function WorkSpaceSelect() {

    const [workSpaceId, setWorkSpaceId] = useState('')
    const [workSpaceOptions, setWorkSpaceOptions] = useState([])
    const [open, setOpen] = useState(false)
    const { customerId } = useParams()
    const navigate = useNavigate()

    const onClose = () => setOpen(false)

    useEffect(() => {
        InviteeAPI.getCustomers({
            onSuccess: (res) => {
                const customers = res.data.results.map(w => w.customer)
                const uniqueCustomers = [...new Map(customers.map(customer =>
                    [customer.id, customer])).values()
                ]
                setWorkSpaceOptions(uniqueCustomers)
            }
        })
    }, [customerId])

    useEffect(() => {
        if (workSpaceOptions.length === 0) return
        setWorkSpaceId(customerId)
    }, [workSpaceOptions])

    const handleChange = (event) => {
        if (event.target.value === ADD_WORKSPACE_VALUE) {
            setOpen(true)
            return
        }

        setWorkSpaceId(event.target.value)
        navigate(URL.conversation(event.target.value))
    }

    return <FormControl variant="filled" sx={{ m: 1, minWidth: 300 }}>
        <InputLabel id="demo-simple-select-filled-label">Workspace</InputLabel>
        <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={workSpaceId}
            onChange={handleChange}>

            <MenuItem value={ADD_WORKSPACE_VALUE} sx={{ backgroundColor: '#d7fcdc' }}>
                <ListItemIcon>
                    <AddCircleOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Add new Workspace" />
            </MenuItem>
            {workSpaceOptions.map(customer => {
                return <MenuItem value={customer.id} key={customer.id}>{customer.name}</MenuItem>
            })}

        </Select>
        {open && <CreateWorkspaceView open={open} onClose={onClose} />}
    </FormControl>

}