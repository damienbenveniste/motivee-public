
import { useState } from 'react'
import {
    Box,
    FormControl,
    Select,
    MenuItem,
    ListItemText
} from '@mui/material'


const levelAccessDict = {
    [true]: 'Workspace administrator',
    [false]: 'Member'
}


const adminText = `Administrators can invite and remove guests.
They can change the access levels of the members.
They can change the subscription plan and they can 
delete workspaces`

const memberText = `Member do not have admin rights. They cannot change the 
workspace settings and cannot invite users.
`


export default function AdminSelect({ params, onLevelChange, onDelete }) {
    const [value, setValue] = useState(params.value)
    const inviteeId = params.id

    const handleChange = (event) => {

        switch (event.target.value) {
            case 'delete':
                onDelete(inviteeId)
                break
            default:
                onLevelChange(
                    inviteeId,
                    event.target.value,
                    () => {
                        setValue(event.target.value)
                    }
                )

        }


    }

    return <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth variant="standard">
            <Select
                value={value}
                renderValue={(value) => levelAccessDict[value]}
                onChange={handleChange}
            >
                <MenuItem
                    value={true}>
                    <ListItemText
                        sx={{
                            wordWrap: 'break-word',
                            width: 250,
                        }}
                        secondaryTypographyProps={{ style: { whiteSpace: "normal" } }}
                        primary={levelAccessDict[true]}
                        secondary={adminText} />
                </MenuItem>
                <MenuItem value={false}>
                    <ListItemText
                        sx={{
                            wordWrap: 'break-word',
                            width: 250,
                        }}
                        secondaryTypographyProps={{ style: { whiteSpace: "normal" } }}
                        primary={levelAccessDict[false]}
                        secondary={memberText} />
                </MenuItem>
                <MenuItem value='delete'>
                    <ListItemText
                        primaryTypographyProps={{ style: { color: '#d10000' } }}
                        primary='Remove from workspace' />
                </MenuItem>
            </Select>
        </FormControl>
    </Box>


}