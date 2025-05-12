import {
    List,
    Box,
    ListItemText,
} from '@mui/material'
import { NavLink, useLocation, useParams } from 'react-router-dom'
import URL from 'route/url'
import {
    ListSubheaderStyle,
    ListItemStyle,
    DotIcon,
    getActive
} from './base'


export default function OverviewSection({ conversation, ...other }) {

    const { pathname } = useLocation()
    const {customerId} = useParams()
    const overallPath = URL.insightOverview(customerId, conversation?.id)

    return (
        <Box {...other}>
            <List disablePadding sx={{ px: 2 }}>
                <ListSubheaderStyle>
                    Overview
                </ListSubheaderStyle>
                <ListItemStyle
                    component={NavLink}
                    to={overallPath}
                    activeRoot={getActive(overallPath, pathname)} >
                    <DotIcon />
                    <ListItemText primary='Overall' disableTypography />
                </ListItemStyle>
            </List>
        </Box>
    )
}