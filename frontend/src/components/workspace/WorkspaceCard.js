import {
    Card,
    ButtonBase,
    CardActionArea,
    CardHeader,
    Avatar,
} from '@mui/material'
import { red } from '@mui/material/colors'
import { useNavigate } from 'react-router-dom'
import URL from 'route/url'


const options = { year: 'numeric', month: 'short', day: 'numeric' }


export default function WorkspaceCard({ customer }) {

    const navigate = useNavigate()

    const name = customer?.name
    const firstLetter = name?.charAt(0)?.toUpperCase()
    const time_created = new Date(customer?.time_created).toLocaleString('en-US', options)

    const onClick = () => {
        if (!customer) return
        navigate(URL.conversation(customer.id), {state: {newUser: true}})
    }

    return <Card sx={{borderRadius: 200, width: '100%'}} disabled={!customer}>
                <CardActionArea
                    component={ButtonBase}
                    onClick={onClick}
                    sx={{ flex: '1 1 auto' }}
                >
        <CardHeader
            avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="workspace">
                    {firstLetter}
                </Avatar>
            }
            title={name}
            subheader={`Created ${time_created}`}
        />
        </CardActionArea>
    </Card>
}