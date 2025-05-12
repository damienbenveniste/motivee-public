import {
    Drawer,
    Box,
    List,
    ListItemText,
} from "@mui/material"
import {
    ListSubheaderStyle,
    ListItemStyle,
    DotIcon,
    getActive
} from 'components/navbar/insight/base'
import { NavLink, useParams, useLocation } from 'react-router-dom'
import URL from 'route/url'


export default function AdminNav() {

    const { customerId } = useParams()
    const { pathname } = useLocation()

    const workspacePath = URL.workspaceAdmin(customerId)
    const billingAdmin = URL.billingAdmin(customerId)

    return <Drawer
        variant="permanent"
        open={true}
        anchor='left'
        PaperProps={{
            sx: {
                width: 250,
                borderRightStyle: 'dashed',
                pt: 10
            },
        }}
        sx={{
            width: 250,
            flexShrink: 0,
        }}
        ModalProps={{
            keepMounted: true, // Better open performance on mobile.
        }}
    >
        <Box >
            <List disablePadding sx={{ px: 2 }}>
                <ListSubheaderStyle>
                    Admin
                </ListSubheaderStyle>
                <ListItemStyle
                    component={NavLink}
                    to={workspacePath}
                    activeRoot={getActive(workspacePath, pathname)} >
                    <DotIcon />
                    <ListItemText primary='Workspace' disableTypography />
                </ListItemStyle>

                <ListItemStyle
                    component={NavLink}
                    to={billingAdmin}
                    activeRoot={getActive(billingAdmin, pathname)} >
                    <DotIcon />
                    <ListItemText primary='Billing' disableTypography />
                </ListItemStyle>


            </List>
        </Box>
    </Drawer>

}
